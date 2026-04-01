import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal — IntersectionObserver hook for scroll-triggered animations
 * 
 * HOW TO USE:
 *  const { ref, isVisible } = useScrollReveal();
 *  <div ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`}>
 */
const useScrollReveal = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element); // Only trigger once
        }
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? '0px 0px -50px 0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return { ref, isVisible };
};

export default useScrollReveal;
