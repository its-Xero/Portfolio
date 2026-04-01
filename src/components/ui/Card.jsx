import './Card.css';

/**
 * Card Component — Layered Surface
 * 
 * HOW TO USE:
 *  - Wrap any content in <Card> for the surface-container-high background
 *  - Set interactive={true} for hover scale + brightness shift
 *  - Set glow={true} for a subtle primary glow on hover
 * 
 * HOW TO ADD NEW CARD STYLES:
 *  - Add a new class like .card-featured in Card.css
 *  - Pass it via className prop
 */
const Card = ({ children, className = '', interactive = false, glow = false }) => {
  const classes = [
    'card',
    interactive && 'card-interactive',
    glow && 'card-glow',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;
