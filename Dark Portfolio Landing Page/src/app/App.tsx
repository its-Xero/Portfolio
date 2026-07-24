import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowLeft, Twitter, Linkedin, Dribbble } from "lucide-react";

/* ─── design tokens ─────────────────────────────────────────────────────── */

const C = {
  bg: "#0A0A0A",
  surface: "#141414",
  text: "#F5F5F5",
  muted: "#878787",
  border: "#1F1F1F",
};

/* ─── data ──────────────────────────────────────────────────────────────── */

const LOADING_WORDS = ["Design", "Create", "Inspire"];
const ROLES = ["Creative", "Designer", "Visionary", "Strategist"];

const ALL_PROJECTS = [
  {
    title: "Social Campaign — Apparel",
    category: "Social Media",
    year: "2026",
    description: "A full editorial Instagram campaign for a streetwear label — grid layout, story templates, and motion cover assets.",
    image: "https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=900&h=1100&fit=crop&auto=format",
    alt: "Fashion editorial campaign — woman in black blazer",
  },
  {
    title: "Packaging Design — Cosmetics",
    category: "Packaging",
    year: "2025",
    description: "End-to-end packaging system for a luxury skincare brand: structural design, typography, and material specification.",
    image: "https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=700&h=900&fit=crop&auto=format",
    alt: "Luxury cosmetics packaging arranged on dark surface",
  },
  {
    title: "Mobile UI — Wellness App",
    category: "UI/UX",
    year: "2025",
    description: "Dark-mode interface for a mindfulness and sleep tracking app, with a custom design system and component library.",
    image: "https://images.unsplash.com/photo-1720135885007-454165745e21?w=700&h=900&fit=crop&auto=format",
    alt: "Dark mode wellness mobile app on device",
  },
  {
    title: "Brand Identity System",
    category: "Branding",
    year: "2024",
    description: "Complete visual identity for a boutique creative studio — logo, color system, type hierarchy, and usage guidelines.",
    image: "https://images.unsplash.com/photo-1702479743967-3dcccd4a671d?w=900&h=1100&fit=crop&auto=format",
    alt: "Brand identity business cards on dark surface",
  },
  {
    title: "E-Commerce Redesign",
    category: "UI/UX",
    year: "2026",
    description: "Full product page and checkout flow redesign for a fashion retailer, improving conversion with a premium dark editorial feel.",
    image: "https://images.unsplash.com/photo-1645518557701-406efe2120ce?w=900&h=1100&fit=crop&auto=format",
    alt: "Dark e-commerce website on desktop monitor",
  },
  {
    title: "Skincare Line — Packaging",
    category: "Packaging",
    year: "2025",
    description: "Packaging system for a clinical skincare line — minimalist, medical-grade aesthetic with tactile finish specification.",
    image: "https://images.unsplash.com/photo-1771955216611-0a826d819978?w=700&h=900&fit=crop&auto=format",
    alt: "Skincare serum bottles stacked product shot",
  },
  {
    title: "Festival Visual Identity",
    category: "Branding",
    year: "2025",
    description: "Full visual identity for an electronic music festival: poster series, stage graphics, social assets, and wayfinding.",
    image: "https://images.unsplash.com/photo-1782512855563-f9bf64382270?w=900&h=1100&fit=crop&auto=format",
    alt: "Music festival dark neon branding poster",
  },
  {
    title: "Analytics Dashboard UI",
    category: "UI/UX",
    year: "2024",
    description: "Data visualization dashboard for a SaaS product — custom chart components, dark theme, and a scalable token system.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=1100&fit=crop&auto=format",
    alt: "Analytics dashboard graphs on laptop screen",
  },
];

const FEATURED_PROJECTS = ALL_PROJECTS.slice(0, 4);

const JOURNAL = [
  {
    title: "Building a Social Media Design System from Scratch",
    excerpt: "How I systematized a chaotic workflow into a scalable visual library.",
    readTime: "5 min read",
    date: "May 2026",
    image: "https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=128&h=128&fit=crop&auto=format",
    alt: "Dark design workspace with monitors",
  },
  {
    title: "Why Packaging Design Is Just UI for Physical Products",
    excerpt: "The surprising overlap between screen interfaces and shelf presence.",
    readTime: "4 min read",
    date: "April 2026",
    image: "https://images.unsplash.com/photo-1632452479455-e3d5e3159b63?w=128&h=128&fit=crop&auto=format",
    alt: "Close-up of cosmetics on a dark table",
  },
  {
    title: "The Invisible Rules Behind Every Great Instagram Grid",
    excerpt: "Color blocking, rhythm, and the silent grammar of visual feeds.",
    readTime: "3 min read",
    date: "March 2026",
    image: "https://images.unsplash.com/photo-1514168757508-07ffe9ae125b?w=128&h=128&fit=crop&auto=format",
    alt: "Dual monitors displaying design work",
  },
  {
    title: "When Brand Guidelines Actually Help You Move Faster",
    excerpt: "Constraints as creative catalysts — a counterintuitive take.",
    readTime: "6 min read",
    date: "February 2026",
    image: "https://images.unsplash.com/photo-1703188557369-4c86a7474a3c?w=128&h=128&fit=crop&auto=format",
    alt: "Designer workspace with brand materials",
  },
];

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=420&h=420&fit=crop&auto=format", alt: "Editorial fashion portrait" },
  { src: "https://images.unsplash.com/photo-1735480222193-3fe22ffd70b6?w=420&h=420&fit=crop&auto=format", alt: "Woman in black coat, cinematic dark" },
  { src: "https://images.unsplash.com/photo-1704118548751-e41e7171a119?w=420&h=420&fit=crop&auto=format", alt: "Luxury wine packaging box" },
  { src: "https://images.unsplash.com/photo-1706700392642-dee59f678a09?w=420&h=420&fit=crop&auto=format", alt: "Mobile app screens side by side" },
  { src: "https://images.unsplash.com/photo-1702479744120-98fffb81bf6d?w=420&h=420&fit=crop&auto=format", alt: "Wooden brand mockup on table" },
  { src: "https://images.unsplash.com/photo-1567095751004-aa51a2690368?w=420&h=420&fit=crop&auto=format", alt: "Abstract gray and blue texture" },
];

const CATEGORIES = ["All", "UI/UX", "Social Media", "Packaging", "Branding"];

/* ─── shared styles injected once ───────────────────────────────────────── */

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { margin: 0; background: #0A0A0A; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 0; }

  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes scrollPulse {
    0%   { transform: translateY(-100%); opacity: 0; }
    30%  { opacity: 1; }
    100% { transform: translateY(200%); opacity: 0; }
  }
  @keyframes greenPulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%     { opacity: 0.4; transform: scale(1.5); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .nav-btn {
    padding: 6px 14px; border-radius: 9999px; border: none;
    cursor: pointer; font-size: 13px; font-family: Inter, sans-serif;
    transition: background 0.2s, color 0.2s;
  }
  .nav-btn.active  { background: rgba(245,245,245,0.09); color: #F5F5F5; }
  .nav-btn.inactive { background: transparent; color: #878787; }
  .nav-btn.inactive:hover { color: #C0C0C0; }

  .say-hi {
    display: flex; align-items: center; gap: 4px;
    padding: 6px 14px; border-radius: 9999px;
    border: 1px solid #1F1F1F; background: transparent;
    color: #F5F5F5; font-size: 13px; font-family: Inter, sans-serif;
    cursor: pointer; transition: border-color 0.2s;
  }
  .say-hi:hover {
    border-color: transparent;
    background: linear-gradient(rgba(20,20,20,0.9), rgba(20,20,20,0.9)) padding-box,
                linear-gradient(135deg, #89AACC, #4E85BF) border-box;
  }

  .cta-fill {
    padding: 13px 30px; border-radius: 9999px; border: 1px solid transparent;
    background: #F5F5F5; color: #0A0A0A;
    font-size: 14px; font-family: Inter, sans-serif; font-weight: 500;
    cursor: pointer; transition: background 0.25s, color 0.25s;
  }
  .cta-fill:hover {
    background: linear-gradient(#0A0A0A, #0A0A0A) padding-box,
                linear-gradient(135deg, #89AACC, #4E85BF) border-box;
    color: #F5F5F5;
  }

  .cta-outline {
    padding: 13px 30px; border-radius: 9999px;
    border: 1px solid #1F1F1F; background: transparent;
    color: #F5F5F5; font-size: 14px; font-family: Inter, sans-serif;
    cursor: pointer; transition: border-color 0.25s;
  }
  .cta-outline:hover {
    border-color: transparent;
    background: linear-gradient(#0A0A0A, #0A0A0A) padding-box,
                linear-gradient(135deg, #89AACC, #4E85BF) border-box;
  }

  .pill-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 20px; border-radius: 9999px; border: 1px solid #1F1F1F;
    background: transparent; color: #878787; font-size: 13px;
    font-family: Inter, sans-serif; cursor: pointer; white-space: nowrap;
    flex-shrink: 0; transition: border-color 0.2s, color 0.2s;
  }
  .pill-btn:hover {
    color: #F5F5F5; border-color: transparent;
    background: linear-gradient(#0A0A0A, #0A0A0A) padding-box,
                linear-gradient(135deg, #89AACC, #4E85BF) border-box;
  }

  .journal-pill {
    display: flex; align-items: center; gap: 20px;
    padding: 16px 24px; border-radius: 9999px;
    border: 1px solid #1F1F1F; background: transparent;
    cursor: pointer; transition: background 0.2s, border-color 0.2s;
  }
  .journal-pill:hover { background: rgba(20,20,20,0.8); border-color: #2a2a2a; }

  .gallery-img {
    width: 100%; height: 100%; object-fit: cover; opacity: 0.55;
    transition: opacity 0.3s, transform 0.5s;
  }
  .gallery-card:hover .gallery-img { opacity: 0.75; transform: scale(1.04); }

  .filter-pill {
    padding: 8px 20px; border-radius: 9999px; border: 1px solid #1F1F1F;
    background: transparent; color: #878787; font-size: 13px;
    font-family: Inter, sans-serif; cursor: pointer;
    transition: all 0.2s ease; white-space: nowrap;
  }
  .filter-pill:hover { color: #F5F5F5; border-color: #333; }
  .filter-pill.active {
    color: #F5F5F5; border-color: transparent;
    background: linear-gradient(#141414, #141414) padding-box,
                linear-gradient(135deg, #89AACC, #4E85BF) border-box;
  }

  .back-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 9999px; border: 1px solid #1F1F1F;
    background: transparent; color: #878787; font-size: 13px;
    font-family: Inter, sans-serif; cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
  }
  .back-btn:hover { color: #F5F5F5; border-color: #333; }

  @media (max-width: 900px) {
    .bento-row { grid-template-columns: 1fr !important; }
    .bento-sub-row { grid-template-columns: 1fr !important; grid-column: 1 !important; }
    .hero-name { font-size: clamp(52px, 12vw, 80px) !important; }
    .footer-bar { flex-direction: column; gap: 16px; align-items: center; text-align: center; }
    .stats-row { flex-direction: column !important; }
    .stat-col { border-right: none !important; border-bottom: 1px solid #1F1F1F; padding: 40px 24px !important; }
    .stat-col:last-child { border-bottom: none; }
    .section-header { flex-direction: column; align-items: flex-start !important; gap: 20px; }
    .gallery-cols { display: none !important; }
    .journal-pill { border-radius: 20px; }
    .projects-grid { grid-template-columns: 1fr !important; }
  }
  @media (min-width: 901px) and (max-width: 1200px) {
    .projects-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
`;

/* ─── helpers ───────────────────────────────────────────────────────────── */

function GradientRing({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        padding: "1px",
        borderRadius: 9999,
        background: "linear-gradient(135deg, #89AACC, #4E85BF)",
        display: "inline-flex",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div style={{ width: 20, height: 1, background: C.border }} />
      <span style={{ color: C.muted, fontSize: "11px", letterSpacing: "0.18em", fontFamily: "Inter, sans-serif", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

/* ─── project card ──────────────────────────────────────────────────────── */

function ProjectCard({ project }: { project: (typeof ALL_PROJECTS)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 24,
        overflow: "hidden",
        minHeight: 400,
        cursor: "pointer",
      }}
    >
      <img
        src={project.image}
        alt={project.alt}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)",
          transform: hovered ? "scale(1.06)" : "scale(1)",
        }}
      />
      {/* halftone */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.35) 1px, transparent 1px)",
          backgroundSize: "7px 7px",
          pointerEvents: "none",
        }}
      />
      {/* hover overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(10,10,10,0.72)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div
          style={{
            padding: "10px 22px",
            borderRadius: 9999,
            border: "1px solid transparent",
            background: "linear-gradient(rgba(10,10,10,0.9), rgba(10,10,10,0.9)) padding-box, linear-gradient(135deg, #89AACC, #4E85BF) border-box",
            color: C.text,
            fontSize: "13px",
            fontFamily: "Inter, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          View —{" "}
          <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "14px" }}>
            {project.title}
          </em>
        </div>
      </div>
      {/* bottom label */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "28px 24px 20px",
          background: "linear-gradient(to top, rgba(10,10,10,0.92) 0%, transparent 100%)",
        }}
      >
        <div style={{ color: C.muted, fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 5 }}>
          {project.category} · {project.year}
        </div>
        <div style={{ color: C.text, fontSize: "15px", fontWeight: 500, fontFamily: "Inter, sans-serif" }}>
          {project.title}
        </div>
      </div>
    </div>
  );
}

/* ─── ALL PROJECTS PAGE ─────────────────────────────────────────────────── */

function AllProjectsPage({ onBack }: { onBack: () => void }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? ALL_PROJECTS
      : ALL_PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <div
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        animation: "fadeIn 0.4s ease both",
      }}
    >
      {/* ── top bar ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: `1px solid ${C.border}`,
          background: "rgba(10,10,10,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={14} />
          Back to portfolio
        </button>

        <GradientRing>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: C.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "12px", color: C.text }}>
              YI
            </span>
          </div>
        </GradientRing>
      </div>

      {/* ── page header ── */}
      <div style={{ padding: "80px 40px 56px", maxWidth: 1280, margin: "0 auto" }}>
        <Eyebrow label="Portfolio" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
          <h1 style={{ margin: 0, lineHeight: 1.0 }}>
            <span
              style={{
                display: "block",
                fontFamily: "Inter, sans-serif",
                fontWeight: 300,
                fontSize: "clamp(40px, 6vw, 72px)",
                color: C.text,
              }}
            >
              All
            </span>
            <em
              style={{
                display: "block",
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: "clamp(40px, 6vw, 72px)",
                color: C.text,
                letterSpacing: "-0.02em",
              }}
            >
              projects.
            </em>
          </h1>
          <p style={{ color: C.muted, fontSize: "14px", maxWidth: 360, lineHeight: 1.75, margin: 0 }}>
            {ALL_PROJECTS.length} projects across UI/UX design, social media campaigns, packaging systems, and brand identity.
          </p>
        </div>

        {/* filters */}
        <div style={{ display: "flex", gap: 8, marginTop: 48, flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${activeFilter === cat ? "active" : ""}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
              {cat !== "All" && (
                <span style={{ marginLeft: 6, color: C.muted, fontSize: "11px" }}>
                  {ALL_PROJECTS.filter((p) => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* count label */}
        <div style={{ marginTop: 16, color: C.muted, fontSize: "12px", letterSpacing: "0.08em" }}>
          Showing {filtered.length} of {ALL_PROJECTS.length}
        </div>
      </div>

      {/* ── projects grid ── */}
      <div style={{ padding: "0 40px 120px", maxWidth: 1280, margin: "0 auto" }}>
        <div
          className="projects-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {filtered.map((project, i) => (
            <div
              key={project.title}
              style={{ animation: `fadeUp 0.5s ease ${i * 0.07}s both` }}
            >
              <ProjectCard project={project} />
              {/* description below card */}
              <div style={{ padding: "16px 4px 0" }}>
                <p style={{ color: C.muted, fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* empty state */}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "100px 0", color: C.muted }}>
            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "32px", display: "block", marginBottom: 12 }}>
              Nothing here yet.
            </em>
            <span style={{ fontSize: "14px" }}>More work coming soon.</span>
          </div>
        )}
      </div>

      {/* ── footer strip ── */}
      <div
        style={{
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 40px",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <span style={{ color: C.muted, fontSize: "12px" }}>© 2026 Your Name. All rights reserved.</span>
        <button className="back-btn" onClick={onBack} style={{ padding: "8px 16px", fontSize: "12px" } as React.CSSProperties}>
          <ArrowLeft size={12} />
          Back to portfolio
        </button>
      </div>
    </div>
  );
}

/* ─── HOME PAGE ─────────────────────────────────────────────────────────── */

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "projects">("home");
  const [isLoading, setIsLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const [activeNav, setActiveNav] = useState("Home");
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleVisible, setRoleVisible] = useState(true);

  const goToProjects = () => {
    setCurrentPage("projects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goHome = () => {
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const iv = setInterval(() => {
      setCounter((n) => {
        if (n >= 100) { clearInterval(iv); setTimeout(() => setIsLoading(false), 500); return 100; }
        return n + 1;
      });
    }, 26);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    const iv = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => { setWordIndex((i) => (i + 1) % LOADING_WORDS.length); setWordVisible(true); }, 350);
    }, 1100);
    return () => clearInterval(iv);
  }, [isLoading]);

  useEffect(() => {
    const iv = setInterval(() => {
      setRoleVisible(false);
      setTimeout(() => { setRoleIndex((i) => (i + 1) % ROLES.length); setRoleVisible(true); }, 300);
    }, 2600);
    return () => clearInterval(iv);
  }, []);

  /* ── LOADING SCREEN ── */
  if (isLoading) {
    return (
      <>
        <style>{GLOBAL_STYLES}</style>
        <div style={{ position: "fixed", inset: 0, background: C.bg, fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column" }}>
          <div style={{ position: "absolute", top: 32, left: 36 }}>
            <span style={{ color: C.muted, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase" }}>Portfolio</span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: "clamp(64px, 10vw, 100px)",
                color: "rgba(245,245,245,0.8)",
                transition: "opacity 0.35s ease",
                opacity: wordVisible ? 1 : 0,
                userSelect: "none",
                letterSpacing: "-0.02em",
              }}
            >
              {LOADING_WORDS[wordIndex]}
            </span>
          </div>
          <div style={{ position: "absolute", bottom: 56, right: 40 }}>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(88px, 13vw, 120px)", color: C.text, fontVariantNumeric: "tabular-nums", lineHeight: 1, letterSpacing: "-0.03em" }}>
              {String(counter).padStart(3, "0")}
            </span>
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: C.border }}>
            <div
              style={{
                height: "100%",
                width: `${counter}%`,
                background: "linear-gradient(90deg, #89AACC, #4E85BF)",
                boxShadow: "0 0 18px rgba(78,133,191,0.8), 0 0 6px rgba(137,170,204,0.6)",
                transition: "width 0.08s linear",
              }}
            />
          </div>
        </div>
      </>
    );
  }

  /* ── PROJECTS PAGE ── */
  if (currentPage === "projects") {
    return (
      <>
        <style>{GLOBAL_STYLES}</style>
        <AllProjectsPage onBack={goHome} />
      </>
    );
  }

  /* ── HOME ── */
  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ background: C.bg, color: C.text, fontFamily: "Inter, sans-serif" }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <img
              src="https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1920&h=1080&fit=crop&auto=format"
              alt="Dark cinematic abstract water and sky background"
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.28) blur(3px)", transform: "scale(1.06)" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 220, background: `linear-gradient(to top, ${C.bg}, transparent)` }} />
          </div>

          {/* navbar */}
          <nav
            style={{
              position: "sticky", top: 24, zIndex: 50, marginTop: 24,
              display: "flex", alignItems: "center",
              background: "rgba(20,20,20,0.82)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${C.border}`, borderRadius: 9999, padding: "6px 8px",
              animation: "fadeUp 0.6s ease both",
            }}
          >
            <GradientRing style={{ marginRight: 4 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "13px", color: C.text }}>YI</span>
              </div>
            </GradientRing>
            <div style={{ width: 1, height: 20, background: C.border, margin: "0 6px" }} />
            {["Home", "Work", "Resume"].map((link) => (
              <button key={link} className={`nav-btn ${activeNav === link ? "active" : "inactive"}`} onClick={() => setActiveNav(link)}>
                {link}
              </button>
            ))}
            <div style={{ width: 1, height: 20, background: C.border, margin: "0 6px" }} />
            <button className="say-hi">Say hi <ArrowUpRight size={11} /></button>
          </nav>

          {/* hero content */}
          <div
            style={{
              position: "relative", zIndex: 10, flex: 1,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              textAlign: "center", padding: "80px 24px 140px",
              animation: "fadeUp 0.9s ease 0.15s both",
            }}
          >
            <span style={{ color: C.muted, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 32, display: "block" }}>
              Collection &apos;26
            </span>
            <h1
              className="hero-name"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "clamp(64px, 9.5vw, 108px)", color: C.text, lineHeight: 1.0, margin: "0 0 22px", letterSpacing: "-0.025em" }}
            >
              Your Name
            </h1>
            <p style={{ color: C.muted, fontSize: "16px", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", justifyContent: "center" }}>
              {"A "}
              <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: C.text, fontSize: "17px", display: "inline-block", transition: "opacity 0.3s ease", opacity: roleVisible ? 1 : 0, minWidth: 110, textAlign: "center" }}>
                {ROLES[roleIndex]}
              </em>
              {" based in New York."}
            </p>
            <p style={{ color: C.muted, fontSize: "14px", lineHeight: 1.75, maxWidth: 400, margin: "0 0 44px" }}>
              Crafting digital interfaces, social campaigns, and packaging systems that feel considered from every angle.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <button className="cta-fill" onClick={goToProjects}>See Works</button>
              <button className="cta-outline">Reach out...</button>
            </div>
          </div>

          {/* scroll indicator */}
          <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, zIndex: 10 }}>
            <span style={{ color: C.muted, fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase" }}>Scroll</span>
            <div style={{ width: 1, height: 44, background: C.border, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(to bottom, #89AACC, transparent)", animation: "scrollPulse 2s ease infinite" }} />
            </div>
          </div>
        </section>

        {/* ══ SELECTED WORKS ════════════════════════════════════════════════ */}
        <section style={{ padding: "110px 40px", maxWidth: 1280, margin: "0 auto" }}>
          <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60 }}>
            <div>
              <Eyebrow label="Selected Work" />
              <h2 style={{ margin: 0, lineHeight: 1.05 }}>
                <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: "clamp(36px, 4.5vw, 52px)", color: C.text }}>Featured</span>
                <em style={{ display: "block", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "clamp(36px, 4.5vw, 52px)", color: C.text }}>projects.</em>
              </h2>
              <p style={{ color: C.muted, fontSize: "14px", marginTop: 16, maxWidth: 400, lineHeight: 1.7 }}>
                A selection of my work across UI/UX, social media campaigns, and packaging systems.
              </p>
            </div>
            <button className="pill-btn" onClick={goToProjects}>
              View all work <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="bento-row" style={{ display: "grid", gridTemplateColumns: "7fr 5fr", gap: 16 }}>
            <ProjectCard project={FEATURED_PROJECTS[0]} />
            <ProjectCard project={FEATURED_PROJECTS[1]} />
            <div className="bento-sub-row" style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gridColumn: "1 / -1", gap: 16 }}>
              <ProjectCard project={FEATURED_PROJECTS[2]} />
              <ProjectCard project={FEATURED_PROJECTS[3]} />
            </div>
          </div>
        </section>

        {/* ══ JOURNAL ═══════════════════════════════════════════════════════ */}
        <section style={{ padding: "80px 40px 110px", maxWidth: 1280, margin: "0 auto" }}>
          <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 52 }}>
            <div>
              <Eyebrow label="Recent Work" />
              <h2 style={{ margin: 0, lineHeight: 1.05 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: "clamp(36px, 4.5vw, 52px)", color: C.text }}>Recent{" "}</span>
                <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "clamp(36px, 4.5vw, 52px)", color: C.text }}>thoughts</em>
              </h2>
              <p style={{ color: C.muted, fontSize: "14px", marginTop: 16, maxWidth: 400, lineHeight: 1.7 }}>
                Notes on design, process, and the things I find worth writing about.
              </p>
            </div>
            <button className="pill-btn">View all <ArrowUpRight size={13} /></button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {JOURNAL.map((entry, i) => (
              <div key={i} className="journal-pill">
                <img src={entry.image} alt={entry.alt} style={{ width: 56, height: 56, borderRadius: 14, objectFit: "cover", flexShrink: 0, background: C.surface }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: "15px", color: C.text, marginBottom: 5 }}>{entry.title}</div>
                  <div style={{ color: C.muted, fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.excerpt}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, color: C.muted, fontSize: "12px", lineHeight: 1.9 }}>
                  <div>{entry.readTime}</div>
                  <div>{entry.date}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ VISUAL EXPLORATIONS ═══════════════════════════════════════════ */}
        <section style={{ position: "relative", padding: "100px 0 120px", overflow: "hidden", minHeight: "82vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="gallery-cols" style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: "0 40px", pointerEvents: "none" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: -56 }}>
              {GALLERY_IMAGES.slice(0, 3).map((img, i) => (
                <div key={i} className="gallery-card" style={{ borderRadius: 20, overflow: "hidden", border: `1px solid ${C.border}`, background: C.surface, flex: 1, minHeight: 220 }}>
                  <img className="gallery-img" src={img.src} alt={img.alt} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 72 }}>
              {GALLERY_IMAGES.slice(3).map((img, i) => (
                <div key={i} className="gallery-card" style={{ borderRadius: 20, overflow: "hidden", border: `1px solid ${C.border}`, background: C.surface, flex: 1, minHeight: 220 }}>
                  <img className="gallery-img" src={img.src} alt={img.alt} />
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.72)" }} />
          </div>

          <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px" }}>
            <Eyebrow label="Explorations" />
            <h2 style={{ margin: "0 0 18px", lineHeight: 1.05 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: "clamp(36px, 4.5vw, 52px)", color: C.text }}>Visual{" "}</span>
              <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "clamp(36px, 4.5vw, 52px)", color: C.text }}>playground</em>
            </h2>
            <p style={{ color: C.muted, fontSize: "14px", maxWidth: 380, lineHeight: 1.75, marginBottom: 36 }}>
              Experimental work, motion studies, social templates, and packaging mockups.
            </p>
            <GradientRing>
              <button style={{ padding: "12px 26px", borderRadius: 9999, border: "none", background: C.bg, color: C.text, fontSize: "13px", fontFamily: "Inter, sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
                See on Dribbble <ArrowUpRight size={12} />
              </button>
            </GradientRing>
          </div>
        </section>

        {/* ══ STATS ═════════════════════════════════════════════════════════ */}
        <section style={{ padding: "100px 40px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
          <div className="stats-row" style={{ display: "flex", maxWidth: 900, margin: "0 auto" }}>
            {[
              { number: "5+", label: "Years of Experience" },
              { number: "40+", label: "Projects Delivered" },
              { number: "100%", label: "Client Satisfaction" },
            ].map((stat, i, arr) => (
              <div key={i} className="stat-col" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 40px", borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "clamp(60px, 8vw, 88px)", color: C.text, lineHeight: 1, marginBottom: 18, display: "block", letterSpacing: "-0.02em" }}>
                  {stat.number}
                </em>
                <span style={{ color: C.muted, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CONTACT / FOOTER ══════════════════════════════════════════════ */}
        <section style={{ position: "relative", minHeight: "78vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <img
              src="https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1920&h=1080&fit=crop&auto=format"
              alt="Dark cinematic background"
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.22) blur(3px)", transform: "scale(1.06) scaleY(-1)" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
          </div>

          <div style={{ position: "relative", zIndex: 5, overflow: "hidden", padding: "44px 0", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", whiteSpace: "nowrap", animation: "marquee 20s linear infinite", width: "max-content" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "clamp(30px, 4.5vw, 50px)", color: "rgba(245,245,245,0.2)", paddingRight: "3vw", letterSpacing: "0.06em" }}>
                  BUILDING THE FUTURE •{" "}
                </span>
              ))}
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px" }}>
            <h2 style={{ margin: "0 0 20px", lineHeight: 1.05 }}>
              <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: "clamp(40px, 6vw, 64px)", color: C.text }}>{"Let's work"}</span>
              <em style={{ display: "block", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "clamp(40px, 6vw, 64px)", color: C.text, letterSpacing: "-0.02em" }}>together</em>
            </h2>
            <p style={{ color: C.muted, fontSize: "15px", maxWidth: 460, lineHeight: 1.75, marginBottom: 44 }}>
              Available for freelance projects in UI/UX, social media design, and packaging.
            </p>
            <GradientRing>
              <button style={{ padding: "15px 34px", borderRadius: 9999, border: "none", background: "transparent", color: C.text, fontSize: "15px", fontFamily: "Inter, sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                hello@yourname.com <ArrowUpRight size={14} />
              </button>
            </GradientRing>
          </div>

          <div className="footer-bar" style={{ position: "relative", zIndex: 10, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", flexWrap: "wrap", gap: 14 }}>
            <span style={{ color: C.muted, fontSize: "12px" }}>© 2026 Your Name. All rights reserved.</span>
            <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
              {[{ Icon: Twitter, label: "X" }, { Icon: Linkedin, label: "LinkedIn" }, { Icon: Dribbble, label: "Dribbble" }].map(({ Icon, label }) => (
                <button key={label} title={label} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", padding: 4, display: "flex", alignItems: "center", transition: "color 0.2s", lineHeight: 0 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#C0C0C0")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}>
                  <Icon size={15} />
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ADE80", animation: "greenPulse 2.2s ease infinite", flexShrink: 0 }} />
              <span style={{ color: C.muted, fontSize: "12px" }}>Available for projects</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
