import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Utensils, FolderOpen, BookOpen,
  CreditCard, HeartHandshake, ArrowRight,
  ClipboardCheck, UserCheck, Sparkles
} from 'lucide-react';
import doctorPhoto from '../assets/WhatsApp-Image-2025-07-02-at-1.11.59-PM.jpg';
import Footer from '../components/Footer';
import './HomePage.css';

/* ─── Hero ───────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__bg-circles">
        <span className="circle circle--1" />
        <span className="circle circle--2" />
        <span className="circle circle--3" />
      </div>

      <div className="hero__content">
        <p className="hero__eyebrow">Women's Health — Redefined</p>
        <h1 className="hero__title">
          Your Health.<br />
          <em>Your Journey.</em><br />
          Our Commitment.
        </h1>
        <p className="hero__subtitle">
          A dedicated platform built exclusively for women — offering expert
          consultations, personalised care, and a community that truly understands.
        </p>
        <div className="hero__actions">
          <Link to="/contact" className="btn btn--primary">Book a Consultation</Link>
          <Link to="/about" className="btn btn--ghost">Learn More</Link>
        </div>

        <div className="hero__stats">
          <div className="stat">
            <span className="stat__num">100+</span>
            <span className="stat__label">Patients Supported</span>
          </div>
          <div className="stat__divider" />
          <div className="stat">
            <span className="stat__num">5+</span>
            <span className="stat__label">Years Experience</span>
          </div>
          <div className="stat__divider" />
          <div className="stat">
            <span className="stat__num">100%</span>
            <span className="stat__label">Focused on Women</span>
          </div>
        </div>
      </div>

      <div className="hero__visual">
        <div className="hero__photo-wrap">
          <img src={doctorPhoto} alt="Dr. Ragadeepthi Ediga" className="hero__photo" />
          <div className="hero__photo-badge">
            <span className="hero__photo-badge-name">Dr. Ragadeepthi Ediga</span>
            <span className="hero__photo-badge-title">Women's Health & Nutrition Specialist</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── How it Works ──────────────────────────────────── */
const HOW_STEPS = [
  {
    num: '01',
    Icon: Calendar,
    title: 'Book a Consultation',
    desc: 'Reach out through our contact page or call us directly to express your interest.',
  },
  {
    num: '02',
    Icon: ClipboardCheck,
    title: 'Our Staff Will Contact You',
    desc: 'Our care coordinator will call you, understand your needs, and confirm your appointment slot.',
  },
  {
    num: '03',
    Icon: UserCheck,
    title: 'Meet Your Specialist',
    desc: 'Have a focused one-on-one session with Dr. Ragadeepthi to discuss your health history, concerns, and goals.',
  },
  {
    num: '04',
    Icon: Sparkles,
    title: 'Receive Your Personalised Plan',
    desc: 'Get a custom nutrition and wellness plan built specifically around your condition, lifestyle, and goals.',
  },
];

function HowItWorks() {
  return (
    <section className="hiw">
      <div className="section-inner">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>Simple Process</p>
        <h2 className="section-title" style={{ textAlign: 'center' }}>How It Works</h2>
        <p className="hiw__sub">Getting started is straightforward. Three steps to expert, personalised care.</p>

        <div className="hiw__steps">
          {HOW_STEPS.map(({ num, Icon, title, desc }, i) => (
            <div className="hiw-step" key={num}>
              <div className="hiw-step__top">
                <div className="hiw-step__num">{num}</div>
                <div className="hiw-step__icon-wrap">
                  <Icon size={26} strokeWidth={1.5} />
                </div>
              </div>
              <h4 className="hiw-step__title">{title}</h4>
              <p className="hiw-step__desc">{desc}</p>
              {i < HOW_STEPS.length - 1 && <span className="hiw-step__connector" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Services Preview ───────────────────────────────── */
const SERVICES = [
  { Icon: Calendar,        title: 'Consultation Booking',     desc: 'Book one-on-one sessions with our specialist through a simple, guided process.' },
  { Icon: Utensils,        title: 'Personalised Diet Plans',  desc: 'Doctor-crafted nutrition plans tailored to your specific health conditions and goals.' },
  { Icon: FolderOpen,      title: 'Health Record Management', desc: 'Your health history securely stored and accessible to your care team at any time.' },
  { Icon: BookOpen,        title: 'Autoimmune Resources',     desc: 'Curated guides and tools for PCOS, Thyroid, Lupus, Endometriosis, and more.' },
  { Icon: CreditCard,      title: 'Transparent Payments',     desc: 'Clear consultation fee structure with full payment tracking — no hidden charges.' },
  { Icon: HeartHandshake,  title: 'Ongoing Support',          desc: 'Continuous follow-up care from our dedicated team throughout your wellness journey.' },
];

function ServicesPreview() {
  return (
    <section className="sp">
      <div className="section-inner">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>What We Offer</p>
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          Comprehensive Care,<br />Designed for Women
        </h2>
        <p className="sp__sub">Every service is built around one focus — your health, your way.</p>

        <div className="sp__grid">
          {SERVICES.map(({ Icon, title, desc }) => (
            <div className="sp-card" key={title}>
              <div className="sp-card__icon">
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <h4 className="sp-card__title">{title}</h4>
              <p className="sp-card__desc">{desc}</p>
            </div>
          ))}
        </div>

        <div className="sp__cta">
          <Link to="/services" className="sp__link">
            View All Services <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────── */
const TESTIMONIALS = [
  { name: 'Rajyalaxmi',        category: 'Yoga & Meditation',      quote: 'Guided meditations should be taken seriously. It is a gift that you have. Use it and help us help ourselves.' },
  { name: 'Sreerama Divyasree', category: 'Yoga Program',          quote: "This is a great initiative and need of the hour. This is not just a commercial program, it has the potential to transform one's life. I wish Dr. Jagadeesh Gandla and Dr. Ragadeepthi Ediga to touch many lives in ways beyond this physical world. Feel thankful to be part of this journey. Om Namah Shivaya." },
  { name: 'Lakshmi Prasanna',  category: 'Program Feedback',       quote: 'Please plan more programs and continue these types of sessions in the coming days.' },
  { name: 'Manmohan',          category: 'Program Feedback',       quote: 'The program should be continued for more days.' },
  { name: 'Likitha',           category: 'General Feedback',       quote: 'Nothing to add. Everything was good.' },
  { name: 'Shravanthi',        category: 'Child Yoga Training',    quote: 'I have seen a lot of difference in her body flexibility and emotional control through meditation. Her hormonal balance and healthy habits have been achieved with your extensive knowledge. She is very lucky to have you as her guru.' },
  { name: 'Nandini',           category: 'Postpartum Weight Loss', quote: "I was able to lose 7 kg in a healthy and sustainable way after having my baby. Your customized meal plan made such a difference — not just in weight loss, but in how I feel overall. I never felt like I was on a diet. You've helped me regain my confidence." },
  { name: 'Soumya',            category: 'Antenatal Class',        quote: 'Thank you mam for giving more information and clarifying our doubts.' },
  { name: 'Sowmya',            category: 'Pregnancy Sessions',     quote: 'I have been attending classes from the beginning of my pregnancy. All these sessions are very helpful and supportive mentally and emotionally. Thanks a lot Dr. Manasa mam and Dr. Deepthi mam.' },
  { name: 'Nagalaxmi',         category: 'Pregnancy Education',    quote: 'Thank you for the wonderful session Mam! It was incredibly informative and reassuring. All pregnancy-related topics were clearly explained and every doubt was patiently addressed.' },
  { name: 'Nikitha',           category: 'Nutrition Sessions',     quote: 'Mam is clarifying doubts very clearly with patience. By attending all the sessions, many fears and doubts were cleared. Thank you Mam for sharing such useful nutritional tips.' },
  { name: 'Yashashwini',       category: 'Weight Loss Journey',    quote: 'I have tried many methods for weight loss, but when I followed your diet I saw tremendous results. My periods became regular within 20 days. Weight loss and inch loss were visible to everyone within a month.' },
  { name: 'Nikhila',           category: 'Microgreens & Yoga',     quote: 'I learned many new things — how to grow seeds, how to check growth, when to harvest. You taught many yoga variations, discipline and meditation. Now I am regularly doing yoga on my own which keeps me healthy and happy.' },
];

function Testimonials() {
  const items = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <section className="testimonials" id="testimonials">
      <div className="section-inner">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>Real Stories</p>
        <h2 className="section-title" style={{ textAlign: 'center' }}>Words from Our Community</h2>
        <p className="testimonials__sub">Real voices from women and families who experienced our care first-hand.</p>
      </div>
      <div className="tslider-viewport">
        <div className="tslider-track">
          {items.map(({ name, category, quote }, i) => (
            <div className="tcard" key={i}>
              <div className="tcard__quote-icon">"</div>
              <p className="tcard__text">{quote}</p>
              <div className="tcard__footer">
                <div className="tcard__avatar">{name.charAt(0)}</div>
                <div>
                  <p className="tcard__name">{name}</p>
                  <p className="tcard__category">{category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Banner ─────────────────────────────────────── */
function CTABanner() {
  return (
    <section className="cta-banner" id="book">
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

/* ─── Page ───────────────────────────────────────────── */
export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  return (
    <>
      <Hero />
      <HowItWorks />
      <ServicesPreview />
      <Testimonials />
      <CTABanner />
      <Footer />
    </>
  );
}
