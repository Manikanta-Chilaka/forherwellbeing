import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award, GraduationCap, Heart, Users, Clock,
  Activity, Scale, Shield, Sun, Brain,
  Calendar, ClipboardCheck, UserCheck, Sparkles,
  ArrowRight, BookOpen
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
          Empowering Women Through<br />
          <em>Expert Nutrition &</em><br />
          Holistic Wellness
        </h1>
        <p className="hero__subtitle">
          Personalised consultations, science-backed nutrition plans, and
          compassionate care — designed exclusively for women, by a specialist
          who truly understands.
        </p>
        <div className="hero__actions">
          <Link to="/contact" className="btn btn--primary">Get My Personalized Diet Plan</Link>
          <Link to="/contact" className="btn btn--ghost">Take Free Health Assessment</Link>
        </div>
        <p className="hero__helper">
          Answer a few questions and get your science-based nutrition direction.
        </p>

        <div className="hero__stats">
          <div className="stat">
            <span className="stat__num">100+</span>
            <span className="stat__label">Women Supported</span>
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

/* ─── Authority Bar ──────────────────────────────────── */
const CREDENTIALS = [
  { Icon: GraduationCap, label: 'Certified Nutritionist & Dietitian' },
  { Icon: Award,         label: "Women's Health Specialist" },
  { Icon: Heart,         label: 'Yoga & Wellness Guide' },
  { Icon: Users,         label: 'Pregnancy & Postnatal Care' },
  { Icon: Clock,         label: '5+ Years Clinical Experience' },
];

function AuthorityBar() {
  return (
    <section className="authority">
      <div className="authority__inner">
        {CREDENTIALS.map(({ Icon, label }) => (
          <div className="authority__item" key={label}>
            <span className="authority__icon"><Icon size={18} strokeWidth={1.75} /></span>
            <span className="authority__label">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Outcome-Driven Services ────────────────────────── */
const OUTCOMES = [
  {
    Icon: Activity,
    category: 'Hormonal Health',
    headline: 'Balance Your Hormones, Reclaim Your Life',
    desc: 'Targeted nutrition and lifestyle protocols for PCOS, thyroid disorders, irregular periods, and hormonal imbalances.',
  },
  {
    Icon: Scale,
    category: 'Weight Management',
    headline: 'Achieve Your Ideal Weight — Sustainably',
    desc: 'Personalised diet plans that help you lose or maintain weight without deprivation, fad diets, or guesswork.',
  },
  {
    Icon: Heart,
    category: 'Pregnancy & Postnatal',
    headline: 'Thrive at Every Stage of Motherhood',
    desc: 'Expert antenatal nutrition, postnatal recovery guidance, and emotional support from conception to beyond.',
  },
  {
    Icon: Shield,
    category: 'Autoimmune & Chronic',
    headline: 'Heal Autoimmune Conditions From Within',
    desc: 'Evidence-based dietary strategies for lupus, rheumatoid arthritis, endometriosis, IBD, and more.',
  },
  {
    Icon: Sun,
    category: 'Energy & Vitality',
    headline: 'Restore Your Energy & Mental Clarity',
    desc: 'Nutrition and lifestyle adjustments to overcome chronic fatigue, brain fog, and poor sleep quality.',
  },
  {
    Icon: Brain,
    category: 'Emotional Wellbeing',
    headline: 'Build Resilience & Find Your Calm',
    desc: 'Yoga, meditation, and stress-reduction practices woven into your wellness plan for lasting emotional balance.',
  },
];

function OutcomeServices() {
  return (
    <section className="outcomes">
      <div className="section-inner">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>What We Treat</p>
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          Real Results for Real Women
        </h2>
        <p className="outcomes__sub">
          We focus on outcomes — not just appointments. Every plan is built around
          what you want to feel, not just what you want to fix.
        </p>

        <div className="outcomes__grid">
          {OUTCOMES.map(({ Icon, category, headline, desc }) => (
            <div className="outcome-card" key={headline}>
              <div className="outcome-card__top">
                <div className="outcome-card__icon">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <span className="outcome-card__category">{category}</span>
              </div>
              <h4 className="outcome-card__headline">{headline}</h4>
              <p className="outcome-card__desc">{desc}</p>
            </div>
          ))}
        </div>

        <div className="outcomes__cta">
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
  { name: 'Rajyalaxmi',         category: 'Yoga & Meditation',      quote: 'Guided meditations should be taken seriously. It is a gift that you have. Use it and help us help ourselves.' },
  { name: 'Sreerama Divyasree', category: 'Yoga Program',           quote: "This is a great initiative and need of the hour. This is not just a commercial program, it has the potential to transform one's life. I wish Dr. Jagadeesh Gandla and Dr. Ragadeepthi Ediga to touch many lives in ways beyond this physical world. Feel thankful to be part of this journey." },
  { name: 'Lakshmi Prasanna',   category: 'Program Feedback',       quote: 'Please plan more programs and continue these types of sessions in the coming days.' },
  { name: 'Shravanthi',         category: 'Child Yoga Training',    quote: 'I have seen a lot of difference in her body flexibility and emotional control through meditation. Her hormonal balance and healthy habits have been achieved with your extensive knowledge. She is very lucky to have you as her guru.' },
  { name: 'Nandini',            category: 'Postpartum Weight Loss', quote: "I was able to lose 7 kg in a healthy and sustainable way after having my baby. Your customized meal plan made such a difference — not just in weight loss, but in how I feel overall. I never felt like I was on a diet. You've helped me regain my confidence." },
  { name: 'Sowmya',             category: 'Pregnancy Sessions',     quote: 'I have been attending classes from the beginning of my pregnancy. All these sessions are very helpful and supportive mentally and emotionally. Thanks a lot Dr. Manasa mam and Dr. Deepthi mam.' },
  { name: 'Nagalaxmi',          category: 'Pregnancy Education',    quote: 'Thank you for the wonderful session Mam! It was incredibly informative and reassuring. All pregnancy-related topics were clearly explained and every doubt was patiently addressed.' },
  { name: 'Nikitha',            category: 'Nutrition Sessions',     quote: 'Mam is clarifying doubts very clearly with patience. By attending all the sessions, many fears and doubts were cleared. Thank you Mam for sharing such useful nutritional tips.' },
  { name: 'Yashashwini',        category: 'Weight Loss Journey',    quote: 'I have tried many methods for weight loss, but when I followed your diet I saw tremendous results. My periods became regular within 20 days. Weight loss and inch loss were visible to everyone within a month.' },
  { name: 'Nikhila',            category: 'Microgreens & Yoga',     quote: 'I learned many new things — how to grow seeds, how to check growth, when to harvest. You taught many yoga variations, discipline and meditation. Now I am regularly doing yoga on my own which keeps me healthy and happy.' },
];

function Stars() {
  return (
    <div className="tcard__stars">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

function Testimonials() {
  const items = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <section className="testimonials" id="testimonials">
      <div className="section-inner">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>Patient Stories</p>
        <h2 className="section-title" style={{ textAlign: 'center' }}>Trusted by Women Across Every Journey</h2>
        <p className="testimonials__sub">Real voices from women who experienced transformation through our care.</p>
      </div>
      <div className="tslider-viewport">
        <div className="tslider-track">
          {items.map(({ name, category, quote }, i) => (
            <div className="tcard" key={i}>
              <Stars />
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
        <p className="hiw__sub">Getting started is straightforward. Four steps to expert, personalised care.</p>

        <div className="hiw__steps">
          {HOW_STEPS.map(({ num, Icon, title, desc }) => (
            <div className="hiw-step" key={num}>
              <div className="hiw-step__top">
                <div className="hiw-step__num">{num}</div>
                <div className="hiw-step__icon-wrap">
                  <Icon size={26} strokeWidth={1.5} />
                </div>
              </div>
              <h4 className="hiw-step__title">{title}</h4>
              <p className="hiw-step__desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Insights Hub ───────────────────────────────────── */
const FEATURED_ARTICLES = [
  {
    category: 'Hormonal Health',
    color: 'sage',
    title: 'The Gut-Hormone Connection: How Your Microbiome Shapes Your Cycle',
    excerpt: 'Emerging research reveals that your gut microbes directly influence oestrogen metabolism, mood, and menstrual health.',
    readTime: '5 min',
  },
  {
    category: 'PCOS & Metabolism',
    color: 'teal',
    title: 'Nutritional Science of PCOS: What the Research Actually Shows',
    excerpt: 'A deep dive into insulin resistance, androgen pathways, and dietary interventions backed by clinical trials.',
    readTime: '7 min',
  },
  {
    category: 'Mind & Body',
    color: 'warm',
    title: 'The Neuroscience of Meditation: How Stillness Rewires the Stressed Brain',
    excerpt: 'Studies confirm that eight weeks of consistent practice measurably reduces cortisol and strengthens prefrontal regulation.',
    readTime: '4 min',
  },
];

function InsightsHub() {
  return (
    <section className="insights-hub">
      <div className="section-inner">
        <div className="insights-hub__head">
          <div>
            <p className="section-eyebrow">The Knowledge Hub</p>
            <h2 className="section-title">Science Decoded<br />for Real Women</h2>
            <p className="insights-hub__sub">
              Evidence-based insights that help you understand your body — clearly, honestly, without the medical jargon.
            </p>
          </div>
          <Link to="/insights" className="sp__link insights-hub__all">
            Explore All Articles <ArrowRight size={16} />
          </Link>
        </div>

        <div className="insights-hub__grid">
          {FEATURED_ARTICLES.map(({ category, color, title, excerpt, readTime }) => (
            <article className={`ihub-card ihub-card--${color}`} key={title}>
              <span className="ihub-card__cat">{category}</span>
              <h3 className="ihub-card__title">{title}</h3>
              <p className="ihub-card__excerpt">{excerpt}</p>
              <Link to="/insights" className="ihub-card__read">
                <BookOpen size={14} /> {readTime} read
              </Link>
            </article>
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
        <p className="cta-banner__quote">
          "I have tried many methods for weight loss, but when I followed your diet I saw
          tremendous results. My periods became regular within 20 days."
          <span className="cta-banner__quote-attr"> — Yashashwini</span>
        </p>
        <h2 className="cta-banner__title">Ready to Start Your Wellness Journey?</h2>
        <p className="cta-banner__sub">
          Join over 100 women who have transformed their health with personalised,
          expert-led care. Your first step takes less than 2 minutes.
        </p>
        <div className="cta-banner__actions">
          <Link to="/contact" className="btn btn--white">I Want Results Like This</Link>
          <Link to="/about" className="btn btn--outline-white">Meet Dr. Ragadeepthi</Link>
        </div>
        <p className="cta-banner__trust">Trusted by 100+ women &bull; No generic diet charts &bull; Science-backed approach</p>
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
      <AuthorityBar />
      <OutcomeServices />
      <Testimonials />
      <HowItWorks />
      <InsightsHub />
      <CTABanner />
      <Footer />
    </>
  );
}
