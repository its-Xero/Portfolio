import React from 'react';
import './Button.css';

/**
 * Luminous Button Component
 * HOW TO ADD NEW VARIANTS: You can add new styles in Button.css following the "luminous" glow effect pattern.
 */
const Button = ({ variant = 'primary', children, onClick, className = '' }) => {
  return (
    <button 
      className={`btn btn-${variant} label transition-smooth ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
