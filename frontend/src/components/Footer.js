import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">
            <span style={{ color: 'var(--primary-dark)' }}>FOR</span>
            <span style={{ color: 'var(--primary-light)' }}>HER</span>
            <span style={{ color: 'var(--accent)' }}>WELLBEING</span>
          </span>
          <p className="footer__tagline">
            Dedicated to women's health — from puberty to menopause and everything in between.
          </p>
        </div>

        <div className="footer__links">
          <h5>Quick Links</h5>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/about">Our Mission</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer__links">
          <h5>Services</h5>
          <ul>
            <li><Link to="/contact">Book Consultation</Link></li>
            <li><Link to="/services">Diet Plans</Link></li>
            <li><Link to="/services">Autoimmune Support</Link></li>
            <li><Link to="/services">Health Records</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} ForHerWellbeing. All rights reserved.</p>
        <Link to="/privacy" style={{ color: 'inherit' }}>Privacy Policy</Link>
      </div>
    </footer>
  );
}
