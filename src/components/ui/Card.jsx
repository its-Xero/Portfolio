import React from 'react';
import './Card.css';

/**
 * Base Card Layout
 * Adheres to Intentional Asymmetry and layered surface approach.
 */
const Card = ({ children, className = '', interactive = false }) => {
  return (
    <div className={`card ${interactive ? 'card-interactive' : ''} transition-smooth ${className}`}>
      {children}
    </div>
  );
};

export default Card;
