import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Leaf, FileText, BookOpen, CreditCard, HeartHandshake } from 'lucide-react';
import Footer from '../components/Footer';
import './HomePage.css';

const SERVICES = [
  { Icon: CalendarCheck,  title: 'Consultation Booking',     desc: 'Book a one-on-one consultation with a specialist through our simple phone-based booking system.' },
  { Icon: Leaf,           title: 'Personalised Diet Plans',  desc: 'Receive doctor-crafted nutrition plans tailored to your health conditions and goals.' },
  { Icon: FileText,       title: 'Health Record Management', desc: 'All your health history securely stored and accessible to your care team in one place.' },
  { Icon: BookOpen,       title: 'Autoimmune Resources',     desc: 'Curated library of articles, guides, and tools specifically for autoimmune conditions.' },
  { Icon: CreditCard,     title: 'Transparent Payments',     desc: 'Simple, clear consultation fee structure with full payment tracking.' },
  { Icon: HeartHandshake, title: 'Ongoing Support',          desc: 'Continuous follow-up care from our dedicated staff and medical team.' },
];

function Services() {
  return (
    <section className="services page-section-top">
      <div className="section-inner">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>What We Offer</p>
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          Comprehensive Services<br />Built Around You
        </h2>
        <div className="services__grid">
          {SERVICES.map(({ Icon, title, desc }) => (
            <div className="service-card" key={title}>
              <span className="service-card__icon"><Icon size={24} strokeWidth={1.5} /></span>
              <h4 className="service-card__title">{title}</h4>
              <p className="service-card__desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section className="cta-banner">
      <div className="cta-banner__inner">
        <h2 className="cta-banner__title">Ready to Start Your Wellness Journey?</h2>
        <p className="cta-banner__sub">
          Call us today and one of our care coordinators will guide you through booking your first consultation.
        </p>
        <div className="cta-banner__actions">
          <a href="tel:+000000000" className="btn btn--white">Call to Book</a>
          <Link to="/contact" className="btn btn--outline-white">Get in Touch</Link>
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <Services />
      <CTABanner />
      <Footer />
    </>
  );
}
