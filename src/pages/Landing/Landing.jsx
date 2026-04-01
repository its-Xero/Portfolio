import { Link } from 'react-router-dom';
import { Code2, Palette } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="door developer-door">
        <div className="radial-glow dev-glow"></div>
        <div className="door-content">
          <div className="door-icon-wrapper">
            <Code2 size={40} className="door-icon" />
          </div>
          <h2 className="display door-title">Developer</h2>
          <p className="door-desc">Architecture, Logic, & Code.</p>
          <Link to="/developer" className="door-btn" aria-label="View Developer Portfolio">
            Enter Void
          </Link>
        </div>
      </div>
      
      <div className="door designer-door">
        <div className="radial-glow deg-glow"></div>
        <div className="door-content">
          <div className="door-icon-wrapper">
            <Palette size={40} className="door-icon" />
          </div>
          <h2 className="display door-title">Designer</h2>
          <p className="door-desc">Aesthetics, Motion, & Space.</p>
          <Link to="/designer" className="door-btn" aria-label="View Designer Portfolio">
            Enter Nexus
          </Link>
        </div>
      </div>

      <div className="landing-divider">
        <div className="divider-line"></div>
        <span className="divider-text">OR</span>
        <div className="divider-line"></div>
      </div>
    </div>
  );
};

export default Landing;
