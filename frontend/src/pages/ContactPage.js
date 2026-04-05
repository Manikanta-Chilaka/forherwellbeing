import { useEffect } from 'react';
import Footer from '../components/Footer';
import './HomePage.css';

function Contact() {
  return (
    <section className="contact page-section-top">
      <div className="section-inner contact__inner">
        <div className="contact__info">
          <p className="section-eyebrow">Contact Us</p>
          <h2 className="section-title">We're Here<br />for You</h2>
          <p className="section-body">
            Have questions? Our team is always ready to help you find the right care
            for your health journey.
          </p>
          <div className="contact__details">
            <div className="contact__detail">
              <span className="contact__detail-icon">&#128222;</span>
              <div>
                <strong>Phone</strong>
                <p>+000 000 0000</p>
              </div>
            </div>
            <div className="contact__detail">
              <span className="contact__detail-icon">&#128140;</span>
              <div>
                <strong>Email</strong>
                <p>hello@forherwellbeing.com</p>
              </div>
            </div>
            <div className="contact__detail">
              <span className="contact__detail-icon">&#128336;</span>
              <div>
                <strong>Hours</strong>
                <p>Monday – Saturday, 9am – 6pm</p>
              </div>
            </div>
          </div>
        </div>

        <form className="contact__form" onSubmit={(e) => e.preventDefault()}>
          <h3 className="contact__form-title">Send Us a Message</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Jane Doe" required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="jane@example.com" required />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea rows={4} placeholder="How can we help you?" required />
          </div>
          <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

export default function ContactPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <Contact />
      <Footer />
    </>
  );
}
