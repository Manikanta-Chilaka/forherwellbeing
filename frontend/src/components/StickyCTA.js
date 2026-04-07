import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StickyCTA.css';

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after user scrolls past ~80vh (past the hero)
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`sticky-cta${visible ? ' sticky-cta--visible' : ''}`}>
      <div className="sticky-cta__inner">
        <p className="sticky-cta__text">Ready to start your wellness journey?</p>
        <Link to="/contact" className="sticky-cta__btn">
          Get My Personalised Plan
        </Link>
      </div>
    </div>
  );
}
