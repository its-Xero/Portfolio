import './Button.css';

/**
 * Luminous Button Component
 * 
 * HOW TO ADD NEW VARIANTS:
 * 1. Add a new .btn-<variant> class in Button.css
 * 2. Follow the glow-on-hover pattern from btn-primary
 * 3. Pass variant="<variant>" as a prop
 * 
 * Props:
 *  - variant: 'primary' | 'secondary' | 'ghost' (default: 'primary')
 *  - children: button content
 *  - onClick: click handler
 *  - className: additional classes
 *  - href: if provided, renders an <a> tag instead
 */
const Button = ({ variant = 'primary', children, onClick, className = '', href }) => {
  const classes = `btn btn-${variant} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
