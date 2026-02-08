import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Mission – NaturGeist',
  description: 'Environmental sustainability, sustainable livelihoods, gender equity, and mental health at NaturGeist.',
};

const MISSION_SECTIONS = [
  {
    title: 'Environmental Sustainability',
    text: 'Promoting climate awareness, ecological care, conservation, and responsible use of natural resources through education, research, advocacy, and community-based action.',
  },
  {
    title: 'Sustainable Livelihoods',
    text: 'Strengthening livelihoods, especially for women, migrants, informal workers, and marginalised communities through skills development, capacity building, and locally rooted income opportunities.',
  },
  {
    title: 'Gender Equity & Social Inclusion',
    text: 'Amplifying voices, addressing structural inequalities, and enabling meaningful participation of women and marginalised genders in social and economic spaces.',
  },
  {
    title: 'Mental Health & Psychosocial Well-Being',
    text: 'Supporting emotional resilience and psychosocial well-being through awareness programmes, community outreach, training, research, and culturally grounded approaches to care.',
  },
] as const;

export default function OurMissionPage() {
  return (
    <main className="page-content our-mission-page">
      <section className="our-mission-section">
        <div className="our-mission-wrap">
          <h1 className="our-mission-title">OUR MISSION</h1>
          {MISSION_SECTIONS.map((section) => (
            <div key={section.title} className="our-mission-block">
              <h2 className="our-mission-heading">{section.title}</h2>
              <p className="our-mission-text">{section.text}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="compact-footer our-mission-footer">
        <p className="compact-footer-copy">
          © {new Date().getFullYear()} NaturGeist · <Link href="/causes">Causes</Link> · <Link href="/impact">Impact</Link> · <Link href="/contact">Contact</Link>
        </p>
      </footer>
    </main>
  );
}
