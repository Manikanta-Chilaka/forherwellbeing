import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Users, Sun } from 'lucide-react';
import Footer from '../components/Footer';
import './HomePage.css';

function About() {
  const ABOUT_CARDS = [
    { Icon: Sprout, title: 'Puberty',             desc: 'Compassionate guidance through hormonal and physical changes.' },
    { Icon: Users,  title: 'Fertility & Pregnancy', desc: 'Support at every step of your reproductive journey.' },
    { Icon: Sun,    title: 'Menopause',            desc: 'Expert care to navigate this significant life transition.' },
  ];

  return (
    <section className="about page-section-top" id="about">
      <div className="section-inner">
        <div className="about__text">
          <p className="section-eyebrow">Who We Are</p>
          <h2 className="section-title">Understanding the Unique<br />Health Journey of Women</h2>
          <p className="section-body">
            From the hormonal shifts of puberty to the significant changes of menopause,
            women navigate a unique journey of health challenges. Many of these issues are
            often overlooked or misunderstood.
          </p>
          <p className="section-body">
            Our mission is to create a dedicated platform for women's health, offering
            support, information, and community for a variety of conditions.
          </p>
          <Link to="/contact" className="btn btn--primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
            Get in Touch
          </Link>
        </div>

        <div className="about__cards">
          {ABOUT_CARDS.map(({ Icon, title, desc }) => (
            <div className="about__card" key={title}>
              <span className="about__card-icon"><Icon size={22} strokeWidth={1.5} /></span>
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Mission() {
  return (
    <section className="mission" id="mission">
      <div className="section-inner mission__inner">
        <div className="mission__badge">Our Mission</div>
        <h2 className="section-title mission__title">
          Empowering Women with<br />Autoimmune Conditions
        </h2>
        <p className="mission__body">
          We're particularly committed to supporting women with autoimmune diseases.
          Given their higher incidence and complex nature in women, our platform will
          strive to empower them with specialized knowledge and resources to better
          manage their conditions.
        </p>

        <div className="mission__pillars">
          {[
            { num: '01', heading: 'Specialised Knowledge', text: 'Evidence-based resources curated specifically for autoimmune conditions in women.' },
            { num: '02', heading: 'Expert Consultations', text: "Connect directly with doctors who understand the nuances of women's health." },
            { num: '03', heading: 'Community Support', text: 'A safe space to share, learn, and heal alongside others on the same journey.' },
            { num: '04', heading: 'Personalised Care', text: 'Diet plans and lifestyle recommendations tailored to your unique biology.' },
          ].map(({ num, heading, text }) => (
            <div className="pillar" key={num}>
              <span className="pillar__num">{num}</span>
              <h4 className="pillar__heading">{heading}</h4>
              <p className="pillar__text">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <About />
      <Mission />
      <Footer />
    </>
  );
}
