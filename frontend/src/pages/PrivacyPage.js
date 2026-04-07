import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Database, Eye, FileText, ShieldCheck } from 'lucide-react';
import Footer from '../components/Footer';
import './HomePage.css';
import './PrivacyPage.css';


const SECTIONS = [
  {
    Icon: Database,
    id: 'collect',
    heading: 'What Data We Collect',
    content: (
      <>
        <p>When you use our website or booking form, we may collect the following information:</p>
        <ul>
          <li><strong>Contact information</strong> — your name, phone number, and email address</li>
          <li><strong>Health information</strong> — details you share in assessments, such as your health goals, existing conditions, or symptoms</li>
          <li><strong>Lifestyle information</strong> — dietary preferences, activity levels, and other context you provide to help us personalise your nutrition plan</li>
        </ul>
        <p>We only collect what is necessary to provide our services. We never ask for more than we need.</p>
      </>
    ),
  },
  {
    Icon: Eye,
    id: 'why',
    heading: 'Why We Collect This Data',
    content: (
      <>
        <p>We collect your information specifically to:</p>
        <ul>
          <li>Provide personalised diet and nutrition plans tailored to your health goals</li>
          <li>Allow our care coordinator to contact you and confirm your appointment</li>
          <li>Enable Dr. Ragadeepthi to understand your health history before your consultation</li>
          <li>Send relevant wellness guidance when you have opted in to receive it</li>
          <li>Improve the quality and relevance of our services over time</li>
        </ul>
        <p>Your data is never collected for advertising, profiling, or any purpose outside your direct care.</p>
      </>
    ),
  },
  {
    Icon: FileText,
    id: 'use',
    heading: 'How We Use Your Data',
    content: (
      <>
        <p>The information you provide is used to:</p>
        <ul>
          <li>Generate personalised diet plans and nutrition recommendations</li>
          <li>Respond to your enquiries and booking requests promptly</li>
          <li>Maintain your health records for continuity of care across consultations</li>
          <li>Send you relevant health information, where you have given consent</li>
          <li>Improve our wellness programmes based on aggregated, anonymised feedback</li>
        </ul>
        <p>We do not use your data for automated decision-making or profiling without your knowledge.</p>
      </>
    ),
  },
  {
    Icon: Lock,
    id: 'store',
    heading: 'How We Protect Your Data',
    content: (
      <>
        <p>We take data security seriously. Your information is:</p>
        <ul>
          <li><strong>Stored securely</strong> — on encrypted, access-controlled systems</li>
          <li><strong>Access-restricted</strong> — only authorised members of the For Her Wellbeing care team can view your records</li>
          <li><strong>Never sold</strong> — we do not sell, rent, or trade your personal or health information to any third party</li>
          <li><strong>Not shared</strong> — your data is not shared with advertisers, data brokers, or unrelated third parties</li>
        </ul>
        <p>In the unlikely event of a data breach, we will notify affected users promptly and take immediate steps to mitigate any harm.</p>
      </>
    ),
  },
  {
    Icon: ShieldCheck,
    id: 'rights',
    heading: 'Your Rights',
    content: (
      <>
        <p>You have the right to:</p>
        <ul>
          <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
          <li><strong>Correction</strong> — ask us to update any inaccurate information</li>
          <li><strong>Deletion</strong> — request that we delete your data at any time</li>
          <li><strong>Withdraw consent</strong> — opt out of communications or data processing at any point</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:hello@forherwellbeing.com">hello@forherwellbeing.com</a>. We will respond within 7 working days.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <section className="privacy-hero page-section-top">
        <div className="section-inner privacy-hero__inner">
          <p className="section-eyebrow">Legal</p>
          <h1 className="privacy-hero__title">Privacy Policy</h1>
          <p className="privacy-hero__meta">Last updated: April 2026 &nbsp;&bull;&nbsp; For Her Wellbeing</p>
          <p className="privacy-hero__intro">
            Your privacy matters to us. This policy explains clearly and honestly what data we collect,
            why we collect it, and how we protect it. We believe you deserve to know exactly how your
            health information is handled.
          </p>
        </div>
      </section>

      <section className="privacy-body">
        <div className="section-inner privacy-body__inner">

          <nav className="privacy-toc">
            <p className="privacy-toc__label">Jump to section</p>
            <ul>
              {SECTIONS.map(({ id, heading }) => (
                <li key={id}><a href={`#${id}`}>{heading}</a></li>
              ))}
            </ul>
          </nav>

          <div className="privacy-content">
            {SECTIONS.map(({ Icon, id, heading, content }) => (
              <div className="privacy-section" id={id} key={id}>
                <div className="privacy-section__icon">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <div className="privacy-section__body">
                  <h2 className="privacy-section__heading">{heading}</h2>
                  <div className="privacy-section__text">{content}</div>
                </div>
              </div>
            ))}

            <div className="privacy-contact-box">
              <h3>Questions about this policy?</h3>
              <p>
                If anything is unclear or you'd like to know more about how we handle your data,
                please get in touch. We're happy to explain.
              </p>
              <Link to="/contact" className="btn btn--primary">Contact Us</Link>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
