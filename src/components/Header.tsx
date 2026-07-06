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

const NAV_LINKS = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Our Approach', href: '/our-approach' },
  { label: 'Team', href: '/team' },
  { label: 'Join Us', href: '/join-us' },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
] as const;

export default function Header() {
  const [logoError, setLogoError] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
          <Link href="/about-us" className="app-header-nav-link">
            About-Us
          </Link>
          <Link href="/our-approach" className="app-header-nav-link">
            Our Approach
          </Link>
          <Link href="/events" className="app-header-nav-link">
            Events
          </Link>
          
          <Link href="/join-us" className="app-header-nav-link">
          Join Us
          </Link>
          <Link href="/team" className="app-header-nav-link">
            Team
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

        {/* Hamburger – mobile only */}
        <button
          type="button"
          className="app-header-hamburger"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((v) => !v)}
        >
          <span className={`app-header-hamburger-icon${mobileMenuOpen ? ' open' : ''}`}>
            <span />
            <span />
            <span />
          </span>
        </button>

        <div className="app-header-right" />
        </div>
      </header>

      {/* Backdrop */}
      {mobileMenuOpen && (
        <div
          className="app-mobile-backdrop"
          aria-hidden
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Side drawer – fixed, outside header so body doesn't shift */}
      <nav
        className={`app-header-mobile-nav${mobileMenuOpen ? ' open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!mobileMenuOpen}
      >
        <div className="app-mobile-drawer-header">
          <span className="app-mobile-drawer-title">Menu</span>
          <button
            type="button"
            className="app-mobile-close"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="app-header-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
      </nav>

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
