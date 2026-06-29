import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Twitter, Linkedin, Dribbble } from "lucide-react";

/* ─── constants ─────────────────────────────────────────────────────────── */

const LOADING_WORDS = ["Design", "Create", "Inspire"];
const ROLES = ["Creative", "Designer", "Visionary", "Strategist"];

const C = {
  bg: "#0A0A0A",
  surface: "#141414",
  text: "#F5F5F5",
  muted: "#878787",
  border: "#1F1F1F",
};

const PROJECTS = [
  {
    title: "Social Campaign — Apparel",
    category: "Social Media",
    year: "2026",
    wide: true,
    image: "/assets/e37ca59c98504c97b809f6b0573114c4c632b984.png",
    alt: "Fashion editorial campaign — woman in black blazer",
  },
  {
    title: "Packaging Design — Cosmetics",
    category: "Packaging",
    year: "2025",
    wide: false,
    image: "/assets/e89add6920e3dd49952dd44946b71060231dc239.png",
    alt: "Luxury cosmetics packaging arranged on dark surface",
  },
  {
    title: "Mobile UI — Wellness App",
    category: "UI/UX Design",
    year: "2025",
    wide: false,
    image: "/assets/d64d7fc4ca830da17517830e3cdf0df88503b923.png",
    alt: "Dark mode wellness mobile app on device",
  },
  {
    title: "Brand Identity System",
    category: "Branding",
    year: "2024",
    wide: true,
    image: "/assets/255f15408d482942a3a822b169bfce077684d2ba.png",
    alt: "Brand identity business cards on dark surface",
  },
];

const JOURNAL = [
  {
    title: "Building a Social Media Design System from Scratch",
    excerpt: "How I systematized a chaotic workflow into a scalable visual library.",
    readTime: "5 min read",
    date: "May 2026",
    image: "/assets/1cf3b2887c18b0244b46bc1196b22f85f0510414.png",
    alt: "Dark design workspace with monitors",
  },
  {
    title: "Why Packaging Design Is Just UI for Physical Products",
    excerpt: "The surprising overlap between screen interfaces and shelf presence.",
    readTime: "4 min read",
    date: "April 2026",
    image: "/assets/5555a4b9a9c5e8b522b2f76d20619d5025f0f728.png",
    alt: "Close-up of cosmetics on a dark table",
  },
  {
    title: "The Invisible Rules Behind Every Great Instagram Grid",
    excerpt: "Color blocking, rhythm, and the silent grammar of visual feeds.",
    readTime: "3 min read",
    date: "March 2026",
    image: "/assets/1e9c51112cd6e93ff24da608ca5e63dbc793e534.png",
    alt: "Dual monitors displaying design work",
  },
  {
    title: "When Brand Guidelines Actually Help You Move Faster",
    excerpt: "Constraints as creative catalysts — a counterintuitive take.",
    readTime: "6 min read",
    date: "February 2026",
    image: "/assets/e884c48f9aada005309bdb7000cda06250ba250b.png",
    alt: "Designer workspace with brand materials",
  },
];

const GALLERY_IMAGES = [
  {
    src: "/assets/ad274ce3097e7f44c8e612c6b3373139aa329cc3.png",
    alt: "Editorial fashion portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1735480222193-3fe22ffd70b6?w=420&h=420&fit=crop&auto=format",
    alt: "Woman in black coat, cinematic dark",
  },
  {
    src: "/assets/e89add6920e3dd49952dd44946b71060231dc239.png",
    alt: "Luxury wine packaging box",
  },
  {
    src: "/assets/d64d7fc4ca830da17517830e3cdf0df88503b923.png",
    alt: "Mobile app screens side by side",
  },
  {
    src: "https://images.unsplash.com/photo-1702479744120-98fffb81bf6d?w=420&h=420&fit=crop&auto=format",
    alt: "Wooden brand mockup on table",
  },
  {
    src: "/assets/3b8d1031640f6c622f117ccc3cea45e112591b6b.png",
    alt: "Abstract gray and blue texture",
  },
];

/* ─── helpers ───────────────────────────────────────────────────────────── */

function GradientRing({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
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
      <span
        style={{
          color: C.muted,
          fontSize: "11px",
          letterSpacing: "0.18em",
          fontFamily: "Inter, sans-serif",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── project card ──────────────────────────────────────────────────────── */

function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
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
      {/* photo */}
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

      {/* halftone texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.35) 1px, transparent 1px)",
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
            background:
              "linear-gradient(rgba(10,10,10,0.9), rgba(10,10,10,0.9)) padding-box, linear-gradient(135deg, #89AACC, #4E85BF) border-box",
            color: C.text,
            fontSize: "13px",
            fontFamily: "Inter, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          View —{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: "14px",
            }}
          >
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
        <div
          style={{
            color: C.muted,
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 5,
          }}
        >
          {project.category} · {project.year}
        </div>
        <div
          style={{
            color: C.text,
            fontSize: "15px",
            fontWeight: 500,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {project.title}
        </div>
      </div>
    </div>
  );
}

/* ─── main component ────────────────────────────────────────────────────── */

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const [activeNav, setActiveNav] = useState("Home");
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleVisible, setRoleVisible] = useState(true);

  /* loading counter */
  useEffect(() => {
    const iv = setInterval(() => {
      setCounter((n) => {
        if (n >= 100) {
          clearInterval(iv);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return n + 1;
      });
    }, 26);
    return () => clearInterval(iv);
  }, []);

  /* word cycle on loader */
  useEffect(() => {
    if (!isLoading) return;
    const iv = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % LOADING_WORDS.length);
        setWordVisible(true);
      }, 350);
    }, 1100);
    return () => clearInterval(iv);
  }, [isLoading]);

  /* role cycle on hero */
  useEffect(() => {
    const iv = setInterval(() => {
      setRoleVisible(false);
      setTimeout(() => {
        setRoleIndex((i) => (i + 1) % ROLES.length);
        setRoleVisible(true);
      }, 300);
    }, 2600);
    return () => clearInterval(iv);
  }, []);

  /* ── LOADING SCREEN ── */
  if (isLoading) {
    return (
      <>
        <style>{`
          body { margin: 0; background: #0A0A0A; overflow: hidden; }
        `}</style>
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: C.bg,
            fontFamily: "Inter, sans-serif",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* top-left label */}
          <div style={{ position: "absolute", top: 32, left: 36 }}>
            <span
              style={{
                color: C.muted,
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Portfolio
            </span>
          </div>

          {/* center word */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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

          {/* bottom-right counter */}
          <div
            style={{
              position: "absolute",
              bottom: 56,
              right: 40,
            }}
          >
            <span
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(88px, 13vw, 120px)",
                color: C.text,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {String(counter).padStart(3, "0")}
            </span>
          </div>

          {/* progress bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              background: C.border,
            }}
          >
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

  /* ── MAIN PAGE ── */
  return (
    <>
      <style>{`
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

        .nav-btn {
          padding: 6px 14px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-family: Inter, sans-serif;
          transition: background 0.2s, color 0.2s;
        }
        .nav-btn.active {
          background: rgba(245,245,245,0.09);
          color: #F5F5F5;
        }
        .nav-btn.inactive {
          background: transparent;
          color: #878787;
        }
        .nav-btn.inactive:hover {
          color: #C0C0C0;
        }

        .say-hi {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 14px;
          border-radius: 9999px;
          border: 1px solid #1F1F1F;
          background: transparent;
          color: #F5F5F5;
          font-size: 13px;
          font-family: Inter, sans-serif;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .say-hi:hover {
          border-color: transparent;
          background:
            linear-gradient(rgba(20,20,20,0.9), rgba(20,20,20,0.9)) padding-box,
            linear-gradient(135deg, #89AACC, #4E85BF) border-box;
        }

        .cta-fill {
          padding: 13px 30px;
          border-radius: 9999px;
          border: 1px solid transparent;
          background: #F5F5F5;
          color: #0A0A0A;
          font-size: 14px;
          font-family: Inter, sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.25s, color 0.25s, border-color 0.25s;
        }
        .cta-fill:hover {
          background: transparent;
          color: #F5F5F5;
          border-color: transparent;
          background:
            linear-gradient(#0A0A0A, #0A0A0A) padding-box,
            linear-gradient(135deg, #89AACC, #4E85BF) border-box;
        }

        .cta-outline {
          padding: 13px 30px;
          border-radius: 9999px;
          border: 1px solid #1F1F1F;
          background: transparent;
          color: #F5F5F5;
          font-size: 14px;
          font-family: Inter, sans-serif;
          cursor: pointer;
          transition: border-color 0.25s;
        }
        .cta-outline:hover {
          border-color: transparent;
          background:
            linear-gradient(#0A0A0A, #0A0A0A) padding-box,
            linear-gradient(135deg, #89AACC, #4E85BF) border-box;
        }

        .pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: 9999px;
          border: 1px solid #1F1F1F;
          background: transparent;
          color: #878787;
          font-size: 13px;
          font-family: Inter, sans-serif;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: border-color 0.2s, color 0.2s;
        }
        .pill-btn:hover {
          color: #F5F5F5;
          border-color: transparent;
          background:
            linear-gradient(#0A0A0A, #0A0A0A) padding-box,
            linear-gradient(135deg, #89AACC, #4E85BF) border-box;
        }

        .journal-pill {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px 24px;
          border-radius: 9999px;
          border: 1px solid #1F1F1F;
          background: transparent;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .journal-pill:hover {
          background: rgba(20,20,20,0.8);
          border-color: #2a2a2a;
        }

        .gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.55;
          transition: opacity 0.3s, transform 0.5s;
        }
        .gallery-card:hover .gallery-img {
          opacity: 0.75;
          transform: scale(1.04);
        }

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
          .gallery-center { position: relative !important; padding: 80px 24px !important; }
          .journal-pill { border-radius: 20px; }
        }
      `}</style>

      <div style={{ background: C.bg, color: C.text, fontFamily: "Inter, sans-serif" }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section
          style={{
            position: "relative",
            minHeight: "100svh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* background */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <img
              src="/assets/3b8d1031640f6c622f117ccc3cea45e112591b6b.png"
              alt="Dark cinematic abstract water and sky background"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.28) blur(3px)",
                transform: "scale(1.06)",
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)" }} />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 220,
                background: `linear-gradient(to top, ${C.bg}, transparent)`,
              }}
            />
          </div>

          {/* ── Floating Navbar ── */}
          <nav
            style={{
              position: "sticky",
              top: 24,
              zIndex: 50,
              marginTop: 24,
              display: "flex",
              alignItems: "center",
              gap: 0,
              background: "rgba(20,20,20,0.82)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${C.border}`,
              borderRadius: 9999,
              padding: "6px 8px",
              animation: "fadeUp 0.6s ease both",
            }}
          >
            {/* logo badge */}
            <GradientRing style={{ marginRight: 4 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: C.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontSize: "13px",
                    color: C.text,
                    letterSpacing: "0.02em",
                  }}
                >
                  YI
                </span>
              </div>
            </GradientRing>

            {/* divider */}
            <div style={{ width: 1, height: 20, background: C.border, margin: "0 6px" }} />

            {/* links */}
            {["Home", "Work", "Resume"].map((link) => (
              <button
                key={link}
                className={`nav-btn ${activeNav === link ? "active" : "inactive"}`}
                onClick={() => setActiveNav(link)}
              >
                {link}
              </button>
            ))}

            {/* divider */}
            <div style={{ width: 1, height: 20, background: C.border, margin: "0 6px" }} />

            <button className="say-hi">
              Say hi <ArrowUpRight size={11} />
            </button>
          </nav>

          {/* ── Hero content ── */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "80px 24px 140px",
              animation: "fadeUp 0.9s ease 0.15s both",
            }}
          >
            <span
              style={{
                color: C.muted,
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 32,
                display: "block",
              }}
            >
              Collection &apos;26
            </span>

            <h1
              className="hero-name"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: "clamp(64px, 9.5vw, 108px)",
                color: C.text,
                lineHeight: 1.0,
                margin: "0 0 22px",
                letterSpacing: "-0.025em",
              }}
            >
              Anes Ragoub
            </h1>

            <p
              style={{
                color: C.muted,
                fontSize: "16px",
                margin: "0 0 14px",
                display: "flex",
                alignItems: "center",
                gap: 7,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {"A "}
              <em
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  color: C.text,
                  fontSize: "17px",
                  display: "inline-block",
                  transition: "opacity 0.3s ease",
                  opacity: roleVisible ? 1 : 0,
                  minWidth: 110,
                  textAlign: "center",
                }}
              >
                {ROLES[roleIndex]}
              </em>
              {" based in New York."}
            </p>

            <p
              style={{
                color: C.muted,
                fontSize: "14px",
                lineHeight: 1.75,
                maxWidth: 400,
                margin: "0 0 44px",
              }}
            >
              Crafting digital interfaces, social campaigns, and packaging systems that feel
              considered from every angle.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <button className="cta-fill">See Works</button>
              <button className="cta-outline">Reach out...</button>
            </div>
          </div>

          {/* scroll indicator */}
          <div
            style={{
              position: "absolute",
              bottom: 36,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              zIndex: 10,
            }}
          >
            <span
              style={{
                color: C.muted,
                fontSize: "10px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Scroll
            </span>
            <div
              style={{
                width: 1,
                height: 44,
                background: C.border,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "45%",
                  background: "linear-gradient(to bottom, #89AACC, transparent)",
                  animation: "scrollPulse 2s ease infinite",
                }}
              />
            </div>
          </div>
        </section>

        {/* ══ SELECTED WORKS ════════════════════════════════════════════════ */}
        <section style={{ padding: "110px 40px", maxWidth: 1280, margin: "0 auto" }}>
          <div
            className="section-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 60,
            }}
          >
            <div>
              <Eyebrow label="Selected Work" />
              <h2 style={{ margin: 0, lineHeight: 1.05 }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 300,
                    fontSize: "clamp(36px, 4.5vw, 52px)",
                    color: C.text,
                  }}
                >
                  Featured
                </span>
                <em
                  style={{
                    display: "block",
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(36px, 4.5vw, 52px)",
                    color: C.text,
                  }}
                >
                  projects.
                </em>
              </h2>
              <p style={{ color: C.muted, fontSize: "14px", marginTop: 16, maxWidth: 400, lineHeight: 1.7 }}>
                A selection of my work across UI/UX, social media campaigns, and packaging systems.
              </p>
            </div>
            <button className="pill-btn">
              View all work <ArrowUpRight size={13} />
            </button>
          </div>

          {/* bento layout */}
          <div
            className="bento-row"
            style={{ display: "grid", gridTemplateColumns: "7fr 5fr", gap: 16 }}
          >
            <ProjectCard project={PROJECTS[0]} index={0} />
            <ProjectCard project={PROJECTS[1]} index={1} />
            <div
              className="bento-sub-row"
              style={{
                display: "grid",
                gridTemplateColumns: "5fr 7fr",
                gridColumn: "1 / -1",
                gap: 16,
              }}
            >
              <ProjectCard project={PROJECTS[2]} index={2} />
              <ProjectCard project={PROJECTS[3]} index={3} />
            </div>
          </div>
        </section>

        {/* ══ JOURNAL ═══════════════════════════════════════════════════════ */}
        <section
          style={{
            padding: "80px 40px 110px",
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          <div
            className="section-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 52,
            }}
          >
            <div>
              <Eyebrow label="Recent Work" />
              <h2 style={{ margin: 0, lineHeight: 1.05 }}>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 300,
                    fontSize: "clamp(36px, 4.5vw, 52px)",
                    color: C.text,
                  }}
                >
                  Recent{" "}
                </span>
                <em
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(36px, 4.5vw, 52px)",
                    color: C.text,
                  }}
                >
                  thoughts
                </em>
              </h2>
              <p style={{ color: C.muted, fontSize: "14px", marginTop: 16, maxWidth: 400, lineHeight: 1.7 }}>
                Notes on design, process, and the things I find worth writing about.
              </p>
            </div>
            <button className="pill-btn">
              View all <ArrowUpRight size={13} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {JOURNAL.map((entry, i) => (
              <div key={i} className="journal-pill">
                <img
                  src={entry.image}
                  alt={entry.alt}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    objectFit: "cover",
                    flexShrink: 0,
                    background: C.surface,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 500,
                      fontSize: "15px",
                      color: C.text,
                      marginBottom: 5,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {entry.title}
                  </div>
                  <div
                    style={{
                      color: C.muted,
                      fontSize: "13px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {entry.excerpt}
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "right",
                    flexShrink: 0,
                    color: C.muted,
                    fontSize: "12px",
                    lineHeight: 1.9,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  <div>{entry.readTime}</div>
                  <div>{entry.date}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ VISUAL EXPLORATIONS ═══════════════════════════════════════════ */}
        <section
          style={{
            position: "relative",
            padding: "100px 0 120px",
            overflow: "hidden",
            minHeight: "82vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* two-column gallery bg */}
          <div
            className="gallery-cols"
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              padding: "0 40px",
              pointerEvents: "none",
            }}
          >
            {/* left col */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginTop: -56,
              }}
            >
              {GALLERY_IMAGES.slice(0, 3).map((img, i) => (
                <div
                  key={i}
                  className="gallery-card"
                  style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    border: `1px solid ${C.border}`,
                    background: C.surface,
                    flex: 1,
                    minHeight: 220,
                  }}
                >
                  <img className="gallery-img" src={img.src} alt={img.alt} />
                </div>
              ))}
            </div>
            {/* right col — offset lower */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginTop: 72,
              }}
            >
              {GALLERY_IMAGES.slice(3).map((img, i) => (
                <div
                  key={i}
                  className="gallery-card"
                  style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    border: `1px solid ${C.border}`,
                    background: C.surface,
                    flex: 1,
                    minHeight: 220,
                  }}
                >
                  <img className="gallery-img" src={img.src} alt={img.alt} />
                </div>
              ))}
            </div>

            {/* overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(10,10,10,0.72)",
              }}
            />
          </div>

          {/* center content */}
          <div
            className="gallery-center"
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "0 24px",
            }}
          >
            <Eyebrow label="Explorations" />
            <h2 style={{ margin: "0 0 18px", lineHeight: 1.05 }}>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 300,
                  fontSize: "clamp(36px, 4.5vw, 52px)",
                  color: C.text,
                }}
              >
                Visual{" "}
              </span>
              <em
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: "clamp(36px, 4.5vw, 52px)",
                  color: C.text,
                }}
              >
                playground
              </em>
            </h2>
            <p
              style={{
                color: C.muted,
                fontSize: "14px",
                maxWidth: 380,
                lineHeight: 1.75,
                marginBottom: 36,
              }}
            >
              Experimental work, motion studies, social templates, and packaging mockups.
            </p>
            <GradientRing>
              <button
                style={{
                  padding: "12px 26px",
                  borderRadius: 9999,
                  border: "none",
                  background: C.bg,
                  color: C.text,
                  fontSize: "13px",
                  fontFamily: "Inter, sans-serif",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                See on Dribbble <ArrowUpRight size={12} />
              </button>
            </GradientRing>
          </div>
        </section>

        {/* ══ STATS ═════════════════════════════════════════════════════════ */}
        <section
          style={{
            padding: "100px 40px",
            borderTop: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            className="stats-row"
            style={{
              display: "flex",
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {[
              { number: "5+", label: "Years of Experience" },
              { number: "40+", label: "Projects Delivered" },
              { number: "100%", label: "Client Satisfaction" },
            ].map((stat, i, arr) => (
              <div
                key={i}
                className="stat-col"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "0 40px",
                  borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
                }}
              >
                <em
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(60px, 8vw, 88px)",
                    color: C.text,
                    lineHeight: 1,
                    marginBottom: 18,
                    display: "block",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.number}
                </em>
                <span
                  style={{
                    color: C.muted,
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CONTACT / FOOTER ══════════════════════════════════════════════ */}
        <section
          style={{
            position: "relative",
            minHeight: "78vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* mirrored background */}
          <div style={{ position: "absolute", inset: 0 }}>
            <img
              src="/assets/3b8d1031640f6c622f117ccc3cea45e112591b6b.png"
              alt="Dark cinematic background"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.22) blur(3px)",
                transform: "scale(1.06) scaleY(-1)",
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
          </div>

          {/* marquee */}
          <div
            style={{
              position: "relative",
              zIndex: 5,
              overflow: "hidden",
              padding: "44px 0",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                whiteSpace: "nowrap",
                animation: "marquee 20s linear infinite",
                width: "max-content",
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "clamp(30px, 4.5vw, 50px)",
                    color: "rgba(245,245,245,0.2)",
                    paddingRight: "3vw",
                    letterSpacing: "0.06em",
                  }}
                >
                  BUILDING THE FUTURE •{" "}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "80px 24px",
            }}
          >
            <h2 style={{ margin: "0 0 20px", lineHeight: 1.05 }}>
              <span
                style={{
                  display: "block",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 300,
                  fontSize: "clamp(40px, 6vw, 64px)",
                  color: C.text,
                }}
              >
                {"Let's work"}
              </span>
              <em
                style={{
                  display: "block",
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: "clamp(40px, 6vw, 64px)",
                  color: C.text,
                  letterSpacing: "-0.02em",
                }}
              >
                together
              </em>
            </h2>
            <p
              style={{
                color: C.muted,
                fontSize: "15px",
                maxWidth: 460,
                lineHeight: 1.75,
                marginBottom: 44,
              }}
            >
              Available for freelance projects in UI/UX, social media design, and packaging.
            </p>
            <GradientRing>
              <button
                style={{
                  padding: "15px 34px",
                  borderRadius: 9999,
                  border: "none",
                  background: "transparent",
                  color: C.text,
                  fontSize: "15px",
                  fontFamily: "Inter, sans-serif",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                hello@yourname.com <ArrowUpRight size={14} />
              </button>
            </GradientRing>
          </div>

          {/* footer bar */}
          <div
            className="footer-bar"
            style={{
              position: "relative",
              zIndex: 10,
              borderTop: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 40px",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            <span style={{ color: C.muted, fontSize: "12px", fontFamily: "Inter, sans-serif" }}>
              © 2026 Your Name. All rights reserved.
            </span>

            <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
              {[
                { Icon: Twitter, label: "X / Twitter" },
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Dribbble, label: "Dribbble" },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  title={label}
                  style={{
                    background: "none",
                    border: "none",
                    color: C.muted,
                    cursor: "pointer",
                    padding: 4,
                    display: "flex",
                    alignItems: "center",
                    transition: "color 0.2s",
                    lineHeight: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#C0C0C0")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#4ADE80",
                  animation: "greenPulse 2.2s ease infinite",
                  flexShrink: 0,
                }}
              />
              <span style={{ color: C.muted, fontSize: "12px", fontFamily: "Inter, sans-serif" }}>
                Available for projects
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
