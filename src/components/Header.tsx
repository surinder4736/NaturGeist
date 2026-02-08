'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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

  return (
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
          <Link href="/contact" className="app-header-nav-link">
            Contact
          </Link>
        </nav>

        {/* Right: Search + Contribute */}
        <div className="app-header-actions">
          <button
            type="button"
            className="app-header-search"
            aria-label="Search"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <Link href="/contribute" className="app-header-contribute">
            Contribute
          </Link>
        </div>
      </div>
    </header>
  );
}
