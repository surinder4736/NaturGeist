'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';

const PURPOSE_ITEMS = [
  'Environmental stress and climate vulnerability',
  'Livelihood insecurity and informal labour conditions',
  'Gendered inequalities and exclusion',
  'Emotional distress and psychosocial strain',
];

const HOW_WE_WORK = [
  'Community-led: Working with communities, not for them',
  'Dignity-centred: Moving beyond charity towards agency and respect',
  'Integrated approach: Addressing people and planet together',
  'Knowledge-informed: Bridging research, practice, and lived experience',
  'Collaborative: Partnering with civil society, academia, and practitioners',
  'Long-term commitment: Valuing continuity over quick outcomes',
];

const COLLABORATION_ITEMS = [
  'Academic institutions',
  'Civil society organisations',
  'Community groups',
  'Researchers and practitioners',
  'Public bodies and networks',
];

const COMMUNITY_NATURE_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=400&fit=crop', alt: 'Community tree planting and reforestation', caption: 'Tree planting & reforestation' },
  { src: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=500&h=400&fit=crop', alt: 'Community by river and harvest', caption: 'Community by river' },
  { src: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=400&fit=crop', alt: 'Communal harvesting and farming', caption: 'Communal harvesting' },
  { src: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=500&h=400&fit=crop', alt: 'Community appreciating nature at sunset', caption: 'Nature & togetherness' },
];

export default function HomePage() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observers = sectionRefs.current.filter(Boolean) as HTMLElement[];
    if (observers.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('lp-visible');
          }
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
    );

    observers.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const setRef = (i: number) => (el: HTMLElement | null) => {
    sectionRefs.current[i] = el;
  };

  return (
    <main className="landing landing-naturgeist">
      <Header />

      {/* Hero – with staggered load animation */}
      <section className="lp-hero">
        <div className="lp-hero-waves" aria-hidden />
        <div className="lp-hero-bg">
          <Image
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=800&fit=crop"
            alt=""
            fill
            className="lp-hero-bg-img"
            priority
            sizes="100vw"
          />
          <span className="lp-hero-bg-overlay" aria-hidden />
        </div>
        <div className="lp-hero-inner">
          <h1 className="lp-hero-title lp-hero-anim">
            <span className="lp-hero-line">NaturGeist</span>
            <span className="lp-hero-line">Society for</span>
            <span className="lp-hero-line">People & Planet</span>
          </h1>
          <p className="lp-hero-tagline lp-hero-anim lp-hero-delay-1">
            SUSTAINED COLLECTIVE EFFORT FOR WELFARE OF ALL
          </p>
          <div className="lp-hero-logo lp-hero-anim lp-hero-delay-2">
            <Image
              src="/images/logo.png"
              alt=""
              width={160}
              height={160}
              unoptimized
            />
          </div>
          <Link href="/our-mission" className="lp-btn lp-btn-primary lp-hero-anim lp-hero-delay-3">
            Our Mission
          </Link>
        </div>
      </section>

      {/* Who We Are – with image + scroll reveal */}
      <section className="lp-who" ref={setRef(0)}>
        <div className="lp-who-waves" aria-hidden />
        <div className="lp-who-grid lp-reveal">
          <div className="lp-who-inner">
            <h2 className="lp-who-title">WHO WE ARE</h2>
            <div className="lp-who-text">
              <p>
                NaturGeist Society for People and Planet is a not-for-profit organisation working at the intersection of environmental sustainability, livelihoods, gender equity, and mental well-being.
              </p>
              <p>
                It is registered as an All-India Society under the Societies Registration Act, 1860.
              </p>
              <p>
                We believe that care for the planet cannot be separated from care for people and that sustainable development must be dignity-centred, community-led, and emotionally grounded.
              </p>
              <p>
                Registered under the Societies Registration Act, 1860, NaturGeist works with communities, institutions, and practitioners through long-term, ethical engagement.
              </p>
            </div>
          </div>
          <div className="lp-who-image lp-reveal lp-reveal-right">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e7b63ac?w=600&h=500&fit=crop"
              alt="Community and people at the heart of our work—care for people and planet"
              width={600}
              height={500}
              className="lp-img"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Our Purpose */}
      <section className="lp-purpose" ref={setRef(1)}>
        <div className="lp-purpose-inner lp-reveal">
          <h2 className="lp-purpose-title">OUR PURPOSE</h2>
          <p className="lp-purpose-intro">Across regions, communities face:</p>
          <ul className="lp-purpose-list">
            {PURPOSE_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Our Guiding Ethos */}
      <section className="lp-ethos" ref={setRef(2)}>
        <div className="lp-ethos-inner lp-reveal">
          <h2 className="lp-ethos-title">OUR GUIDING ETHOS</h2>
          <p className="lp-ethos-sanskrit" lang="sa">सर्वहिताय साधनम्</p>
          <p className="lp-ethos-text">
            An instrument of sustained effort for the welfare of all. This principle reflects our belief that meaningful social and ecological change requires care, perseverance, and collective responsibility.
          </p>
        </div>
      </section>

      {/* Community & Nature – 2x2 image grid */}
      <section className="lp-community" ref={setRef(3)}>
        <div className="lp-community-inner">
          <h2 className="lp-community-title lp-reveal">Community & Nature</h2>
          <p className="lp-community-subtitle lp-reveal">Environmental stewardship, community engagement, and care for people and planet.</p>
          <div className="lp-community-grid">
            {COMMUNITY_NATURE_IMAGES.map((item, i) => (
              <div key={item.src} className={`lp-community-card lp-reveal lp-reveal-delay-${i}`}>
                <div className="lp-community-card-img">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={500}
                    height={400}
                    className="lp-img"
                  />
                </div>
                <p className="lp-community-caption">{item.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work – with image */}
      <section className="lp-how" ref={setRef(4)}>
        <div className="lp-how-grid">
          <div className="lp-how-image lp-reveal">
            <Image
              src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=450&fit=crop"
              alt="Community collaboration"
              width={600}
              height={450}
              className="lp-img"
            />
          </div>
          <div className="lp-how-inner lp-reveal lp-reveal-right">
            <h2 className="lp-how-title">HOW WE WORK:</h2>
            <ul className="lp-how-list">
              {HOW_WE_WORK.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Collaboration & Partnerships */}
      <section className="lp-collab" ref={setRef(5)}>
        <div className="lp-collab-inner lp-reveal">
          <h2 className="lp-collab-title">COLLABORATION & PARTNERSHIPS</h2>
          <p className="lp-collab-intro">We collaborate with:</p>
          <ul className="lp-collab-list">
            {COLLABORATION_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="lp-collab-close">
            We value shared learning, ethical practice, and mutual respect.
          </p>
        </div>
      </section>

      {/* Transparency & Ethics – with subtle image */}
      <section className="lp-transparency" ref={setRef(6)}>
        <div className="lp-transparency-wrap">
          <div className="lp-transparency-inner lp-reveal">
            <h2 className="lp-transparency-title">TRANSPARENCY & ETHICS</h2>
            <p className="lp-transparency-text">
              NaturGeist Society for People and Planet is a not-for-profit organisation. All resources are used solely to advance the Society&apos;s aims and objectives. No member has any personal claim over the Society&apos;s assets or income. We are committed to transparency, accountability, and ethical governance.
            </p>
          </div>
          <div className="lp-transparency-image lp-reveal lp-reveal-right">
            <Image
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop"
              alt="Community engagement"
              width={400}
              height={300}
              className="lp-img"
            />
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="lp-cta" ref={setRef(7)}>
        <div className="lp-cta-inner lp-reveal">
          <p className="lp-cta-text">Care • Perseverance • People & Planet</p>
          <div className="lp-cta-buttons">
            <Link href="/our-mission" className="lp-btn lp-btn-primary">Our Mission</Link>
            <Link href="/contact" className="lp-btn lp-btn-secondary">Contact Us</Link>
            <Link href="/contribute" className="lp-btn lp-btn-primary">Contribute</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <p className="lp-footer-copy">
            © {new Date().getFullYear()} NaturGeist Society for People and Planet.
          </p>
          <div className="lp-footer-links">
            <Link href="/causes">Causes</Link>
            <Link href="/impact">Impact</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/team">Team</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
