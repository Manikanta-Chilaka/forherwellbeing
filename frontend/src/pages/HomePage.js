import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Scale, Heart, Shield, Sun, Brain,
  Award, GraduationCap, Users, Clock,
  Calendar, ClipboardCheck, UserCheck, Sparkles,
  ArrowRight, BookOpen, Lock, Star, MapPin,
} from 'lucide-react';
import LeadMagnetModal from '../components/LeadMagnetModal';
import doctorPhoto from '../assets/WhatsApp Image 2026-04-15 at 12.31.31.jpeg';
import Footer from '../components/Footer';
import './HomePage.css';

/* ─── Data ───────────────────────────────────────────────── */
const CREDENTIALS = [
  { Icon: GraduationCap, label: 'Certified Nutritionist & Dietitian' },
  { Icon: Award,         label: "Women's Health Specialist" },
  { Icon: Heart,         label: 'Yoga & Wellness Guide' },
  { Icon: Users,         label: 'Pregnancy & Postnatal Care' },
  { Icon: Clock,         label: '5+ Years Clinical Experience' },
];

const SERVICES = [
  {
    Icon: Activity,
    bg: 'oklch(92% 0.07 10)',
    color: 'var(--rose-deep)',
    category: 'Hormonal Health',
    headline: 'Balance Your Hormones, Reclaim Your Life',
    desc: 'Targeted nutrition and lifestyle protocols for PCOS, thyroid disorders, irregular periods, and hormonal imbalances.',
  },
  {
    Icon: Scale,
    bg: 'oklch(92% 0.07 155)',
    color: 'var(--sage-deep)',
    category: 'Weight Management',
    headline: 'Achieve Your Ideal Weight — Sustainably',
    desc: 'Personalised diet plans that help you lose or maintain weight without deprivation, fad diets, or guesswork.',
  },
  {
    Icon: Heart,
    bg: 'oklch(92% 0.08 350)',
    color: 'var(--rose-deep)',
    category: 'Pregnancy & Postnatal',
    headline: 'Thrive at Every Stage of Motherhood',
    desc: 'Expert antenatal nutrition, postnatal recovery guidance, and emotional support from conception to beyond.',
  },
  {
    Icon: Shield,
    bg: 'oklch(92% 0.06 290)',
    color: 'oklch(55% 0.12 290)',
    category: 'Autoimmune & Chronic',
    headline: 'Heal Autoimmune Conditions From Within',
    desc: 'Evidence-based dietary strategies for endometriosis, autoimmune conditions, IBS, and chronic inflammation.',
  },
  {
    Icon: Sun,
    bg: 'oklch(92% 0.07 50)',
    color: 'oklch(55% 0.13 50)',
    category: 'Energy & Vitality',
    headline: 'Restore Your Energy & Mental Clarity',
    desc: 'Nutrition and lifestyle adjustments to overcome chronic fatigue, brain fog, and poor sleep quality.',
  },
  {
    Icon: Brain,
    bg: 'oklch(92% 0.07 200)',
    color: 'oklch(52% 0.11 200)',
    category: 'Emotional Wellbeing',
    headline: 'Build Resilience & Find Your Calm',
    desc: 'Yoga, meditation, and stress-reduction practices woven into your wellness plan for lasting emotional balance.',
  },
];

const TRUST_POINTS = [
  {
    Icon: Award,
    bg: 'oklch(92% 0.07 10)',
    title: 'Expert-Backed Nutrition',
    desc: 'Every diet plan is crafted by Dr. Ragadeepthi — a qualified nutritionist and dietitian with 5+ years of clinical women\'s health experience.',
  },
  {
    Icon: Lock,
    bg: 'oklch(92% 0.07 155)',
    title: 'Private & Confidential',
    desc: 'Your health information is handled with the utmost care. All consultations and records are completely private.',
  },
  {
    Icon: UserCheck,
    bg: 'oklch(92% 0.07 290)',
    title: 'Truly Personalised',
    desc: 'No generic diet charts. Every plan is built around your specific lab results, lifestyle, condition, and goals.',
  },
  {
    Icon: BookOpen,
    bg: 'oklch(92% 0.07 50)',
    title: 'Evidence-Based Only',
    desc: 'Guidance grounded in peer-reviewed research and current clinical best practices — not trends or fads.',
  },
];

const TRUST_BADGES = [
  { Icon: GraduationCap, bg: 'oklch(90% 0.07 10)',  title: 'Certified Nutritionist',      sub: 'Qualified & licensed dietitian' },
  { Icon: Star,          bg: 'oklch(90% 0.07 50)',  title: '100+ Women Transformed',      sub: 'Across PCOS, thyroid & more' },
  { Icon: Heart,         bg: 'oklch(90% 0.07 350)', title: 'Yoga & Wellness Certified',   sub: 'Integrated mind-body approach' },
  { Icon: MapPin,        bg: 'oklch(90% 0.07 155)', title: 'Serving Across Telangana',    sub: 'In-person & online consultations' },
];

const TESTIMONIALS = [
  { name: 'Rajyalaxmi',         category: 'Yoga & Meditation',      quote: 'Guided meditations should be taken seriously. It is a gift that you have. Use it and help us help ourselves.' },
  { name: 'Nandini',            category: 'Postpartum Weight Loss', quote: 'I was able to lose 7 kg in a healthy and sustainable way after having my baby. Your customized meal plan made such a difference — not just in weight loss, but in how I feel overall. I never felt like I was on a diet. You\'ve helped me regain my confidence.' },
  { name: 'Yashashwini',        category: 'Weight Loss Journey',    quote: 'I have tried many methods for weight loss, but when I followed your diet I saw tremendous results. My periods became regular within 20 days. Weight loss and inch loss were visible to everyone within a month.' },
  { name: 'Sowmya',             category: 'Pregnancy Sessions',     quote: 'I have been attending classes from the beginning of my pregnancy. All these sessions are very helpful and supportive mentally and emotionally. Thanks a lot Dr. Manasa mam and Dr. Deepthi mam.' },
  { name: 'Lakshmi Prasanna',   category: 'Program Feedback',       quote: 'Please plan more programs and continue these types of sessions in the coming days.' },
  { name: 'Shravanthi',         category: 'Child Yoga Training',    quote: 'I have seen a lot of difference in her body flexibility and emotional control through meditation. Her hormonal balance and healthy habits have been achieved with your extensive knowledge.' },
  { name: 'Nagalaxmi',          category: 'Pregnancy Education',    quote: 'Thank you for the wonderful session! It was incredibly informative and reassuring. All pregnancy-related topics were clearly explained and every doubt was patiently addressed.' },
  { name: 'Nikitha',            category: 'Nutrition Sessions',     quote: 'Mam is clarifying doubts very clearly with patience. By attending all the sessions, many fears and doubts were cleared. Thank you for sharing such useful nutritional tips.' },
  { name: 'Sreerama Divyasree', category: 'Yoga Program',           quote: 'This is a great initiative and need of the hour. This is not just a commercial program, it has the potential to transform one\'s life. I wish it to touch many lives in ways beyond this physical world.' },
  { name: 'Nikhila',            category: 'Microgreens & Yoga',     quote: 'I learned many new things — how to grow seeds, how to check growth, when to harvest. You taught many yoga variations, discipline and meditation. Now I do yoga regularly which keeps me healthy and happy.' },
];

const HOW_STEPS = [
  { num: '01', Icon: Calendar,      title: 'Book a Consultation',          desc: 'Reach out through our contact page or call us directly to express your interest.' },
  { num: '02', Icon: ClipboardCheck,title: 'Our Staff Will Contact You',   desc: 'Our care coordinator will call you, understand your needs, and confirm your appointment slot.' },
  { num: '03', Icon: UserCheck,     title: 'Meet Your Specialist',         desc: 'Have a one-on-one session with Dr. Ragadeepthi to discuss your health history, concerns, and goals.' },
  { num: '04', Icon: Sparkles,      title: 'Receive Your Personalised Plan',desc: 'Get a custom nutrition and wellness plan built around your condition, lifestyle, and goals.' },
];

const STEP_COLORS = [
  { bg: 'oklch(92% 0.07 10)',  color: 'var(--rose-deep)' },
  { bg: 'oklch(88% 0.06 290)', color: 'oklch(55% 0.12 290)' },
  { bg: 'oklch(88% 0.07 155)', color: 'var(--sage-deep)' },
  { bg: 'oklch(90% 0.07 50)',  color: 'oklch(55% 0.13 50)' },
];

const RESOURCES = [
  {
    id: 'meal-guide',
    Icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 6h18M3 12h18M3 18h18"/><circle cx="6" cy="6" r="1" fill="currentColor"/>
        <circle cx="6" cy="12" r="1" fill="currentColor"/><circle cx="6" cy="18" r="1" fill="currentColor"/>
      </svg>
    ),
    bg: 'oklch(90% 0.06 155)',
    colorClass: 'hp-res-card--sage',
    title: '7-Day Hormone-Balancing Meal Guide',
    desc: 'A done-for-you weekly meal plan designed to reduce inflammation and support hormonal balance — with shopping list included.',
    tag: 'Meal Plan',
  },
  {
    id: 'hormone-checklist',
    Icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="3"/>
      </svg>
    ),
    bg: 'oklch(90% 0.06 200)',
    colorClass: 'hp-res-card--teal',
    title: 'Hormone Health Symptom Checklist',
    desc: 'A self-assessment tool to identify signs of hormonal imbalance — including PCOS, thyroid, and oestrogen dominance — before your consultation.',
    tag: 'Self-Assessment',
  },
  {
    id: 'grocery-list',
    Icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
    bg: 'oklch(92% 0.07 50)',
    colorClass: 'hp-res-card--warm',
    title: 'The Healthy Grocery List for Women',
    desc: 'A nutritionist-curated shopping list of anti-inflammatory, hormone-supportive foods — organised by category for your next supermarket visit.',
    tag: 'Grocery Guide',
  },
];

const ARTICLES = [
  {
    category: 'Hormonal Health', color: 'hp-ihub-card--sage',
    title: 'The Gut-Hormone Connection: How Your Microbiome Shapes Your Cycle',
    excerpt: 'Emerging research reveals that your gut microbes directly influence oestrogen metabolism, mood, and menstrual health.',
    readTime: '5 min',
  },
  {
    category: 'PCOS & Metabolism', color: 'hp-ihub-card--teal',
    title: 'Nutritional Science of PCOS: What the Research Actually Shows',
    excerpt: 'A deep dive into insulin resistance, androgen pathways, and dietary interventions backed by clinical trials.',
    readTime: '7 min',
  },
  {
    category: 'Mind & Body', color: 'hp-ihub-card--warm',
    title: 'The Neuroscience of Meditation: How Stillness Rewires the Stressed Brain',
    excerpt: 'Studies confirm that eight weeks of consistent practice measurably reduces cortisol and strengthens prefrontal regulation.',
    readTime: '4 min',
  },
];

/* ─── Star SVG ───────────────────────────────────────────── */
function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

/* ─── Hero ───────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hp-hero" id="home">
      <div className="hp-hero-blob1" />
      <div className="hp-hero-blob2" />

      <div className="hp-hero-content">
        <div className="hp-hero-eyebrow">
          <span className="hp-hero-dot" />
          Women's Health — Redefined
        </div>
        <h1>
          Your health,<br />
          <em>finally understood.</em>
        </h1>
        <p className="hp-hero-sub">
          Personalised consultations, science-backed nutrition plans, and
          compassionate care — designed exclusively for women, by a specialist
          who truly understands.
        </p>
        <div className="hp-hero-actions">
          <Link to="/contact" className="hp-btn-primary">Get My Personalised Diet Plan</Link>
          <Link to="/health-assessment" className="hp-btn-secondary">Start Free Health Assessment</Link>
        </div>
        <p className="hp-hero-helper">
          Takes 2 minutes &bull; Personalised for your body &bull; Trusted by 100+ women
        </p>
        <div className="hp-hero-stats">
          <div>
            <div className="hp-stat-num">100+</div>
            <div className="hp-stat-label">Women Supported</div>
          </div>
          <div className="hp-stat-divider" />
          <div>
            <div className="hp-stat-num">5+</div>
            <div className="hp-stat-label">Years Experience</div>
          </div>
          <div className="hp-stat-divider" />
          <div>
            <div className="hp-stat-num">100%</div>
            <div className="hp-stat-label">Focused on Women</div>
          </div>
        </div>
      </div>

      <div className="hp-hero-visual">
        <div className="hp-photo-ring">
          <div className="hp-photo-inner">
            <img src={doctorPhoto} alt="Dr. Ragadeepthi Ediga" />
          </div>
        </div>
        <div className="hp-photo-badge">
          <span className="hp-photo-badge-name">Dr. Ragadeepthi Ediga</span>
          <span className="hp-photo-badge-title">Women's Health &amp; Nutrition Specialist</span>
        </div>
      </div>
    </section>
  );
}

/* ─── Authority Bar ──────────────────────────────────────── */
function AuthorityBar() {
  return (
    <section className="hp-authority">
      <div className="hp-authority-inner">
        {CREDENTIALS.map(({ Icon, label }, i) => (
          <>
            <div className="hp-authority-item" key={label}>
              <span className="hp-authority-icon"><Icon size={16} strokeWidth={1.75} /></span>
              {label}
            </div>
            {i < CREDENTIALS.length - 1 && <span className="hp-authority-sep" key={`sep-${i}`} />}
          </>
        ))}
      </div>
    </section>
  );
}

/* ─── Services ───────────────────────────────────────────── */
function Services() {
  return (
    <section className="hp-section hp-services" id="services">
      <div className="hp-section-header">
        <p className="hp-section-tag">What We Treat</p>
        <h2 className="hp-section-title">Complete Care for<br /><em>Every Part of You</em></h2>
        <p className="hp-section-sub">
          We focus on outcomes — not just appointments. Every plan is built around
          what you want to feel, not just what you want to fix.
        </p>
      </div>
      <div className="hp-services-grid">
        {SERVICES.map(({ Icon, bg, color, category, headline, desc }) => (
          <div className="hp-service-card" key={headline}>
            <div className="hp-service-icon" style={{ background: bg }}>
              <Icon size={22} strokeWidth={1.5} style={{ color }} />
            </div>
            <p className="hp-service-category">{category}</p>
            <h3>{headline}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>
      <div className="hp-services-cta">
        <Link to="/services" className="hp-sp-link">
          View All Services <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

/* ─── Trust ──────────────────────────────────────────────── */
function Trust() {
  return (
    <section className="hp-section hp-trust" id="trust">
      <div className="hp-trust-grid">
        <div>
          <p className="hp-section-tag">Why Trust Us</p>
          <h2 className="hp-section-title" style={{ marginBottom: 40 }}>
            Built on Science,<br /><em>Rooted in Care</em>
          </h2>
          <div className="hp-trust-points">
            {TRUST_POINTS.map(({ Icon, bg, title, desc }) => (
              <div className="hp-trust-point" key={title}>
                <div className="hp-trust-point-icon" style={{ background: bg }}>
                  <Icon size={20} strokeWidth={1.75} style={{ color: 'var(--rose-deep)' }} />
                </div>
                <div>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hp-trust-visual">
          <p className="hp-section-tag" style={{ marginBottom: 24 }}>Credentials</p>
          <div className="hp-trust-badges">
            {TRUST_BADGES.map(({ Icon, bg, title, sub }) => (
              <div className="hp-trust-badge" key={title}>
                <div className="hp-trust-badge-icon" style={{ background: bg }}>
                  <Icon size={20} strokeWidth={1.75} style={{ color: 'var(--rose-deep)' }} />
                </div>
                <div>
                  <h4>{title}</h4>
                  <p>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────── */
function Testimonials() {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <section className="hp-testimonials" id="testimonials">
      <div className="hp-testimonials-head">
        <p className="hp-section-tag">Patient Stories</p>
        <h2 className="hp-section-title">Trusted by Women Across Every Journey</h2>
        <p className="hp-testimonials-sub">
          Real voices from women who experienced transformation through our care.
        </p>
      </div>
      <div className="hp-tslider-viewport">
        <div className="hp-tslider-track">
          {doubled.map(({ name, category, quote }, i) => (
            <div className="hp-tcard" key={i}>
              <div className="hp-tcard-stars">
                {[1,2,3,4,5].map(n => <StarIcon key={n} />)}
              </div>
              <div className="hp-tcard-quote">"</div>
              <p className="hp-tcard-text">{quote}</p>
              <div className="hp-tcard-footer">
                <div className="hp-tcard-avatar">{name.charAt(0)}</div>
                <div>
                  <p className="hp-tcard-name">{name}</p>
                  <p className="hp-tcard-category">{category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ───────────────────────────────────────── */
function HowItWorks() {
  return (
    <section className="hp-section hp-hiw" id="how-it-works">
      <div className="hp-section-header">
        <p className="hp-section-tag">Simple Process</p>
        <h2 className="hp-section-title">How It Works</h2>
        <p className="hp-section-sub">Four steps to expert, personalised care — getting started is straightforward.</p>
      </div>
      <div className="hp-steps">
        {HOW_STEPS.map(({ num, Icon, title, desc }, i) => (
          <div className="hp-step" key={num}>
            <div className="hp-step-num" style={{ background: STEP_COLORS[i].bg, color: STEP_COLORS[i].color }}>
              {num}
            </div>
            <div className="hp-step-icon">
              <Icon size={28} strokeWidth={1.5} />
            </div>
            <h4>{title}</h4>
            <p>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Free Resources ─────────────────────────────────────── */
function FreeResources() {
  const [active, setActive] = useState(null);
  return (
    <section className="hp-section hp-resources">
      {active && <LeadMagnetModal resource={active} onClose={() => setActive(null)} />}
      <div className="hp-section-header">
        <p className="hp-section-tag">Free for You</p>
        <h2 className="hp-section-title">
          Start Your Journey<br /><em>Before Your First Consultation</em>
        </h2>
        <p className="hp-section-sub">
          Download these free guides — created by Dr. Ragadeepthi — and take
          your first steps toward better health today.
        </p>
      </div>
      <div className="hp-resources-grid">
        {RESOURCES.map(res => (
          <div className={`hp-res-card ${res.colorClass}`} key={res.id}>
            <div className="hp-res-icon" style={{ background: res.bg }}>
              <res.Icon />
            </div>
            <p className="hp-res-tag">{res.tag}</p>
            <h3>{res.title}</h3>
            <p>{res.desc}</p>
            <button className="hp-res-btn" onClick={() => setActive(res)}>
              Get Free Guide
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Insights Hub ───────────────────────────────────────── */
function InsightsHub() {
  return (
    <section className="hp-section hp-insights">
      <div className="hp-section-inner">
        <div className="hp-insights-head">
          <div>
            <p className="hp-section-tag">The Knowledge Hub</p>
            <h2 className="hp-section-title">Science Decoded<br /><em>for Real Women</em></h2>
            <p className="hp-section-sub" style={{ marginTop: 12 }}>
              Evidence-based insights that help you understand your body — clearly,
              honestly, without the medical jargon.
            </p>
          </div>
          <Link to="/insights" className="hp-sp-link" style={{ flexShrink: 0 }}>
            Explore All Articles <ArrowRight size={16} />
          </Link>
        </div>
        <div className="hp-insights-grid">
          {ARTICLES.map(({ category, color, title, excerpt, readTime }) => (
            <article className={`hp-ihub-card ${color}`} key={title}>
              <span className="hp-ihub-cat">{category}</span>
              <h3>{title}</h3>
              <p>{excerpt}</p>
              <Link to="/insights" className="hp-ihub-read">
                <BookOpen size={14} /> {readTime} read
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Banner ─────────────────────────────────────────── */
function CTABanner() {
  return (
    <section className="hp-cta" id="book">
      <div className="hp-cta-blob" style={{ width: 400, height: 400, top: -100, right: -100 }} />
      <div className="hp-cta-blob" style={{ width: 300, height: 300, bottom: -80, left: '10%' }} />
      <blockquote>
        "I have tried many methods for weight loss, but when I followed your diet I saw tremendous
        results. My periods became regular within 20 days."
        <cite>— Yashashwini</cite>
      </blockquote>
      <h2>Ready to Start Your <em>Wellness Journey?</em></h2>
      <p className="hp-cta-sub">
        Join over 100 women who have transformed their health with personalised,
        expert-led care. Your first step takes less than 2 minutes.
      </p>
      <div className="hp-cta-actions">
        <Link to="/contact" className="hp-btn-white">I Want Results Like This</Link>
        <Link to="/about"   className="hp-btn-outline-white">Meet Dr. Ragadeepthi</Link>
      </div>
      <p className="hp-cta-trust">
        Trusted by 100+ women &bull; No generic diet charts &bull; Science-backed approach
      </p>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  return (
    <>
      <Hero />
      <AuthorityBar />
      <Services />
      <Trust />
      <Testimonials />
      <HowItWorks />
      <FreeResources />
      <InsightsHub />
      <CTABanner />
      <Footer />
    </>
  );
}
