import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/for_her_wellbeing_logo.jpg';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const close = () => setMenuOpen(false);
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" onClick={close}>
          <img src={logo} alt="For Her Wellbeing" className="navbar__logo-img" />
        </Link>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <li><Link to="/about"    className={isActive('/about')}    onClick={close}>About</Link></li>
          <li><Link to="/services" className={isActive('/services')} onClick={close}>Services</Link></li>
          <li><Link to="/insights" className={isActive('/insights')} onClick={close}>Insights</Link></li>
          <li><Link to="/contact"  className={isActive('/contact')}  onClick={close}>Contact</Link></li>
        </ul>

        <Link to="/contact" className="navbar__cta" onClick={close}>Get My Diet Plan</Link>

        <button
          className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
