import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

/**
 * Navbar — Floating Island Navigation
 * 
 * HOW TO ADD NEW LINKS:
 *  - Add a new object to the `links` array below
 *  - Each link needs a `label` and `href` (section ID)
 */
const links = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLinkClick = () => setMobileOpen(false);

  return (
    <>
      <nav className={`navbar glass ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-inner">
          <a href="#" className="navbar-logo display">NX.</a>

          {/* Desktop links */}
          <ul className="navbar-links">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="navbar-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`mobile-menu glass ${mobileOpen ? 'mobile-menu-open' : ''}`}>
        <ul className="mobile-menu-links">
          {links.map((link, i) => (
            <li key={link.href} style={{ animationDelay: `${i * 0.08}s` }}>
              <a href={link.href} onClick={handleLinkClick}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div className="mobile-backdrop" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
