import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | NaturGeist Society for People and Planet",
  description:
    "Learn who we are, our vision, mission, and the values that guide NaturGeist Society for People and Planet.",
};

const VALUES = [
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 6v6l4 2" />
        <circle cx="18" cy="6" r="3" />
      </svg>
    ),
    title: "Sustainability",
    text: "We promote development approaches that protect ecological systems while supporting present and future generations.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Inclusion",
    text: "Meaningful development must be accessible, participatory, and responsive to diverse voices and experiences.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Dignity",
    text: "Every individual deserves opportunities, respect, and agency in shaping their own future.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    title: "Collaboration",
    text: "Partnerships and collective action are essential for addressing complex social and environmental challenges.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    title: "Integrity",
    text: "We are committed to transparency, accountability, ethical practice, and responsible stewardship of resources.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
      </svg>
    ),
    title: "Learning",
    text: "We value knowledge creation, reflection, innovation, and evidence-based approaches to social change.",
  },
];

export default function AboutUsPage() {
  return (
    <main className="landing landing-naturgeist">
      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="about-hero-bg">
          <Image
            src="/images/project/IMG-20260227-WA0016.jpg"
            alt="NaturGeist community work"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
        </div>
        <div className="about-hero-overlay" aria-hidden />
        <div className="about-hero-content">
          <span
            className="lp-section-label"
            style={{ color: "rgba(196,230,196,0.9)" }}
          >
            NaturGeist Society
          </span>
          <h1 className="about-hero-title">About Us</h1>
          <p className="about-hero-sub">
            An instrument of sustained effort for the welfare of all.
          </p>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="about-section about-section-light">
        <div className="about-inner">
          <div className="about-who-text">
            <h2 className="about-section-title">Who We Are</h2>
            <p className="about-body">
              NaturGeist Society for People and Planet is a registered
              non-profit organisation working at the intersection of
              environmental sustainability, livelihoods, gender equity, and
              mental well-being
            </p>
            <p className="about-body">
              We believe that sustainable development must address both
              ecological and human dimensions of change. Environmental
              degradation, economic vulnerability, social exclusion, and
              declining well-being are interconnected challenges that require
              integrated and community-driven responses.
            </p>
            <p className="about-body">
              Through collaborative partnerships, evidence-informed practices,
              and long-term engagement, we strive to build resilient communities
              capable of navigating social and environmental transitions while
              preserving dignity, equity, and ecological balance.
            </p>
          </div>
        </div>
      </section>

      {/* ── Vision & Mission ── */}
      <section className="about-section about-section-dark">
        <div className="about-inner">
          <div className="about-vm-grid">
            <div className="about-vm-card">
              <div className="about-vm-icon" aria-hidden>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="2" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              </div>
              <span
                className="lp-section-label"
                style={{ color: "rgba(196,230,196,0.85)" }}
              >
                Our Vision
              </span>
              <h2 className="about-vm-title">Where We Are Headed</h2>
              <p className="about-vm-text">
                A world where people and nature thrive together through
                equitable, resilient, and sustainable systems that promote human
                well-being and ecological integrity.
              </p>
            </div>

            <div className="about-vm-divider" aria-hidden />

            <div className="about-vm-card">
              <div className="about-vm-icon" aria-hidden>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
              </div>
              <span
                className="lp-section-label"
                style={{ color: "rgba(196,230,196,0.85)" }}
              >
                Our Mission
              </span>
              <h2 className="about-vm-title">What We Do</h2>
              <p className="about-vm-text">
                To design and support initiatives that strengthen environmental
                responsibility, enhance livelihoods, advance gender equity, and
                promote mental well-being through research, education, community
                engagement, and collaborative action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Guiding Ethos ── */}
      <section className="about-ethos">
        <div className="about-inner about-ethos-inner">
          <p className="about-ethos-sanskrit" lang="sa">
            सर्वहिताय साधनम्
          </p>
          <p className="about-ethos-translation">
            An instrument of sustained effort for the welfare of all.
          </p>
          <p className="about-ethos-body">
            This principle reflects our belief that meaningful social and
            ecological change requires care, perseverance, and collective
            responsibility.
          </p>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="about-section about-section-light">
        <div className="about-inner">
          <div className="about-values-header">
            <span className="lp-section-label">What Guides Us</span>
            <h2 className="about-section-title">Our Values</h2>
            <p className="about-section-subtitle">
              Six core principles that shape every decision, partnership, and
              programme we undertake.
            </p>
          </div>
          <div className="about-values-grid">
            {VALUES.map((v) => (
              <div key={v.title} className="about-value-card">
                <div className="about-value-icon">{v.icon}</div>
                <h3 className="about-value-title">{v.title}</h3>
                <p className="about-value-text">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team photo strip ── */}
      <section className="about-team-strip">
        <div className="about-team-strip-img">
          <Image
            src="/images/team-group-photo.jpg"
            alt="NaturGeist team"
            fill
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 20%" }}
          />
          <div className="about-team-strip-overlay" aria-hidden />
          <div className="about-team-strip-content">
            <h2 className="about-team-strip-title">Meet Our Team</h2>
            <p className="about-team-strip-sub">
              Dedicated individuals committed to people, planet, and purpose.
            </p>
            <Link href="/team" className="lp-btn lp-btn-primary">
              View Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
