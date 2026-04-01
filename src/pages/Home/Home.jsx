import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Chip from '../../components/ui/Chip';
import SectionHeader from '../../components/ui/SectionHeader';
import useScrollReveal from '../../hooks/useScrollReveal';
import { ArrowRight, ExternalLink, Sparkles, Layers, Palette, Code2, Send } from 'lucide-react';
import './Home.css';

/**
 * ═══════════════════════════════════════════════════════════
 * HOME PAGE — The Celestial Nexus Portfolio
 * ═══════════════════════════════════════════════════════════
 * 
 * HOW TO ADD NEW SECTIONS:
 *  1. Create a new <section> block inside <main>
 *  2. Give it an id (e.g. id="testimonials") and className="section"
 *  3. Use <div className="container"> for max-width centering
 *  4. Use <SectionHeader> for the heading
 *  5. Add the id to the Navbar links array in Navbar.jsx
 * 
 * HOW TO ADD NEW PROJECTS:
 *  - Add a new object to the `projects` array below
 *  - Each project needs: id, label, title, description, tags, link
 * 
 * HOW TO ADD NEW SKILLS:
 *  - Add a new object to the `skills` array below
 */

const developerProjects = [
  {
    id: 1,
    label: 'GitHub Repo',
    title: 'Project-BI',
    description: 'University project, subject is Business Intelligence, all built using Python.',
    tags: ['Python', 'BI', 'Data'],
    link: 'https://github.com/its-Xero/Project-BI',
  },
  {
    id: 2,
    label: 'GitHub Repo',
    title: 'UNO-Business',
    description: 'This project was made for a client that needed a personalized java.swing library to create a uno game GUI.',
    tags: ['Java', 'Swing'],
    link: 'https://github.com/its-Xero/UNO-Business',
  },
  {
    id: 3,
    label: 'GitHub Repo',
    title: 'faculty-webapp',
    description: 'Faculty students management web application programmed with Express.js, React.js, and SQL.',
    tags: ['React', 'Express', 'SQL'],
    link: 'https://github.com/its-Xero/faculty-webapp',
  },
  {
    id: 4,
    label: 'GitHub Repo',
    title: 'senaNova & TP-WEB-DEV',
    description: 'Various labs, academic work, and independent explorations in web-dev and python.',
    tags: ['Web Dev', 'Python', 'Labs'],
    link: 'https://github.com/its-Xero?tab=repositories',
  }
];

const designerProjects = [
  {
    id: 1,
    label: 'Case Study 01',
    title: 'Bloom Dashboard',
    description: 'Health metric visualization using layered surfaces, ambient lighting, and the no-line separation principle.',
    tags: ['Figma', 'UI/UX', 'Design System'],
    link: '#',
  },
  {
    id: 2,
    label: 'Case Study 02',
    title: 'Celestial Nexus',
    description: 'A premium portfolio experience built on glassmorphism, intentional asymmetry, and liquid motion design.',
    tags: ['Web Design', 'Motion', 'Prototyping'],
    link: '#',
  },
  {
    id: 3,
    label: 'Case Study 03',
    title: 'GlycoPal',
    description: 'Mobile health companion app with dynamic theming, real-time data logging, and personalized insights.',
    tags: ['Mobile UX', 'User Testing', 'Wireframing'],
    link: '#',
  },
];

const skills = [
  { icon: Code2, title: 'Development', description: 'Building performant, accessible interfaces with React, TypeScript, and modern tooling.' },
  { icon: Palette, title: 'Design Systems', description: 'Creating comprehensive token-based systems that scale across products and platforms.' },
  { icon: Layers, title: 'Architecture', description: 'Structuring codebases for maintainability, reusability, and team collaboration.' },
  { icon: Sparkles, title: 'Motion & Polish', description: 'Crafting micro-interactions and animations that elevate the user experience.' },
];

const Home = ({ role = 'developer' }) => {
  const isDev = role === 'developer';
  const projects = isDev ? developerProjects : designerProjects;
  
  const workReveal = useScrollReveal();
  const aboutReveal = useScrollReveal();
  const skillsReveal = useScrollReveal();
  const contactReveal = useScrollReveal();

  return (
    <>
      <Navbar />

      <main>
        {/* ═══════════════════════════════════════════
            HERO SECTION
            ═══════════════════════════════════════════ */}
        <section className="hero section">
          {/* Signature radial glow */}
          <div className="radial-glow hero-glow" />

          <div className="container hero-content">
            <span className="label hero-label reveal reveal-delay-1">{isDev ? 'Developer Workflow · 2026' : 'Designer Nexus · 2026'}</span>
            <h1 className="hero-title display reveal reveal-delay-2">
              {isDev ? <>Digital<br />Architect's<br />Void.</> : <>Creative<br />Nexus<br />Space.</>}
            </h1>
            <p className="hero-subtitle reveal reveal-delay-3">
              {isDev
                ? "Not just code, but systematic logic. Architecting scalable, robust software solutions that solve complex problems intelligently."
                : "Not a flat canvas, but a deep multidimensional space. Designing interfaces that feel like a liquid environment — smooth, frictionless, and premium."}
            </p>
            <div className="hero-actions reveal reveal-delay-4">
              <Button variant="primary" href="#work">
                View Work <ArrowRight size={16} />
              </Button>
              <Button variant="secondary" href="#contact">
                Get in Touch
              </Button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            WORK / PROJECTS SECTION
            ═══════════════════════════════════════════ */}
        <section
          id="work"
          className="section"
          ref={workReveal.ref}
        >
          <div className={`container scroll-reveal ${workReveal.isVisible ? 'visible' : ''}`}>
            <SectionHeader label="Selected Work" title="Recent Projects" />

            <div className="projects-grid">
              {projects.map((project, i) => (
                <Card
                  key={project.id}
                  interactive
                  glow
                  className={`project-card project-card-${i % 2 === 0 ? 'even' : 'odd'}`}
                >
                  <div className="project-card-top">
                    <span className="label project-label">{project.label}</span>
                    <a href={project.link} className="project-link" aria-label={`View ${project.title}`}>
                      <ExternalLink size={18} />
                    </a>
                  </div>
                  <h3 className="project-title display">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <Chip key={tag}>{tag}</Chip>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            ABOUT SECTION
            ═══════════════════════════════════════════ */}
        <section
          id="about"
          className="section about-section"
          ref={aboutReveal.ref}
        >
          <div className={`container scroll-reveal ${aboutReveal.isVisible ? 'visible' : ''}`}>
            <div className="about-layout">
              <div className="about-text">
                <SectionHeader label="About" title="The Person Behind the Pixels" />
                <p className="about-body">
                  I'm a developer and designer who treats the browser viewport as a 
                  multidimensional canvas. I specialize in building premium digital 
                  experiences that break free from templates and conventions.
                </p>
                <p className="about-body">
                  My approach combines meticulous design systems with clean, 
                  scalable architecture — ensuring every pixel serves a purpose 
                  and every interaction feels intentional.
                </p>
                <Button variant="ghost" href="#contact">
                  Let's connect <ArrowRight size={16} />
                </Button>
              </div>

              <div
                className={`about-skills scroll-reveal ${skillsReveal.isVisible ? 'visible' : ''}`}
                ref={skillsReveal.ref}
              >
                {skills.map((skill, i) => (
                  <div
                    key={skill.title}
                    className="skill-item"
                    style={{ transitionDelay: `${i * 0.1}s` }}
                  >
                    <div className="skill-icon">
                      <skill.icon size={20} />
                    </div>
                    <div>
                      <h4 className="skill-title">{skill.title}</h4>
                      <p className="skill-desc">{skill.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CONTACT SECTION
            ═══════════════════════════════════════════ */}
        <section
          id="contact"
          className="section contact-section"
          ref={contactReveal.ref}
        >
          <div className="radial-glow contact-glow" />
          <div className={`container scroll-reveal ${contactReveal.isVisible ? 'visible' : ''}`}>
            <div className="contact-inner">
              <SectionHeader
                label="Contact"
                title="Let's Build Something Together"
                align="center"
              />
              <p className="contact-desc">
                Have a project in mind or just want to chat? I'd love to hear from you. 
                Drop me a message and let's create something extraordinary.
              </p>
              <div className="contact-actions">
                <Button variant="primary" href="mailto:hello@example.com">
                  <Send size={16} /> Send a Message
                </Button>
                <Button variant="secondary" href="https://linkedin.com" >
                  Connect on LinkedIn
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
