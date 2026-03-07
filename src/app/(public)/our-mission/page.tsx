import type { Metadata } from 'next';
import Image from 'next/image';


export const metadata: Metadata = {
  title: 'Our Mission – NaturGeist',
  description: 'Environmental sustainability, sustainable livelihoods, gender equity, and mental health at NaturGeist.',
};

const MISSION_SECTIONS = [
  {
    title: 'Environmental Sustainability',
    text: 'Promoting climate awareness, ecological care, conservation, and responsible use of natural resources through education, research, advocacy, and community-based action.',
    image: '/images/project/IMG-20260227-WA0012.jpg',
    alt: 'Community tree planting and environmental care',
  },
  {
    title: 'Sustainable Livelihoods',
    text: 'Strengthening livelihoods, especially for women, migrants, informal workers, and marginalised communities through skills development, capacity building, and locally rooted income opportunities.',
    image: '/images/project/sustainable.jpg',
    alt: 'Community harvesting and sustainable livelihoods',
  },
  {
    title: 'Gender Equity & Social Inclusion',
    text: 'Amplifying voices, addressing structural inequalities, and enabling meaningful participation of women and marginalised genders in social and economic spaces.',
    image: '/images/project/gender-equity.jpg',
    alt: 'Community and inclusion',
  },
  {
    title: 'Mental Health & Psychosocial Well-Being',
    text: 'Supporting emotional resilience and psychosocial well-being through awareness programmes, community outreach, training, research, and culturally grounded approaches to care.',
    image: '/images/project/IMG-20260227-WA0016.jpg',
    alt: 'Community well-being and connection',
  },
] as const;

export default function OurMissionPage() {
  return (
    <main className="page-content mission-page">
      <div className="content-wrap mission-wrap">
        <h1 className="content-title mission-title">OUR MISSION</h1>
        <p className="content-lead">
          Environmental sustainability, livelihoods, gender equity, and mental well-being.
        </p>
        {MISSION_SECTIONS.map((section, index) => (
          <section
            key={section.title}
            className={`mission-block mission-block-${index + 1} ${index % 2 === 1 ? 'mission-block-reverse' : ''}`}
          >
            <div className="mission-block-image">
              <Image
                src={section.image}
                alt={section.alt}
                width={500}
                height={320}
                className="mission-img"
              />
            </div>
            <div className="mission-block-content">
              <h2 className="mission-block-title">{section.title}</h2>
              <p className="mission-block-text">{section.text}</p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
