import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowLeft, Linkedin, Instagram, Globe, Figma, Download } from "lucide-react";

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

import { Routes, Route } from "react-router-dom";
import Admin from "./Admin";
import { supabase } from "./supabaseClient";
import { ProjectModal } from "./components/ProjectModal";

const CATEGORIES = ["All", "Graphic Design", "UI/UX Design", "Packaging Design", "Branding Design"];

const LINKEDIN_URL = "https://www.linkedin.com/in/anes-ragoub/";
const INSTAGRAM_URL = "https://www.instagram.com/xero._.design/";
const BEHANCE_URL = "https://www.behance.net/AnesRagoub";
const FIGMA_URL = "https://www.figma.com/design/nCno1YvHqW9zp6sZMeHXR0/Portfolio?node-id=1-18275&t=wP3j4GMWRa3icm91-1";
const CV_URL = FIGMA_URL; // replace with your actual CV link or local PDF path when ready

const NAV_ITEMS = [
  { label: "Home", href: "#hero" },
  { label: "Work", href: "#work" },
  { label: "Posts", href: "#journal" },
  { label: "Resume", href: "#visual" },
  { label: "Contact", href: "#contact" },
];

const CONTACT_BUTTONS = [
  { label: "Instagram", href: INSTAGRAM_URL, Icon: Instagram, color: "#E1306C", glow: "rgba(225,48,108,0.18)" },
  { label: "LinkedIn", href: LINKEDIN_URL, Icon: Linkedin, color: "#0A66C2", glow: "rgba(10,102,194,0.16)" },
  { label: "Behance", href: BEHANCE_URL, Icon: Globe, color: "#1769FF", glow: "rgba(23,105,255,0.16)" },
  { label: "Figma", href: FIGMA_URL, Icon: Figma, color: "#F24E1E", glow: "rgba(242,78,30,0.16)" },
  { label: "CV", href: CV_URL, Icon: Download, color: "#22C55E", glow: "rgba(34,197,94,0.16)" },
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

function normalizeCategory(category?: string) {
  const value = category?.trim().toLowerCase();

  if (!value) return "Graphic Design";
  if (["graphic design", "graphic", "social media"].includes(value)) return "Graphic Design";
  if (["ui/ux design", "ui/ux", "ux/ui", "ux design"].includes(value)) return "UI/UX Design";
  if (["packaging design", "packaging", "package"].includes(value)) return "Packaging Design";
  if (["branding design", "branding", "brand"].includes(value)) return "Branding Design";

  return category;
}

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

function SectionAccent({
  rotate = -16,
  top = "18%",
  left = "-18%",
  width = "140%",
  opacity = 0.18,
}: {
  rotate?: number;
  top?: string;
  left?: string;
  width?: string;
  opacity?: number;
}) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top,
          left,
          width,
          height: 1,
          background: "linear-gradient(90deg, transparent 0%, rgba(137,170,204,0.95) 45%, rgba(137,170,204,0.18) 100%)",
          boxShadow: "0 0 18px rgba(78,133,191,0.16)",
          transform: `rotate(${rotate}deg)`,
          filter: "blur(0.7px)",
          opacity,
        }}
      />
    </div>
  );
}

/* ─── project card ──────────────────────────────────────────────────────── */

function ProjectCard({
  project,
  onOpen,
}: {
  project: any;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  if (!project) return null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
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

/* ─── all projects page ─────────────────────────────────────────────────── */

function AllProjectsPage({
  onBack,
  allProjects,
  onOpenProject,
}: {
  onBack: () => void;
  allProjects: any[];
  onOpenProject: (project: any) => void;
}) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? allProjects
      : allProjects.filter((p) => normalizeCategory(p.category) === activeFilter);

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
      {/* ── sticky top bar ── */}
      <div
        style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          width: "fit-content",
          maxWidth: "calc(100% - 32px)",
          zIndex: 50,
          borderBottom: `1px solid ${C.border}`,
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
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
            <span
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: "12px",
                color: C.text,
              }}
            >
              AR
            </span>
          </div>
        </GradientRing>
      </div>

      {/* ── page header ── */}
      <div style={{ padding: "100px 40px 56px", maxWidth: 1280, margin: "0 auto" }}>
        <Eyebrow label="Portfolio" />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
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
            {allProjects.length} projects across UI/UX design, social media campaigns, packaging
            systems, and brand identity.
          </p>
        </div>

        {/* category filters */}
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
                  {allProjects.filter((p) => normalizeCategory(p.category) === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 16, color: C.muted, fontSize: "12px", letterSpacing: "0.08em" }}>
          Showing {filtered.length} of {allProjects.length}
        </div>
      </div>

      {/* ── projects grid ── */}
      <div style={{ padding: "0 40px 120px", maxWidth: 1280, margin: "0 auto" }}>
        <div
          className="all-projects-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}
        >
          {filtered.map((project, i) => (
            <div
              key={project.title}
              style={{ animation: `fadeUp 0.5s ease ${i * 0.07}s both` }}
            >
              {/* reuse the same card but without requiring `index` */}
              <div
                style={{
                  position: "relative",
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 24,
                  overflow: "hidden",
                  minHeight: 320,
                  cursor: "pointer",
                }}
                onClick={() => onOpenProject(project)}
                onMouseEnter={(e) =>
                  (e.currentTarget.querySelector("img")!.style.transform = "scale(1.06)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.querySelector("img")!.style.transform = "scale(1)")
                }
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
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.35) 1px, transparent 1px)",
                    backgroundSize: "7px 7px",
                    pointerEvents: "none",
                  }}
                />
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
                    style={{ color: C.text, fontSize: "15px", fontWeight: 500, fontFamily: "Inter, sans-serif" }}
                  >
                    {project.title}
                  </div>
                </div>
              </div>
              {/* description below card */}
              <div style={{ padding: "14px 4px 0" }}>
                <p style={{ color: C.muted, fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "100px 0", color: C.muted }}>
            <em
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: "32px",
                display: "block",
                marginBottom: 12,
              }}
            >
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
        <span style={{ color: C.muted, fontSize: "12px" }}>© 2026 Anes Ragoub. All rights reserved.</span>
        <button
          className="back-btn"
          onClick={onBack}
          style={{ padding: "8px 16px", fontSize: "12px" } as React.CSSProperties}
        >
          <ArrowLeft size={12} />
          Back to portfolio
        </button>
      </div>
    </div>
  );
}

/* ─── main component ────────────────────────────────────────────────────── */

function Portfolio() {
  const [currentPage, setCurrentPage] = useState<"home" | "projects">("home");
  const [isLoading, setIsLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const [activeNav, setActiveNav] = useState("Home");
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleVisible, setRoleVisible] = useState(true);
  
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const featuredProjects = allProjects.slice(0, 4);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('visible', true)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setAllProjects(data);
      }
    };

    const fetchLinkedInPosts = async () => {
      const { data, error } = await supabase
        .from('linkedin_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (!error && data && data.length > 0) {
        const mapped = data.map((entry: any) => ({
          title: entry.title || 'LinkedIn post',
          excerpt: entry.excerpt || 'A recent post shared on LinkedIn.',
          readTime: entry.read_time || 'LinkedIn post',
          date: entry.date || new Date(entry.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' }),
          image: entry.image || '',
          alt: entry.alt || 'LinkedIn post preview',
          url: entry.url || LINKEDIN_URL,
        }));
        setJournalEntries(mapped);
      } else {
        setJournalEntries([]);
      }
    };

    fetchProjects();
    fetchLinkedInPosts();
  }, []);

  const goToProjects = () => {
    setCurrentPage("projects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goHome = () => {
    setCurrentPage("home");
    setSelectedProject(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedProject]);

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

  /* section tracking */
  useEffect(() => {
    const handleScroll = () => {
      const anchor = window.innerHeight * 0.45;
      let currentSection = "Home";

      NAV_ITEMS.forEach(({ label, href }) => {
        if (!href.startsWith("#")) return;
        const section = document.getElementById(href.slice(1));
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.top <= anchor && rect.bottom >= anchor) {
          currentSection = label;
        }
      });

      const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const nearBottom = window.innerHeight + scrollTop >= scrollHeight - 80;

      if (nearBottom && scrollTop > 60) {
        currentSection = "Contact";
      }

      setActiveNav(currentSection);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
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

  /* ── PROJECTS PAGE ── */
  if (currentPage === "projects") {
    return (
      <>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          body { margin: 0; background: #0A0A0A; overflow-x: hidden; }
          ::-webkit-scrollbar { width: 0; }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
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
            .all-projects-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
        <AllProjectsPage onBack={goHome} allProjects={allProjects} onOpenProject={setSelectedProject} />
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

        .filter-pill {
          padding: 8px 20px;
          border-radius: 9999px;
          border: 1px solid #1F1F1F;
          background: transparent;
          color: #878787;
          font-size: 13px;
          font-family: Inter, sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .filter-pill:hover { color: #F5F5F5; border-color: #333; }
        .filter-pill.active {
          color: #F5F5F5;
          border-color: transparent;
          background:
            linear-gradient(#141414, #141414) padding-box,
            linear-gradient(135deg, #89AACC, #4E85BF) border-box;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 9999px;
          border: 1px solid #1F1F1F;
          background: transparent;
          color: #878787;
          font-size: 13px;
          font-family: Inter, sans-serif;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }
        .back-btn:hover { color: #F5F5F5; border-color: #333; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes transitionShatter {
          0% {
            transform: perspective(700px) rotateX(72deg) skewX(-8deg) translateX(-2%);
            opacity: 0.55;
          }
          100% {
            transform: perspective(700px) rotateX(76deg) skewX(8deg) translateX(2%);
            opacity: 0.9;
          }
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
          .journal-pill { border-radius: 20px; flex-direction: column; align-items: flex-start; gap: 12px; }
          .journal-pill img { width: 100% !important; height: 180px !important; }
          .journal-pill > div:last-child { text-align: left !important; width: 100%; }
          .all-projects-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ background: C.bg, color: C.text, fontFamily: "Inter, sans-serif" }}>
        {selectedProject ? (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        ) : null}

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section
          id="hero"
          style={{
            position: "relative",
            minHeight: "100svh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* static cinematic background (optimized for performance) */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <img
              src="/assets/3b8d1031640f6c622f117ccc3cea45e112591b6b.png"
              alt="Dark cinematic abstract background"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.28) blur(3px)",
                transform: "scale(1.05)",
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
              position: "fixed",
              top: 12,
              left: 0,
              right: 0,
              width: "100%",
              zIndex: 50,
              display: "flex",
              justifyContent: "center",
              background: "transparent",
              padding: "10px 16px",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: "fit-content",
                maxWidth: "calc(100% - 32px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
                background: "rgba(20,20,20,0.92)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${C.border}`,
                borderRadius: 9999,
                padding: "10px 20px",
                pointerEvents: "auto",
                animation: "fadeUp 0.6s ease both",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
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
                      AR
                    </span>
                  </div>
                </GradientRing>

                <div style={{ width: 1, height: 20, background: C.border, margin: "0 6px" }} />

                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  {NAV_ITEMS.map(({ label, href }) => (
                    <button
                      key={label}
                      className={`nav-btn ${activeNav === label ? "active" : "inactive"}`}
                      onClick={() => {
                        setActiveNav(label);
                        if (href.startsWith("#")) {
                          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
                        } else {
                          window.open(href, "_blank", "noopener");
                        }
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <a
                href="https://www.linkedin.com/in/anes-ragoub/"
                target="_blank"
                rel="noopener noreferrer"
                className="say-hi"
                style={{ textDecoration: "none" }}
              >
                lets connect <ArrowUpRight size={11} />
              </a>
            </div>
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
              {" based in Algeria."}
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
              <a className="cta-fill" href="#work">See Works</a>
              <a href={LINKEDIN_URL} className="cta-outline">Reach out...</a>
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

        <div
          style={{
            position: "relative",
            height: 96,
            marginTop: -2,
            overflow: "hidden",
            background: C.bg,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "0 0 0 0",
              background: "linear-gradient(120deg, transparent 0%, rgba(137,170,204,0.08) 18%, rgba(255,255,255,0.04) 52%, rgba(137,170,204,0.08) 82%, transparent 100%)",
              filter: "blur(12px)",
              transform: "perspective(700px) rotateX(72deg) skewX(-8deg)",
              animation: "transitionShatter 7.5s ease-in-out infinite alternate",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "repeating-linear-gradient(108deg, transparent 0 4px, rgba(137,170,204,0.05) 4px 5px, transparent 5px 10px)",
              opacity: 0.45,
              mixBlendMode: "screen",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.12), rgba(10,10,10,0.95))" }} />
        </div>

        {/* ══ SELECTED WORKS ════════════════════════════════════════════════ */}
        <section id="work" style={{ position: "relative", padding: "110px 40px", maxWidth: 1280, margin: "0 auto" }}>
          <SectionAccent />
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
            <button className="pill-btn" onClick={goToProjects}>
              View all work <ArrowUpRight size={13} />
            </button>
          </div>

          {/* bento layout */}
          <div
            className="bento-row"
            style={{ display: "grid", gridTemplateColumns: "7fr 5fr", gap: 16 }}
          >
            <ProjectCard project={featuredProjects[0]} onOpen={() => setSelectedProject(featuredProjects[0])} />
            <ProjectCard project={featuredProjects[1]} onOpen={() => setSelectedProject(featuredProjects[1])} />
            <div
              className="bento-sub-row"
              style={{
                display: "grid",
                gridTemplateColumns: "5fr 7fr",
                gridColumn: "1 / -1",
                gap: 16,
              }}
            >
              <ProjectCard project={featuredProjects[2]} onOpen={() => setSelectedProject(featuredProjects[2])} />
              <ProjectCard project={featuredProjects[3]} onOpen={() => setSelectedProject(featuredProjects[3])} />
            </div>
          </div>
        </section>

        {/* ══ JOURNAL ═══════════════════════════════════════════════════════ */}
        <section
          id="journal"
          style={{
            position: "relative",
            padding: "80px 40px 110px",
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          <SectionAccent top="22%" left="-10%" width="130%" rotate={-14} opacity={0.16} />
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
              <Eyebrow label="LinkedIn" />
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
                  posts.
                </em>
              </h2>
              <p style={{ color: C.muted, fontSize: "14px", marginTop: 16, maxWidth: 400, lineHeight: 1.7 }}>
                Thoughts on design, process, and creative strategy — shared on LinkedIn.
              </p>
            </div>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="pill-btn" style={{ textDecoration: "none" }}>
              View on LinkedIn <ArrowUpRight size={13} />
            </a>
          </div>

          {journalEntries.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {journalEntries.map((entry, i) => (
                <a
                  key={i}
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="journal-pill"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
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
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                      <Linkedin size={11} />
                      {entry.readTime}
                    </div>
                    <div>{entry.date}</div>
                  </div>
                </a>
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ VISUAL EXPLORATIONS ═══════════════════════════════════════════ */}
        <section
          id="visual"
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
          <SectionAccent top="26%" left="-12%" width="132%" rotate={-10} opacity={0.14} />
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
              <a
                href={BEHANCE_URL}
                target="_blank"
                rel="noopener noreferrer"
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
                  textDecoration: "none",
                }}
              >
                See on Behance <ArrowUpRight size={12} />
              </a>
            </GradientRing>
          </div>
        </section>

        {/* ══ STATS ═════════════════════════════════════════════════════════ */}
        <section
          style={{
            position: "relative",
            padding: "100px 40px",
            borderTop: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <SectionAccent top="36%" left="-8%" width="130%" rotate={-12} opacity={0.12} />
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
              { number: "10+", label: "Projects Delivered" },
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
          id="contact"
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
            <div style={{ marginTop: 42, width: "100%", maxWidth: 920 }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
                {CONTACT_BUTTONS.map(({ label, href, Icon, color, glow }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "14px 22px",
                      borderRadius: 9999,
                      border: "1px solid #8A8A8A",
                      color: C.text,
                      background: "transparent",
                      textDecoration: "none",
                      fontSize: "14px",
                      fontFamily: "Inter, sans-serif",
                      transition: "all 0.2s ease",
                      boxShadow: "0 0 0 transparent",
                    }}
                    onMouseEnter={(e) => {
                      const target = e.currentTarget as HTMLAnchorElement;
                      target.style.borderColor = color;
                      target.style.color = color;
                      target.style.boxShadow = `0 0 24px ${glow}`;
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget as HTMLAnchorElement;
                      target.style.borderColor = "#8A8A8A";
                      target.style.color = C.text;
                      target.style.boxShadow = "0 0 0 transparent";
                    }}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* footer bar */}
          <div
            className="footer-bar"
            style={{
              position: "relative",
              zIndex: 10,
              borderTop: `1px solid ${C.border}`,
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              padding: "20px 40px",
              gap: 14,
            }}
          >
            <span style={{ color: C.muted, fontSize: "12px", fontFamily: "Inter, sans-serif" }}>
              © 2026 Anes Ragoub. All rights reserved.
            </span>


            <div style={{ display: "flex", alignItems: "center", gap: 9, justifySelf: "end" }}>
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
