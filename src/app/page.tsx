"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UpcomingEventRecord } from "@/lib/upcoming-events/types";

const FOCUS_AREAS = [
  {
    title: "Environmental Sustainability",
    description:
      "Promoting ecological awareness, climate resilience, sustainable resource management, and community-led environmental action.",
    image: "/images/image2.png",
  },
  {
    title: "Livelihoods & Economic Empowerment",
    description:
      "Supporting communities in building resilient, dignified, and sustainable livelihood opportunities that respect human dignity.",
    image: "/images/image3.png",
  },
  {
    title: "Gender Equity & Inclusion",
    description:
      "Advancing gender-equitable approaches across all programme areas and within organisational practice.",
    image: "/images/image4.png",
  },
  {
    title: "Mental Well-being",
    description:
      "Addressing psychosocial dimensions of development by integrating mental health awareness and community support.",
    image: "/images/image5.png",
  },
];

const PURPOSE_ITEMS = [
  "Environmental stress and climate vulnerability",
  "Livelihood insecurity and informal labour conditions",
  "Gendered inequalities and exclusion",
  "Emotional distress and psychosocial strain",
];

const HOW_WE_WORK = [
  { label: "Community-led", detail: "Working with communities, not for them" },
  { label: "Dignity-centred", detail: "Moving beyond charity towards agency and respect" },
  { label: "Integrated approach", detail: "Addressing people and planet together" },
  { label: "Knowledge-informed", detail: "Bridging research, practice, and lived experience" },
  { label: "Collaborative", detail: "Partnering with civil society, academia, and practitioners" },
  { label: "Long-term commitment", detail: "Valuing continuity over quick outcomes" },
];

const COLLABORATION_ITEMS = [
  "Academic institutions",
  "Civil society organisations",
  "Community groups",
  "Researchers and practitioners",
  "Public bodies and networks",
];

const COMMUNITY_NATURE_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=400&fit=crop",
    alt: "Community tree planting and reforestation",
    caption: "Tree planting & reforestation",
  },
  {
    src: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=500&h=400&fit=crop",
    alt: "Community by river and harvest",
    caption: "Community by river",
  },
  {
    src: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=400&fit=crop",
    alt: "Communal harvesting and farming",
    caption: "Communal harvesting",
  },
  {
    src: "/images/project/IMG-20260227-WA0013.jpg",
    alt: "Community appreciating nature at sunset",
    caption: "Nature & togetherness",
  },
];

function getDay(value: string) {
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit" });
}

function getMonth(value: string) {
  return new Date(value)
    .toLocaleDateString("en-IN", { month: "short" })
    .toUpperCase();
}

export default function HomePage() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEventRecord[]>([]);

  useEffect(() => {
    const observers = sectionRefs.current.filter(Boolean) as HTMLElement[];
    if (observers.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("lp-visible");
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.1 },
    );

    observers.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    async function loadUpcomingEvents() {
      try {
        const response = await fetch("/api/upcoming-events");
        const payload = await response.json();
        if (!response.ok) return;
        setUpcomingEvents(payload.events || []);
      } catch {
        setUpcomingEvents([]);
      }
    }
    loadUpcomingEvents();
  }, []);

  const setRef = (i: number) => (el: HTMLElement | null) => {
    sectionRefs.current[i] = el;
  };

  return (
    <main className="landing landing-naturgeist">
      <Header />

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-bg">
          <Image
            src="/images/image1.jpeg"
            alt="NaturGeist team members group photo"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
        </div>
        <div className="lp-hero-overlay" aria-hidden />
        <div className="lp-hero-content">
          {/* <p className="lp-hero-tagline">Society for People and Planet</p> */}
          <h1 className="lp-hero-heading">
            Where Human Well-being and Environmental Stewardship Meet
          </h1>
          {/* <div className="lp-hero-cta-row">
            <Link href="/our-mission" className="lp-btn lp-btn-primary">
              Our Mission
            </Link>
            <Link href="/join-us" className="lp-btn lp-btn-secondary">
              Get Involved
            </Link>
          </div> */}
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="lp-join" ref={setRef(0)}>
        <div className="lp-who-waves" aria-hidden />
        <div className="lp-who-grid lp-reveal">
          <div className="lp-who-inner">
            <span className="lp-section-label">Who We Are</span>
            <h2 className="lp-who-title">
              A Registered Non-Profit Working at the Intersection of People &
              Planet
            </h2>
            <div className="lp-who-text">
              <p>
                NaturGeist Society for People and Planet is a registered
                non-profit organisation working at the intersection of
                environmental sustainability, livelihoods, gender equity, and
                mental well-being. Established under the Societies Registration
                Act, 1860, we foster sustainable and inclusive development
                through community engagement, research, and collaborative
                action.
              </p>
              <p>
                We work with communities, institutions, practitioners, and
                development stakeholders to create solutions that strengthen
                both human and ecological resilience — advancing pathways that
                are environmentally responsible, socially equitable, and
                emotionally sustainable.
              </p>
            </div>
            <Link href="/our-mission" className="lp-btn lp-btn-primary" style={{ marginTop: "1.5rem", display: "inline-flex" }}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── Our Focus Areas ── */}
      <section className="lp-focus-section" ref={setRef(1)}>
        <div className="lp-focus-inner">
          <div className="lp-focus-header lp-reveal">
            <span className="lp-section-label" style={{ color: "var(--lp-light-on-dark, #d4e8d4)" }}>
              What We Address
            </span>
            <h2 className="lp-focus-title">Our Focus Areas</h2>
          </div>
          <div className="lp-focus-grid">
            {FOCUS_AREAS.map((area, i) => (
              <div
                key={area.title}
                className={`lp-focus-card lp-reveal lp-reveal-delay-${i}`}
              >
                <div className="lp-focus-card-img">
                  <Image
                    src={area.image}
                    alt={area.title}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 25vw"
                    className="lp-img"
                  />
                  <div className="lp-focus-card-overlay" aria-hidden />
                </div>
                <div className="lp-focus-card-body">
                  <h3 className="lp-focus-card-title">{area.title}</h3>
                  <p className="lp-focus-card-text">{area.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section className="lp-events-new" id="upcoming-events" ref={setRef(5)}>
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
            <p className="lp-events-new-subtitle">
              Be part of our community initiatives and make a difference together
            </p>
          </div>

          {upcomingEvents.map((event) => (
            <div key={event.id} className="lp-event-showcase lp-reveal">
              <div className="lp-event-showcase-grid">
                <div className="lp-event-flyer">
                  <div className="lp-event-flyer-wrapper">
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      width={450}
                      height={600}
                      className="lp-event-flyer-img"
                    />
                    <div className="lp-event-flyer-glow" aria-hidden="true" />
                  </div>
                </div>

                <div className="lp-event-details">
                  <div className="lp-event-date-card">
                    <div className="lp-event-date-day">{getDay(event.date)}</div>
                    <div className="lp-event-date-month">{getMonth(event.date)}</div>
                    <div className="lp-event-date-year">{new Date(event.date).getFullYear()}</div>
                  </div>

                  <h3 className="lp-event-title">{event.title}</h3>
                  <p className="lp-event-description">{event.description}</p>

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
                        <span className="lp-event-info-value">
                          {event.startTime} - {event.endTime}
                        </span>
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

                  {(event.speakers || []).length > 0 && (
                    <div className="lp-event-speakers">
                      <h4 className="lp-event-speakers-title">Featured Speakers</h4>
                      <div className="lp-event-speakers-list">
                        {event.speakers.map((speaker) => (
                          <div key={speaker.id} className="lp-event-speaker">
                            <div className="lp-event-speaker-avatar lp-event-speaker-avatar-img">
                              <img src={speaker.imageUrl} alt={speaker.name} />
                            </div>
                            <div className="lp-event-speaker-info">
                              <span className="lp-event-speaker-name">{speaker.name}</span>
                              <span className="lp-event-speaker-role">{speaker.designation}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="lp-event-cta">
                    <Link
                      href={event.actionLink || "#"}
                      target={event.actionLink ? "_blank" : undefined}
                      rel={event.actionLink ? "noopener noreferrer" : undefined}
                      className="lp-btn lp-btn-primary lp-btn-lg"
                      aria-disabled={!event.actionLink}
                      onClick={(e) => { if (!event.actionLink) e.preventDefault(); }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <line x1="20" y1="8" x2="20" y2="14" />
                        <line x1="23" y1="11" x2="17" y2="11" />
                      </svg>
                      Register Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {upcomingEvents.length === 0 && (
            <div className="lp-event-empty lp-reveal">
              No upcoming events are scheduled right now. Check back soon.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
