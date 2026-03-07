'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
  { src: '/images/project/IMG-20260227-WA0013.jpg', alt: 'Community appreciating nature at sunset', caption: 'Nature & togetherness' },
];

const UPCOMING_EVENTS = [
  {
    id: 1,
    title: 'Action for Economic Empowerment of Women',
    date: 'March 14, 2026',
    day: '14',
    month: 'MAR',
    time: '1:00 PM - 2:00 PM',
    location: 'Online Webinar',
    description: 'NaturGeist Society for People and Planet is pleased to invite you to a webinar promoting awareness and dialogue around women\'s economic participation and financial confidence.',
    image: '/images/project/economic-empowerment-webinar.jpg',
    featured: true,
    speakers: [
      { name: 'Prof. Vikas Singh', role: 'Speaker' },
      { name: 'Ms. Subha Dogra', role: 'Chair' },
    ],
  },
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
            src="/images/team-group-photo.jpg"
            alt="NaturGeist team members group photo"
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
      <section className="lp-join" ref={setRef(0)}>
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
          <div className="lp-who-image lp-reveal lp-reveal-right" style={{ display: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* <img
              src="https://images.unsplash.com/photo-1511497584788-876760111969?w=500&h=400&fit=crop"
              alt="Community and people at the heart of our work—care for people and planet"
              width={600}
              height={500}
              className="lp-img"
              loading="lazy"
            /> */}
          </div>
        </div>
      </section>

      {/* Our Purpose */}
      <section className="lp-join" ref={setRef(1)}>
        <div className="lp-purpose-grid lp-reveal">
          <div className="lp-purpose-inner lp-reveal">
            <h2 className="lp-purpose-title">OUR PURPOSE</h2>
            <p className="lp-purpose-intro">Across regions, communities face:</p>
            <ul className="lp-purpose-list">
              {PURPOSE_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="lp-purpose-inner lp-reveal">
          <h2 className="lp-purpose-title">OUR GUIDING ETHOS</h2>
          <p className="lp-ethos-sanskrit" lang="sa">सर्वहिताय साधनम्</p>
          <p className="lp-ethos-text">
            An instrument of sustained effort for the welfare of all. This principle reflects our belief that meaningful social and ecological change requires care, perseverance, and collective responsibility.
          </p>
        </div>
        </div>

      </section>
      {/* Community & Nature – 2x2 image grid */}
      <section className="lp-community" ref={setRef(3)} style={{ display: 'none' }}>
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
      <section className="lp-how" ref={setRef(4)} style={{ display: 'none' }}>
        <div className="lp-how-grid">
          <div className="lp-how-image lp-reveal">
            <Image
              src="/images/project/sustainable.jpg"
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

      {/* Upcoming Events */}
      <section className="lp-events-new" id="upcoming-events" ref={setRef(3)}>
        <div className="lp-events-new-bg" aria-hidden="true">
          <div className="lp-events-leaf lp-events-leaf-1" />
          <div className="lp-events-leaf lp-events-leaf-2" />
          <div className="lp-events-leaf lp-events-leaf-3" />
          <div className="lp-events-leaf lp-events-leaf-4" />
        </div>
        <div className="lp-events-new-inner">
          <div className="lp-events-new-header lp-reveal">
            <span className="lp-events-new-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Upcoming Event
            </span>
            <h2 className="lp-events-new-title">Join Our Next Workshop</h2>
            <p className="lp-events-new-subtitle">Be part of our community initiatives and make a difference together</p>
          </div>
          
          {UPCOMING_EVENTS.map((event) => (
            <div key={event.id} className="lp-event-showcase lp-reveal">
              <div className="lp-event-showcase-grid">
                {/* Left: Event Flyer Image */}
                <div className="lp-event-flyer">
                  <div className="lp-event-flyer-wrapper">
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={450}
                      height={600}
                      className="lp-event-flyer-img"
                    />
                    <div className="lp-event-flyer-glow" aria-hidden="true" />
                  </div>
                </div>
                
                {/* Right: Event Details */}
                <div className="lp-event-details">
                  <div className="lp-event-date-card">
                    <div className="lp-event-date-day">{event.day}</div>
                    <div className="lp-event-date-month">{event.month}</div>
                    <div className="lp-event-date-year">2026</div>
                  </div>
                  
                  <h3 className="lp-event-title">{event.title}</h3>
                  
                  <p className="lp-event-description">{event.description}</p>
                  
                  {event.speakers && (
                    <div className="lp-event-speakers">
                      <h4 className="lp-event-speakers-title">Featured Speakers</h4>
                      <div className="lp-event-speakers-list">
                        {event.speakers.map((speaker) => (
                          <div key={speaker.name} className="lp-event-speaker">
                            <div className="lp-event-speaker-avatar">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                            </div>
                            <div className="lp-event-speaker-info">
                              <span className="lp-event-speaker-name">{speaker.name}</span>
                              <span className="lp-event-speaker-role">{speaker.role}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="lp-event-info-grid">
                    <div className="lp-event-info-item">
                      <div className="lp-event-info-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div className="lp-event-info-content">
                        <span className="lp-event-info-label">Time</span>
                        <span className="lp-event-info-value">{event.time}</span>
                      </div>
                    </div>
                    <div className="lp-event-info-item">
                      <div className="lp-event-info-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div className="lp-event-info-content">
                        <span className="lp-event-info-label">Venue</span>
                        <span className="lp-event-info-value">{event.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lp-event-cta">
                    <Link href="/contact" className="lp-btn lp-btn-primary lp-btn-lg">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <line x1="20" y1="8" x2="20" y2="14" />
                        <line x1="23" y1="11" x2="17" y2="11" />
                      </svg>
                      Register Now
                    </Link>
                    <Link href="/upcoming-events" className="lp-btn lp-btn-outline">
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collaboration & Partnerships + Transparency & Ethics – one attractive block */}
      <section className="lp-trust-block" ref={setRef(5)} style={{ display: 'none' }}>
        <div className="lp-trust-inner">
          <div className="lp-collab-card lp-reveal">
            <span className="lp-collab-accent" aria-hidden />
            <h2 className="lp-collab-title">COLLABORATION & PARTNERSHIPS</h2>
            <p className="lp-collab-intro">We collaborate with:</p>
            <ul className="lp-collab-list">
              {COLLABORATION_ITEMS.map((item) => (
                <li key={item}><span className="lp-collab-bullet" aria-hidden /><span>{item}</span></li>
              ))}
            </ul>
            <p className="lp-collab-close">
              We value shared learning, ethical practice, and mutual respect.
            </p>
          </div>

          <div className="lp-transparency-row">
            <div className="lp-transparency-card lp-reveal">
              <h2 className="lp-transparency-title">TRANSPARENCY & ETHICS</h2>
              <p className="lp-transparency-text">
                NaturGeist Society for People and Planet is a not-for-profit organisation. All resources are used solely to advance the Society&apos;s aims and objectives. No member has any personal claim over the Society&apos;s assets or income. We are committed to transparency, accountability, and ethical governance.
              </p>
            </div>
            <div className="lp-transparency-image-wrap lp-reveal lp-reveal-right">
              <div className="lp-transparency-image">
                <Image
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&h=380&fit=crop"
                  alt="Community engagement and volunteer spirit"
                  width={500}
                  height={380}
                  className="lp-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us – theme matched with lp-* UI */}
      {/* Join Us – theme matched with lp-* UI */}
      <section className="lp-join">
        <div className="lp-join-inner">
          <div className="lp-join-content">
            <p className="lp-join-badge">Get Involved</p>
            <h2 className="lp-join-title">
              Join Us as a Volunteer or Donor
            </h2>
            <p className="lp-join-text">
              Your time, skills, and support can help strengthen communities
              and care for both people and planet. Become part of our
              long-term, dignity-centred work.
            </p>
            <Link href="/join-us" className="lp-btn lp-btn-primary">
              Join Us
            </Link>
          </div>

          {/* <div className="lp-join-actions">
            <Link href="/join-us" className="lp-btn lp-btn-primary">
              Join Us
            </Link>
            <Link href="/contribute" className="lp-btn lp-btn-secondary">
              Support Our Work
            </Link>
          </div> */}
        </div>
      </section>

      {/* CTA strip */}
      {/* <section className="lp-join" ref={setRef(6)} style={{display: 'none'}}>
        <div className="lp-cta-inner lp-reveal">
          <p className="lp-cta-text">Care • Perseverance • People & Planet</p>
          <div className="lp-cta-buttons">
            <Link href="/our-mission" className="lp-btn lp-btn-primary">Our Mission</Link>
            <Link href="/contact" className="lp-btn lp-btn-primary">Contact Us</Link>
            <Link href="/contribute" className="lp-btn lp-btn-primary">Contribute</Link>
          </div>
        </div>
      </section> */}

      <Footer />
    </main>
  );
}
