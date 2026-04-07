import { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './LeadMagnetModal.css';

export default function LeadMagnetModal({ resource, onClose }) {
  const [submitted, setSubmitted] = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="lm-overlay" onClick={onClose}>
      <div className="lm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="lm-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {submitted ? (
          <div className="lm-success">
            <div className="lm-success__icon">
              <CheckCircle size={36} strokeWidth={1.5} />
            </div>
            <h3 className="lm-success__title">On its way!</h3>
            <p className="lm-success__body">
              Your <strong>{resource.title}</strong> has been sent to your email.
              Check your inbox — it should arrive within a few minutes.
            </p>
            <button className="btn btn--primary lm-success__close" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="lm-header">
              <div className="lm-header__icon" style={{ background: resource.iconBg }}>
                {resource.icon}
              </div>
              <div>
                <p className="lm-header__label">Free Download</p>
                <h3 className="lm-header__title">{resource.title}</h3>
                <p className="lm-header__desc">{resource.desc}</p>
              </div>
            </div>

            <form className="lm-form" onSubmit={handleSubmit}>
              <div className="lm-field">
                <label>Full Name</label>
                <input type="text" placeholder="Your name" required />
              </div>
              <div className="lm-field">
                <label>Email Address</label>
                <input type="email" placeholder="you@example.com" required />
              </div>
              <div className="lm-field">
                <label>Phone Number</label>
                <input type="tel" placeholder="+91 00000 00000" required />
              </div>
              <div className="lm-consent">
                <label className="lm-consent__label">
                  <input type="checkbox" required />
                  <span>
                    I agree to the <Link to="/privacy" onClick={onClose}>Privacy Policy</Link> and
                    consent to receiving health guidance from For Her Wellbeing.
                  </span>
                </label>
              </div>
              <button type="submit" className="btn btn--primary lm-submit">
                Send Me the Free Guide
              </button>
              <p className="lm-trust">No spam. Unsubscribe anytime.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
