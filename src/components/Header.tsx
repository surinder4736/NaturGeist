'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UpcomingEventRecord } from '@/lib/upcoming-events/types';

const INITIATIVES_LINKS = [
  { label: 'Cloth For Work', href: '/initiatives/cloth-for-work' },
  { label: 'Not Just A Piece Of Cloth', href: '/initiatives/not-just-a-piece-of-cloth' },
  { label: 'School To School', href: '/initiatives/school-to-school' },
  { label: 'Rahat', href: '/initiatives/rahat' },
  { label: 'Green By Goonj', href: '/initiatives/green-by-goonj' },
] as const;

const IMPACT_LINKS = [
  { label: 'Water', href: '/impact/water' },
  { label: 'Access & Infrastructure', href: '/impact/access-infrastructure' },
  { label: 'Education', href: '/impact/education' },
  { label: 'Environment', href: '/impact/environment' },
  { label: 'Sanitation', href: '/impact/sanitation' },
  { label: 'Health', href: '/impact/health' },
  { label: 'Livelihood', href: '/impact/livelihood' },
  { label: 'Rahat Covid', href: '/impact/rahat-covid' },
  { label: 'State Reports', href: '/impact/state-reports' },
] as const;

const GET_INVOLVED_LINKS = [
  { label: 'Collection Camps', href: '/get-involved/collection-camps' },
  { label: 'Dropping Centers', href: '/get-involved/dropping-centers' },
  { label: 'Volunteer', href: '/get-involved/volunteer' },
  { label: 'Partner With Us', href: '/get-involved/partner-with-us' },
  { label: 'Baithak', href: '/get-involved/baithak' },
  { label: 'Fellowship', href: '/get-involved/fellowship' },
  { label: 'Career', href: '/get-involved/career' },
  { label: 'Internship', href: '/get-involved/internship' },
] as const;

const ABOUT_US_LINKS = [
  { label: 'Our Offices', href: '/about/our-offices' },
  { label: 'Knowing Goonj', href: '/about/knowing-goonj' },
  { label: '100 Stories Of Change', href: '/about/100-stories-of-change' },
  { label: 'Awards & Recognitions', href: '/about/awards-recognitions' },
  { label: 'Frequently Asked Questions', href: '/about/faq' },
  { label: 'The Evolution Of Our Journey Together', href: '/about/evolution' },
] as const;

export default function Header() {
  const [logoError, setLogoError] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [announcementEvent, setAnnouncementEvent] = useState<UpcomingEventRecord | null>(null);
  const initiativesRef = useRef<HTMLDivElement>(null);
  const impactRef = useRef<HTMLDivElement>(null);
  const getInvolvedRef = useRef<HTMLDivElement>(null);
  const aboutUsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        initiativesRef.current?.contains(target) ||
        impactRef.current?.contains(target) ||
        getInvolvedRef.current?.contains(target) ||
        aboutUsRef.current?.contains(target)
      ) {
        return;
      }
      setOpenDropdown(null);
    }
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  useEffect(() => {
    async function loadUpcomingAnnouncement() {
      try {
        const response = await fetch('/api/upcoming-events');
        const payload = await response.json();
        if (!response.ok) return;
        setAnnouncementEvent((payload.events || [])[0] || null);
      } catch {
        setAnnouncementEvent(null);
      }
    }

    loadUpcomingAnnouncement();
  }, []);

  function handleFloatingIndicatorClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (window.location.pathname === '/') {
      e.preventDefault();
      const section = document.getElementById('upcoming-events');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
  }

  return (
    <>
      <header className="app-header">
        <div className="app-header-inner">
        {/* Left: Logo + tagline + url */}
        <Link href="/" className="app-header-brand">
          <span className="app-header-logo-wrap">
            <Image
              src="/images/logo.png"
              alt=""
              width={56}
              height={56}
              className="app-header-logo"
              unoptimized
              onError={() => setLogoError(true)}
            />
          </span>
          <span className="app-header-tagline">
            <strong>NaturGeist</strong>
            <span className="app-header-tagline-text">Society for People and Planet</span>
            <span className="app-header-url">www.naturgeist.org</span>
          </span>
        </Link>

        {/* Center: Nav */}
        <nav className="app-header-nav">
          {/* <Link href="/climate" className="app-header-nav-link">
            Climate Emergencies
          </Link> */}
          {/* <div
            className="app-header-nav-item app-header-dropdown"
            ref={initiativesRef}
            onMouseEnter={() => setOpenDropdown('initiatives')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              className="app-header-nav-link app-header-dropdown-trigger"
              onClick={() => setOpenDropdown((v) => (v === 'initiatives' ? null : 'initiatives'))}
              aria-expanded={openDropdown === 'initiatives'}
              aria-haspopup="true"
            >
              Initiatives
              <span className="app-header-chevron" aria-hidden>▼</span>
            </button>
            <div
              className="app-header-dropdown-panel"
              aria-hidden={openDropdown !== 'initiatives'}
            >
              {INITIATIVES_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="app-header-dropdown-link"
                  onClick={() => setOpenDropdown(null)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div> */}
          {/* <div
            className="app-header-nav-item app-header-dropdown"
            ref={impactRef}
            onMouseEnter={() => setOpenDropdown('impact')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              className="app-header-nav-link app-header-dropdown-trigger"
              onClick={() => setOpenDropdown((v) => (v === 'impact' ? null : 'impact'))}
              aria-expanded={openDropdown === 'impact'}
              aria-haspopup="true"
            >
              Impact
              <span className="app-header-chevron" aria-hidden>▼</span>
            </button>
            <div
              className="app-header-dropdown-panel"
              aria-hidden={openDropdown !== 'impact'}
            >
              {IMPACT_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="app-header-dropdown-link"
                  onClick={() => setOpenDropdown(null)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div> */}
          {/* <div
            className="app-header-nav-item app-header-dropdown"
            ref={getInvolvedRef}
            onMouseEnter={() => setOpenDropdown('get-involved')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              className="app-header-nav-link app-header-dropdown-trigger"
              onClick={() => setOpenDropdown((v) => (v === 'get-involved' ? null : 'get-involved'))}
              aria-expanded={openDropdown === 'get-involved'}
              aria-haspopup="true"
            >
              Get Involved
              <span className="app-header-chevron" aria-hidden>▼</span>
            </button>
            <div
              className="app-header-dropdown-panel"
              aria-hidden={openDropdown !== 'get-involved'}
            >
              {GET_INVOLVED_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="app-header-dropdown-link"
                  onClick={() => setOpenDropdown(null)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div> */}
          {/* <div
            className="app-header-nav-item app-header-dropdown"
            ref={aboutUsRef}
            onMouseEnter={() => setOpenDropdown('about-us')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              className="app-header-nav-link app-header-dropdown-trigger"
              onClick={() => setOpenDropdown((v) => (v === 'about-us' ? null : 'about-us'))}
              aria-expanded={openDropdown === 'about-us'}
              aria-haspopup="true"
            >
              About Us
              <span className="app-header-chevron" aria-hidden>▼</span>
            </button>
            <div
              className="app-header-dropdown-panel"
              aria-hidden={openDropdown !== 'about-us'}
            >
              {ABOUT_US_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="app-header-dropdown-link"
                  onClick={() => setOpenDropdown(null)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div> */}
          <Link href="/our-mission" className="app-header-nav-link">
            Our Mission
          </Link>
          <Link href="/team" className="app-header-nav-link">
            Team
          </Link>
          <Link href="/join-us" className="app-header-nav-link">
          Join Us
          </Link>
          <Link href="/events" className="app-header-nav-link">
            Events
          </Link>
          {/* <Link
            href="/join-us"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Join Us
          </Link> */}
          <Link href="/contact" className="app-header-nav-link">
            Contact
          </Link>
        </nav>

        <div className="app-header-right" />
        </div>
      </header>

      {announcementEvent && (
        <Link
          href="/#upcoming-events"
          onClick={handleFloatingIndicatorClick}
          className="floating-upcoming-indicator"
          aria-label={`Upcoming event available: ${announcementEvent.title}`}
          title={`${announcementEvent.title} • ${announcementEvent.date} • ${announcementEvent.startTime} - ${announcementEvent.endTime}`}
        >
          <span className="floating-upcoming-dot" aria-hidden />
          <span className="floating-upcoming-icon-wrap" aria-hidden>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </span>
          <span className="floating-upcoming-label">Register Now</span>
        </Link>
      )}
    </>
  );
}
