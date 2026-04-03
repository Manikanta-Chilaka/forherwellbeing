import { useEffect } from 'react';
import doctorPhoto from '../assets/WhatsApp-Image-2025-07-02-at-1.11.59-PM.jpg';
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
          <a href="#book" className="btn btn--primary">Book a Consultation</a>
          <a href="#about" className="btn btn--ghost">Learn More</a>
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

/* ─── About ──────────────────────────────────────────── */
function About() {
  return (
    <section className="about" id="about">
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
          <a href="#mission" className="btn btn--primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
            Our Mission
          </a>
        </div>

        <div className="about__cards">
          {[
            { icon: '&#127801;', title: 'Puberty', desc: 'Compassionate guidance through hormonal and physical changes.' },
            { icon: '&#129309;', title: 'Fertility & Pregnancy', desc: 'Support at every step of your reproductive journey.' },
            { icon: '&#127774;', title: 'Menopause', desc: 'Expert care to navigate this significant life transition.' },
          ].map(({ icon, title, desc }) => (
            <div className="about__card" key={title}>
              <span className="about__card-icon" dangerouslySetInnerHTML={{ __html: icon }} />
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Mission ────────────────────────────────────────── */
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

/* ─── Services ───────────────────────────────────────── */
function Services() {
  const services = [
    {
      icon: '&#128205;',
      title: 'Consultation Booking',
      desc: 'Book a one-on-one consultation with a specialist through our simple phone-based booking system.',
    },
    {
      icon: '&#127807;',
      title: 'Personalised Diet Plans',
      desc: 'Receive doctor-crafted nutrition plans tailored to your health conditions and goals.',
    },
    {
      icon: '&#128203;',
      title: 'Health Record Management',
      desc: 'All your health history securely stored and accessible to your care team in one place.',
    },
    {
      icon: '&#128218;',
      title: 'Autoimmune Resources',
      desc: 'Curated library of articles, guides, and tools specifically for autoimmune conditions.',
    },
    {
      icon: '&#128176;',
      title: 'Transparent Payments',
      desc: 'Simple, clear consultation fee structure with full payment tracking.',
    },
    {
      icon: '&#129309;',
      title: 'Ongoing Support',
      desc: 'Continuous follow-up care from our dedicated staff and medical team.',
    },
  ];

  return (
    <section className="services" id="services">
      <div className="section-inner">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>What We Offer</p>
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          Comprehensive Services<br />Built Around You
        </h2>

        <div className="services__grid">
          {services.map(({ icon, title, desc }) => (
            <div className="service-card" key={title}>
              <span className="service-card__icon" dangerouslySetInnerHTML={{ __html: icon }} />
              <h4 className="service-card__title">{title}</h4>
              <p className="service-card__desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: 'Rajyalaxmi',
    category: 'Yoga & Meditation',
    quote: 'Guided meditations should be taken seriously. It is a gift that you have. Use it and help us help ourselves.',
  },
  {
    name: 'Sreerama Divyasree',
    category: 'Yoga Program',
    quote: 'This is a great initiative and need of the hour. This is not just a commercial program, it has the potential to transform one\'s life. I wish Dr. Jagadeesh Gandla and Dr. Ragadeepthi Ediga to touch many lives in ways beyond this physical world. I feel thankful to be part of this journey and forever grateful to you both for introducing yoga into my life. Om Namah Shivaya.',
  },
  {
    name: 'Lakshmi Prasanna',
    category: 'Program Feedback',
    quote: 'Please plan more programs and continue these types of sessions in the coming days.',
  },
  {
    name: 'Manmohan',
    category: 'Program Feedback',
    quote: 'The program should be continued for more days.',
  },
  {
    name: 'Likitha',
    category: 'General Feedback',
    quote: 'Nothing to add. Everything was good.',
  },
  {
    name: 'Shravanthi',
    category: 'Child Yoga Training',
    quote: 'Hello Deepthi Mam, Ezra is turning 11 this month and I would like to share my gratitude for your contribution to her healthy life. I have seen a lot of difference in her body flexibility and emotional control through meditation. My main objective in sending her to yoga at this age was hormonal balance and healthy habits. I can surely say that it has been achieved with your extensive knowledge and teaching techniques. She is very lucky to have you as her guru in her life journey.',
  },
  {
    name: 'Nandini',
    category: 'Postpartum Weight Loss',
    quote: 'I want to sincerely thank you mam for your amazing support and guidance throughout my postpartum journey. With your help, I was able to lose 7 kg in a healthy and sustainable way after having my baby. Your customized meal plan and practical advice made such a difference — not just in my weight loss, but also in how I feel overall. Most importantly, I never felt like I was on a diet. You\'ve helped me regain my confidence and feel good in my body again.',
  },
  {
    name: 'Soumya',
    category: 'Antenatal Class',
    quote: 'Thank you mam for giving more information and clarifying our doubts.',
  },
  {
    name: 'Sowmya',
    category: 'Pregnancy Sessions',
    quote: 'I have been attending classes from the beginning of my pregnancy. All these sessions are very helpful and supportive mentally and emotionally. Thanks a lot for initiating and conducting these classes Dr. Manasa mam and Dr. Deepthi mam.',
  },
  {
    name: 'Nagalaxmi',
    category: 'Pregnancy Education',
    quote: 'Thank you for the wonderful session Mam! It was incredibly informative and reassuring. I truly appreciate how all the pregnancy-related topics were clearly explained and how every doubt was patiently addressed.',
  },
  {
    name: 'Nikitha',
    category: 'Nutrition Sessions',
    quote: 'Mam is clarifying doubts very clearly with patience. By attending all the sessions conducted by mam, many fears and doubts were cleared. Thank you Mam for sharing such useful nutritional tips.',
  },
  {
    name: 'Yashashwini',
    category: 'Weight Loss Journey',
    quote: 'It was a wonderful journey with you Deepthi. I have tried many methods for weight loss, but when I followed your diet I saw tremendous results. I used to have irregular periods, but within 20 days I could see results. My periods became regular. Weight loss and inch loss were visible to everyone within a month and I started feeling very light. Thank you very much.',
  },
  {
    name: 'Nikhila',
    category: 'Microgreens & Yoga',
    quote: 'Hi Deepthi, glad to know that you are moving forward with something new. I learned many new things such as how to grow seeds, how to check growth, when to harvest. I am continuing my small kitchen garden. You taught many variations, discipline and meditation. Now I am regularly doing yoga on my own and walking which keeps me in good health and happiness. Thank you very much for your efforts.',
  },
];

function Testimonials() {
  // Duplicate for seamless infinite loop
  const items = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="testimonials" id="testimonials">
      <div className="section-inner">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>Real Stories</p>
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          Words from Our Community
        </h2>
        <p className="testimonials__sub">
          Real voices from women and families who experienced our care first-hand.
        </p>
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
          Call us today and one of our care coordinators will guide you through booking
          your first consultation.
        </p>
        <div className="cta-banner__actions">
          <a href="tel:+000000000" className="btn btn--white">Call to Book</a>
          <a href="#contact" className="btn btn--outline-white">Get in Touch</a>
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ────────────────────────────────────────── */
function Contact() {
  return (
    <section className="contact" id="contact">
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

/* ─── Footer ─────────────────────────────────────────── */
function Footer() {
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
            <li><a href="#about">About Us</a></li>
            <li><a href="#mission">Our Mission</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer__links">
          <h5>Services</h5>
          <ul>
            <li><a href="#book">Book Consultation</a></li>
            <li><a href="#services">Diet Plans</a></li>
            <li><a href="#services">Autoimmune Support</a></li>
            <li><a href="#services">Health Records</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} ForHerWellbeing. All rights reserved.</p>
        <p>Built with care for women's health.</p>
      </div>
    </footer>
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
      <About />
      <Mission />
      <Services />
      <Testimonials />
      <CTABanner />
      <Contact />
      <Footer />
    </>
  );
}
