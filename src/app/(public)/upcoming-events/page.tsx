'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function UpcomingEventsPage() {
  return (
    <main className="upcoming-events-page">
      {/* <Header /> */}

      {/* Hero Section */}
      <section className="ue-hero">
        <div className="ue-hero-bg" aria-hidden="true">
          <div className="ue-hero-leaf ue-hero-leaf-1" />
          <div className="ue-hero-leaf ue-hero-leaf-2" />
          <div className="ue-hero-leaf ue-hero-leaf-3" />
          <div className="ue-hero-leaf ue-hero-leaf-4" />
        </div>
        <div className="ue-hero-inner">
          <span className="ue-hero-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Upcoming Event
          </span>
          <h1 className="ue-hero-title">Action for Economic Empowerment</h1>
          <p className="ue-hero-subtitle">International Women&apos;s Day 2026 Workshop</p>
          <div className="ue-hero-date">
            <div className="ue-hero-date-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span>Saturday, 14 March 2026 | 1:00 PM IST</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="ue-content">
        <div className="ue-content-inner">
          {/* Flyers Grid */}
          <div className="ue-flyers">
            <div className="ue-flyer-card ue-flyer-main">
              <div className="ue-flyer-wrapper">
                <Image
                  src="/images/project/flyer-with-chair-final.jpg"
                  alt="Action for Economic Empowerment Workshop Flyer"
                  width={500}
                  height={650}
                  className="ue-flyer-img"
                  priority
                />
              </div>
            </div>
            <div className="ue-flyer-card ue-flyer-secondary">
              <div className="ue-flyer-wrapper">
                <Image
                  src="/images/project/final-flyer.jpg"
                  alt="International Women's Day 2026 Workshop Flyer"
                  width={600}
                  height={450}
                  className="ue-flyer-img"
                />
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="ue-details">
            <div className="ue-details-card">
              <h2 className="ue-details-title">About the Webinar</h2>
              <p className="ue-details-text">
                NaturGeist Society for People and Planet is pleased to invite you to a webinar on the topic <strong>&quot;Action for Economic Empowerment of Women&quot;</strong>, organized to promote awareness and dialogue around women&apos;s economic participation and financial confidence.
              </p>
              <p className="ue-details-text">
                We are honored to have <strong>Prof. Vikas Singh</strong> as the speaker and <strong>Ms. Subha Dogra</strong> as the chair for this session.
              </p>
            </div>

            {/* Speakers */}
            <div className="ue-speakers">
              <h3 className="ue-speakers-title">Featured Speakers</h3>
              <div className="ue-speakers-grid">
                <div className="ue-speaker-card">
                  <div className="ue-speaker-avatar">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="ue-speaker-info">
                    <h4 className="ue-speaker-name">Prof. Vikas Singh</h4>
                    <p className="ue-speaker-role">Speaker</p>
                    <p className="ue-speaker-affiliation">Indian Institute of Public Administration (IIPA), Delhi, India</p>
                  </div>
                </div>
                <div className="ue-speaker-card">
                  <div className="ue-speaker-avatar">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="ue-speaker-info">
                    <h4 className="ue-speaker-name">Ms. Subha Dogra</h4>
                    <p className="ue-speaker-role">Chair</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Info Grid */}
            <div className="ue-info-grid">
              <div className="ue-info-item">
                <div className="ue-info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="ue-info-content">
                  <span className="ue-info-label">Date</span>
                  <span className="ue-info-value">Saturday, 14 March 2026</span>
                </div>
              </div>
              <div className="ue-info-item">
                <div className="ue-info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="ue-info-content">
                  <span className="ue-info-label">Time</span>
                  <span className="ue-info-value">1:00 PM - 2:00 PM IST</span>
                </div>
              </div>
              <div className="ue-info-item">
                <div className="ue-info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="ue-info-content">
                  <span className="ue-info-label">Venue</span>
                  <span className="ue-info-value">Online Webinar</span>
                </div>
              </div>
              <div className="ue-info-item">
                <div className="ue-info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="ue-info-content">
                  <span className="ue-info-label">Contact</span>
                  <span className="ue-info-value">naturgeistsociety@gmail.com</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="ue-cta">
              <Link href="/contact" className="ue-btn ue-btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                Register Now
              </Link>
              <a href="tel:+919650887924" className="ue-btn ue-btn-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                +91 9650887924
              </a>
            </div>

            {/* Organization Info */}
            <div className="ue-org">
              <p className="ue-org-name">NaturGeist Society for People and Planet</p>
              <p className="ue-org-tagline">Sustained Collective Effort for Welfare of All</p>
            </div>
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </main>
  );
}
