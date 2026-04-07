import { useEffect, useState } from 'react';
import { Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './HomePage.css';
import './ContactPage.css';

const GOALS = [
  { value: 'weight-loss',     label: 'Weight Loss' },
  { value: 'pcos',            label: 'PCOS Management' },
  { value: 'pregnancy',       label: 'Pregnancy & Postnatal' },
  { value: 'hormonal-health', label: 'Hormonal Health' },
  { value: 'autoimmune',      label: 'Autoimmune Condition' },
  { value: 'general-health',  label: 'General Health & Nutrition' },
];

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [goal, setGoal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="contact page-section-top">
        <div className="section-inner contact__inner contact__inner--narrow">
          <div className="contact__success">
            <div className="contact__success-icon">
              <CheckCircle size={40} strokeWidth={1.5} />
            </div>
            <h2 className="contact__success-title">You're on your way.</h2>
            <p className="contact__success-body">
              Thank you for reaching out. Our care coordinator will call you within 24 hours
              to confirm your appointment and understand your health goals.
            </p>
            <p className="contact__success-note">
              In the meantime, feel free to explore our <a href="/insights">Knowledge Hub</a> for evidence-based wellness insights.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="contact page-section-top">
      <div className="section-inner contact__inner">
        <div className="contact__info">
          <p className="section-eyebrow">Book a Consultation</p>
          <h2 className="section-title">Get My<br />Personalised Diet Plan</h2>
          <p className="section-body">
            Tell us a little about yourself. Our care coordinator will call you,
            understand your needs, and confirm your appointment — no hassle, no waiting rooms.
          </p>
          <div className="contact__details">
            <div className="contact__detail">
              <span className="contact__detail-icon"><Phone size={18} strokeWidth={1.5} /></span>
              <div>
                <strong>Phone</strong>
                <p>+000 000 0000</p>
              </div>
            </div>
            <div className="contact__detail">
              <span className="contact__detail-icon"><Mail size={18} strokeWidth={1.5} /></span>
              <div>
                <strong>Email</strong>
                <p>hello@forherwellbeing.com</p>
              </div>
            </div>
            <div className="contact__detail">
              <span className="contact__detail-icon"><Clock size={18} strokeWidth={1.5} /></span>
              <div>
                <strong>Hours</strong>
                <p>Monday – Saturday, 9am – 6pm</p>
              </div>
            </div>
          </div>
        </div>

        <form className="contact__form" onSubmit={handleSubmit}>
          <p className="contact__form-step">Step 1 of 1 — Takes less than 2 minutes</p>
          <h3 className="contact__form-title">Tell Us About Yourself</h3>

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Your name" required />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" placeholder="+91 00000 00000" required />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" required />
          </div>

          <div className="form-group">
            <label>What is your primary health goal?</label>
            <div className="goal-grid">
              {GOALS.map(({ value, label }) => (
                <label key={value} className={`goal-chip${goal === value ? ' goal-chip--active' : ''}`}>
                  <input
                    type="radio"
                    name="goal"
                    value={value}
                    required
                    onChange={() => setGoal(value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group form-group--consent">
            <label className="consent-label">
              <input type="checkbox" required />
              <span>
                I agree to the <Link to="/privacy">Privacy Policy</Link> and consent to my data being
                used for personalised nutrition guidance.
              </span>
            </label>
          </div>

          <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Get My Personalised Plan
          </button>
          <p className="contact__form-trust">
            Trusted by 100+ women &bull; No generic diet charts &bull; Personalised for your body
          </p>
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
