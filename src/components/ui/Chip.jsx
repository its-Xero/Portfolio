import './Chip.css';

/**
 * Chip / Tag Component
 * 
 * HOW TO ADD NEW CHIPS:
 *  - Just render <Chip>Your Text</Chip>
 *  - The chip auto-styles with surface-variant bg and primary text
 */
const Chip = ({ children, className = '' }) => {
  return (
    <span className={`chip ${className}`}>
      {children}
    </span>
  );
};

export default Chip;
