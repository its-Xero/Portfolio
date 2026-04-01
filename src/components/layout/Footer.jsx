import { Globe, ExternalLink, Mail, ArrowUp } from 'lucide-react';
import './Footer.css';

/**
 * Footer Component
 * 
 * HOW TO ADD NEW SOCIAL LINKS:
 *  - Add a new object to the `socials` array below
 *  - Each entry needs an `icon` (Lucide component), `href`, and `label`
 */
const socials = [
  { icon: Globe, href: 'https://github.com', label: 'GitHub' },
  { icon: ExternalLink, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:hello@example.com', label: 'Email' },
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-top">
          <a href="#" className="footer-logo display">NX.</a>
          <div className="footer-socials">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="footer-social-link"
              >
                <s.icon size={18} />
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} — Designed & built with intention.
          </p>
          <button className="footer-back-to-top" onClick={scrollToTop} aria-label="Back to top">
            <ArrowUp size={16} />
            <span>Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
