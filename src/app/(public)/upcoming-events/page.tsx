'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { UpcomingEventRecord } from '@/lib/upcoming-events/types';

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  });
}

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<UpcomingEventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const response = await fetch('/api/upcoming-events');
        const payload = await response.json();
        if (!response.ok) {
          setError(payload.error || 'Failed to load upcoming events');
          return;
        }
        setEvents(payload.events || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load upcoming events');
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const primaryEvent = useMemo(() => events[0] || null, [events]);

  return (
    <main className="upcoming-events-page">
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
          <h1 className="ue-hero-title">{primaryEvent?.title || 'Upcoming Events'}</h1>
          <p className="ue-hero-subtitle">{primaryEvent?.description || 'Stay tuned for our next event'}</p>
          <div className="ue-hero-date">
            <div className="ue-hero-date-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span>
              {primaryEvent
                ? `${formatDate(primaryEvent.date)} | ${primaryEvent.startTime} - ${primaryEvent.endTime}`
                : 'Event details coming soon'}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="ue-content">
        <div className="ue-content-inner">
          {loading && <p className="events-message">Loading upcoming events...</p>}
          {error && <p className="events-message events-error">{error}</p>}
          {!loading && !error && !primaryEvent && (
            <p className="events-message">No upcoming events available right now.</p>
          )}

          {primaryEvent && (
            <>
              {/* Flyers Grid */}
              <div className="ue-flyers">
                <div className="ue-flyer-card ue-flyer-main">
                  <div className="ue-flyer-wrapper">
                    <img
                      src={primaryEvent.bannerUrl}
                      alt={primaryEvent.title}
                      width={500}
                      height={650}
                      className="ue-flyer-img"
                    />
                  </div>
                </div>
                <div className="ue-flyer-card ue-flyer-secondary">
                  <div className="ue-flyer-wrapper">
                    <img
                      src={primaryEvent.bannerUrl}
                      alt={`${primaryEvent.title} banner`}
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
                  <h2 className="ue-details-title">About the Event</h2>
                  <p className="ue-details-text">{primaryEvent.description}</p>
                </div>

                <div className="ue-speakers">
                  <h3 className="ue-speakers-title">Featured Speakers</h3>
                  <div className="ue-speakers-grid">
                    {(primaryEvent.speakers || []).map((speaker) => (
                      <div key={speaker.id} className="ue-speaker-card">
                        <div className="ue-speaker-avatar ue-speaker-avatar-img">
                          <img src={speaker.imageUrl} alt={speaker.name} loading="lazy" />
                        </div>
                        <div className="ue-speaker-info">
                          <h4 className="ue-speaker-name">{speaker.name}</h4>
                          <p className="ue-speaker-role">{speaker.designation}</p>
                        </div>
                      </div>
                    ))}
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
                      <span className="ue-info-value">{formatDate(primaryEvent.date)}</span>
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
                      <span className="ue-info-value">
                        {primaryEvent.startTime} - {primaryEvent.endTime}
                      </span>
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
                      <span className="ue-info-value">{primaryEvent.location}</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="ue-cta">
                  {primaryEvent.actionLink ? (
                    <Link
                      href={primaryEvent.actionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ue-btn ue-btn-primary"
                    >
                      Register Now
                    </Link>
                  ) : (
                    <button type="button" className="ue-btn ue-btn-secondary" disabled>
                      Registration link unavailable
                    </button>
                  )}
                </div>

                {/* Organization Info */}
                <div className="ue-org">
                  <p className="ue-org-name">NaturGeist Society for People and Planet</p>
                  <p className="ue-org-tagline">Sustained Collective Effort for Welfare of All</p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
