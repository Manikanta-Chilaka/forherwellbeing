import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import './HomePage.css';
import './InsightsPage.css';

const ARTICLES = [
  {
    category: 'Hormonal Health',
    categoryColor: 'sage',
    title: 'The Gut-Hormone Connection: How Your Microbiome Shapes Your Cycle',
    excerpt: 'Emerging research reveals that the trillions of microbes in your gut directly influence oestrogen metabolism, mood regulation, and menstrual health — and how targeted nutrition can restore that balance.',
    readTime: '5 min',
    date: 'Jun 2025',
  },
  {
    category: 'PCOS & Metabolism',
    categoryColor: 'teal',
    title: 'Nutritional Science of PCOS: What the Research Actually Shows',
    excerpt: 'Beyond generic advice — a deep dive into insulin resistance, androgen pathways, and the specific dietary interventions backed by clinical trials for women with polycystic ovary syndrome.',
    readTime: '7 min',
    date: 'May 2025',
  },
  {
    category: 'Mind & Body',
    categoryColor: 'warm',
    title: 'The Neuroscience of Meditation: How Stillness Rewires the Stressed Brain',
    excerpt: 'Neuroscientific studies confirm that consistent meditation practice measurably reduces cortisol, shrinks the amygdala, and strengthens prefrontal regulation — with measurable results in as little as eight weeks.',
    readTime: '4 min',
    date: 'May 2025',
  },
  {
    category: 'Nutrition Science',
    categoryColor: 'sage',
    title: 'Iron, Fatigue and Women: The Deficiency Nobody Talks About',
    excerpt: 'Iron-deficiency anaemia affects 1 in 3 women of reproductive age, yet symptoms are routinely dismissed. Here is what optimal iron levels actually feel like — and which foods make the biggest difference.',
    readTime: '6 min',
    date: 'Apr 2025',
  },
  {
    category: 'Pregnancy & Postnatal',
    categoryColor: 'teal',
    title: 'Postpartum Nutrition: An Evidence-Based Guide to Recovery',
    excerpt: 'The fourth trimester places enormous nutritional demands on the body. This guide covers the specific micronutrients critical for recovery, milk production, and protecting maternal mental health.',
    readTime: '8 min',
    date: 'Apr 2025',
  },
  {
    category: 'Autoimmune',
    categoryColor: 'warm',
    title: 'The Anti-Inflammatory Diet: What Science Says About Food and Autoimmunity',
    excerpt: 'Chronic inflammation underpins most autoimmune conditions. A review of the clinical evidence for dietary interventions in lupus, rheumatoid arthritis, endometriosis, and IBD.',
    readTime: '6 min',
    date: 'Mar 2025',
  },
];

const CATEGORIES = ['All', 'Hormonal Health', 'PCOS & Metabolism', 'Mind & Body', 'Nutrition Science', 'Pregnancy & Postnatal', 'Autoimmune'];

export default function InsightsPage() {
  const [active, setActive] = useState('All');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filtered = active === 'All' ? ARTICLES : ARTICLES.filter(a => a.category === active);

  return (
    <>
      <section className="insights-hero page-section-top">
        <div className="section-inner insights-hero__inner">
          <p className="section-eyebrow">The Knowledge Hub</p>
          <h1 className="insights-hero__title">Science Decoded<br />for Real Women</h1>
          <p className="insights-hero__sub">
            Evidence-based insights that help you understand your body — clearly, honestly, without the medical jargon.
          </p>
        </div>
      </section>

      <section className="insights-main">
        <div className="section-inner">
          <div className="insights-cats">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`insights-cat${active === cat ? ' insights-cat--active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="insights-grid">
            {filtered.map(({ category, categoryColor, title, excerpt, readTime, date }) => (
              <article className={`insight-card insight-card--${categoryColor}`} key={title}>
                <div className="insight-card__top">
                  <span className="insight-card__cat">{category}</span>
                  <span className="insight-card__meta">
                    <Clock size={12} strokeWidth={2} /> {readTime} &nbsp;·&nbsp; {date}
                  </span>
                </div>
                <h3 className="insight-card__title">{title}</h3>
                <p className="insight-card__excerpt">{excerpt}</p>
                <Link to="/contact" className="insight-card__read">
                  Read Article <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
