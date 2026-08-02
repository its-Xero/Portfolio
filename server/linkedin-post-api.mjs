import http from 'node:http';
import { URL } from 'node:url';

const PORT = Number(process.env.PORT || 3001);
const HOST = '0.0.0.0';

function decodeHtmlEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rdquo;/g, '”')
    .replace(/&ldquo;/g, '“');
}

function extractMeta(html, propertyNames) {
  for (const propertyName of propertyNames) {
    const regex = new RegExp(`<meta[^>]+(?:property|name)=['\"]${propertyName}['\"][^>]+content=['\"]([^'\"]+)['\"][^>]*>`, 'i');
    const match = html.match(regex);
    if (match?.[1]) {
      return decodeHtmlEntities(match[1].trim());
    }
  }
  return '';
}

function extractTitle(html) {
  const titleRegex = /<title[^>]*>(.*?)<\/title>/is;
  const match = html.match(titleRegex);
  if (match?.[1]) {
    return decodeHtmlEntities(match[1].replace(/\s+/g, ' ').trim());
  }
  return 'LinkedIn post';
}

function extractPublishedDate(html) {
  const metadataDate = extractMeta(html, [
    'article:published_time',
    'datePublished',
    'publishdate',
    'date',
  ]);

  if (metadataDate) return metadataDate;

  const jsonLdMatches = html.matchAll(/<script[^>]+type=['"]application\/ld\+json['"][^>]*>([\s\S]*?)<\/script>/gi);
  for (const match of jsonLdMatches) {
    try {
      const parsed = JSON.parse(match[1].trim());
      const items = Array.isArray(parsed) ? parsed : [parsed, ...(parsed['@graph'] || [])];
      const dateItem = items.find((item) => item?.datePublished || item?.dateCreated);
      if (dateItem?.datePublished || dateItem?.dateCreated) {
        return dateItem.datePublished || dateItem.dateCreated;
      }
    } catch {
      // Ignore malformed JSON-LD blocks and continue with HTML fallbacks.
    }
  }

  const timeMatch = html.match(/<time[^>]+datetime=['"]([^'"]+)['"]/i);
  if (timeMatch?.[1]) return timeMatch[1];

  const embeddedDateMatch = html.match(/(?:datePublished|publishedAt|published_time)['"]?\s*:\s*['"]([^'"]+)['"]/i);
  return embeddedDateMatch?.[1] || '';
}

function normalizeDate(value) {
  if (!value) return '';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
}

async function getLinkedInMetadata(url) {
  const target = new URL(url);
  const response = await fetch(target.href, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`LinkedIn request failed with status ${response.status}`);
  }

  const html = await response.text();
  const title = extractTitle(html) || 'LinkedIn post';
  const description = extractMeta(html, ['og:description', 'description']) || '';
  const image = extractMeta(html, ['og:image', 'twitter:image']) || '';
  const publishedDate = extractPublishedDate(html);
  const alt = title ? `${title} preview` : 'LinkedIn post preview';

  return {
    title,
    excerpt: description,
    description,
    image,
    date: normalizeDate(publishedDate),
    alt,
  };
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing URL.' }));
    return;
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && requestUrl.pathname === '/api/linkedin-post') {
    const rawUrl = requestUrl.searchParams.get('url');

    if (!rawUrl) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Please provide a LinkedIn post URL.' }));
      return;
    }

    try {
      const metadata = await getLinkedInMetadata(rawUrl);
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end(JSON.stringify(metadata));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to fetch LinkedIn metadata.' }));
    }
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify({ error: 'Not found.' }));
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. The LinkedIn metadata API may already be running.`);
    process.exitCode = 0;
    return;
  }

  throw error;
});

server.listen(PORT, HOST, () => {
  console.log(`LinkedIn metadata API listening on http://${HOST}:${PORT}`);
});
