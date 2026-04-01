import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { ArrowRight, Star } from 'lucide-react';
import './Home.css';

/**
 * Main Home Page View
 * HOW TO ADD NEW SECTIONS: 
 * - Create a new <section> tag below existing sections.
 * - Map it to an ID (like id="my-new-section").
 * - Use the grid-offset utility from globals.css for asynchronous layout.
 * - Use Card/Button components for the UI.
 */
const Home = () => {
  return (
    <div className="home-container">
      {/* Background glow texture */}
      <div className="radial-glow-hero"></div>
      
      <Navbar />

      <main className="main-content">
        {/* HERO SECTION */}
        <section className="hero-section">
          <h1 className="hero-title display">
            Digital <br /> Architect’s Void.
          </h1>
          <p className="hero-subtitle">
            Not a flat canvas, but a deep multidimensional space. Designing interfaces that feel like a liquid environment.
          </p>
          <div className="hero-actions">
            <Button variant="primary">
              View Work <ArrowRight size={18} />
            </Button>
            <Button variant="secondary">
              Contact Me
            </Button>
          </div>
        </section>

        {/* WORK/PROJECTS SECTION */}
        <section className="work-section" id="work">
          <h2 className="section-title display">Recent<br/>Projects</h2>
          
          <div className="grid-offset">
            {/* Adding new items? Just add a new Card component! */}
            <Card interactive={true} className="project-card">
              <div className="project-card-header">
                <span className="label text-primary">Case Study 01</span>
                <Star size={24} color="var(--color-primary)" />
              </div>
              <h3 className="project-title display">Bloom Dashboard</h3>
              <p className="project-desc">Health metric visualization using layered surfaces and no structural borders.</p>
            </Card>

            <Card interactive={true} className="project-card mt-offset">
              <div className="project-card-header">
                <span className="label text-primary">Case Study 02</span>
                <Star size={24} color="var(--color-primary)" />
              </div>
              <h3 className="project-title display">Celestial Nexus</h3>
              <p className="project-desc">A premium portfolio experience built on glassmorphism and intentional asymmetry.</p>
            </Card>
          </div>
        </section>
      </main>

    </div>
  );
};

export default Home;
