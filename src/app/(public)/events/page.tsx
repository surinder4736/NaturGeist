'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Sparkles,
  Video,
  X,
} from 'lucide-react';
import { EventRecord } from '@/lib/events/types';

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [lightbox, setLightbox] = useState<{
    eventTitle: string;
    images: { id: string; url: string; fileName: string }[];
    index: number;
  } | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const response = await fetch('/api/events?pastOnly=1');
        const payload = await response.json();
        if (!response.ok) {
          setError(payload.error || 'Failed to load events');
          return;
        }
        setEvents(payload.events || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const dateOptions = useMemo(() => {
    const allDates = new Set(events.map((event) => event.date));
    return [...allDates].sort((a, b) => b.localeCompare(a));
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (selectedDate === 'all') return events;
    return events.filter((event) => event.date === selectedDate);
  }, [events, selectedDate]);

  const currentImage = lightbox ? lightbox.images[lightbox.index] : null;
  const totalMediaCount = filteredEvents.reduce((acc, event) => acc + event.media.length, 0);
  const totalEventCount = filteredEvents.length;

  function openLightbox(
    eventTitle: string,
    images: { id: string; url: string; fileName: string }[],
    index: number,
  ) {
    lastFocusedRef.current = document.activeElement as HTMLElement;
    setLightbox({ eventTitle, images, index });
    setIsClosingModal(false);
  }

  function closeLightbox() {
    setIsClosingModal(true);
    window.setTimeout(() => {
      setLightbox(null);
      setIsClosingModal(false);
      lastFocusedRef.current?.focus();
    }, 180);
  }

  function goNext() {
    if (!lightbox) return;
    setLightbox({
      ...lightbox,
      index: (lightbox.index + 1) % lightbox.images.length,
    });
  }

  function goPrev() {
    if (!lightbox) return;
    setLightbox({
      ...lightbox,
      index: (lightbox.index - 1 + lightbox.images.length) % lightbox.images.length,
    });
  }

  useEffect(() => {
    if (!lightbox) return;

    document.body.style.overflow = 'hidden';
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowRight') goNext();
      if (event.key === 'ArrowLeft') goPrev();
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [lightbox]);

  return (
    <main className="events-page">
      <section className="events-page-header">
        <div className="events-page-wrap">
          <div className="events-hero-card">
            <div className="events-hero-copy">
              <p className="events-kicker">
                <Sparkles size={13} /> NaturGeist Event Archive
              </p>
              <h1 className="events-title">Stories, Moments, and Impact</h1>
              <p className="events-subtitle">
                Explore all previous events with photos and videos organized by event date.
              </p>
            </div>

            <div className="events-stats">
              <div className="events-stat-card">
                <CalendarDays size={16} className="events-stat-icon" />
                <span className="events-stat-value">{totalEventCount}</span>
                <span className="events-stat-label">Events</span>
              </div>
              <div className="events-stat-card">
                <ImageIcon size={16} className="events-stat-icon" />
                <span className="events-stat-value">{totalMediaCount}</span>
                <span className="events-stat-label">Media Items</span>
              </div>
            </div>
          </div>

          <div className="events-filter-wrap">
            <div className="events-filter">
              <label htmlFor="event-date-filter">Filter by date</label>
              <select
                id="event-date-filter"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                <option value="all">All previous events</option>
                {dateOptions.map((date) => (
                  <option key={date} value={date}>
                    {formatDate(date)}
                  </option>
                ))}
              </select>
            </div>

            <div className="events-filter-chips" aria-label="Quick date filter">
              <button
                type="button"
                className={`events-chip ${selectedDate === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedDate('all')}
              >
                All
              </button>
              {dateOptions.slice(0, 8).map((date) => (
                <button
                  key={date}
                  type="button"
                  className={`events-chip ${selectedDate === date ? 'active' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  {formatShortDate(date)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="events-page-content">
        <div className="events-page-wrap">
          {loading && <p className="events-message events-state-card">Loading events...</p>}
          {error && <p className="events-message events-error events-state-card">{error}</p>}
          {!loading && !error && filteredEvents.length === 0 && (
            <p className="events-message events-state-card events-empty-state">
              <CalendarDays size={18} />
              No events found for the selected date.
            </p>
          )}

          {filteredEvents.map((event) => {
            const images = event.media.filter((item) => item.type === 'image');
            const videos = event.media.filter((item) => item.type === 'video');

            return (
              <article key={event.id} className="event-block">
                <header className="event-block-header">
                  <div>
                    <h2>{event.title}</h2>
                    <p>{formatDate(event.date)}</p>
                  </div>
                  <div className="event-block-meta">
                    <span>
                      <ImageIcon size={12} /> {images.length} Images
                    </span>
                    <span>
                      <Video size={12} /> {videos.length} Videos
                    </span>
                  </div>
                </header>

                <div className="event-media-group">
                  {images.length > 0 && (
                    <div className="event-media-section">
                      <h3 className="event-section-heading">Images</h3>
                      <div className="event-media-grid">
                        {images.map((media, imageIndex) => (
                          <figure key={media.id} className="event-media-card">
                            <button
                              type="button"
                              className="event-image-button"
                              onClick={() =>
                                openLightbox(
                                  event.title,
                                  images.map((image) => ({
                                    id: image.id,
                                    url: image.url,
                                    fileName: image.fileName,
                                  })),
                                  imageIndex,
                                )
                              }
                              aria-label={`Open image preview: ${media.fileName}`}
                            >
                              <img src={media.url} alt={media.fileName} loading="lazy" />
                            </button>
                          </figure>
                        ))}
                      </div>
                    </div>
                  )}

                  {videos.length > 0 && (
                    <div className="event-media-section">
                      <h3 className="event-section-heading">Videos</h3>
                      <div className="event-media-grid">
                        {videos.map((media) => (
                          <figure key={media.id} className="event-media-card">
                            <video src={media.url} controls preload="metadata" />
                          </figure>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {lightbox && currentImage && (
        <div
          className={`events-lightbox-backdrop${isClosingModal ? ' closing' : ''}`}
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div
            className={`events-lightbox-modal${isClosingModal ? ' closing' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={`Image preview for ${lightbox.eventTitle}`}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="events-lightbox-close"
              onClick={closeLightbox}
              aria-label="Close image preview"
            >
              <X size={18} />
            </button>

            {lightbox.images.length > 1 && (
              <button
                type="button"
                className="events-lightbox-nav prev"
                onClick={goPrev}
                aria-label="View previous image"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            <figure className="events-lightbox-figure">
              <img
                src={currentImage.url}
                alt={currentImage.fileName}
                className="events-lightbox-image"
              />
              <figcaption className="events-lightbox-caption">
                <span>{currentImage.fileName}</span>
                {lightbox.images.length > 1 && (
                  <span>
                    {lightbox.index + 1} / {lightbox.images.length}
                  </span>
                )}
              </figcaption>
            </figure>

            {lightbox.images.length > 1 && (
              <button
                type="button"
                className="events-lightbox-nav next"
                onClick={goNext}
                aria-label="View next image"
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
