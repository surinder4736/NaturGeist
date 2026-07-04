import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Users,
  Megaphone,
  Handshake,
  Heart,
  Building2,
  HandCoins,
  Mail,
  CheckCircle2,
} from "lucide-react";
export const metadata: Metadata = {
  title: "Our Approach | NaturGeist Society for People and Planet",
  description:
    "How NaturGeist works — research, capacity building, community engagement, advocacy, and partnerships — plus our programmes, ways to get involved, and governance.",
};

const APPROACH_PILLARS = [
  {
    icon: BookOpen,
    title: "Research",
    text: "Generating knowledge and evidence that inform policy, practice, and community action.",
  },
  {
    icon: GraduationCap,
    title: "Capacity Building",
    text: "Supporting individuals, institutions, and communities through training, workshops, and skill development.",
  },
  {
    icon: Users,
    title: "Community Engagement",
    text: "Facilitating participatory processes that encourage local ownership and collective action.",
  },
  {
    icon: Megaphone,
    title: "Advocacy & Awareness",
    text: "Promoting informed dialogue and public engagement on environmental and social issues.",
  },
  {
    icon: Handshake,
    title: "Partnerships",
    text: "Collaborating with civil society organisations, educational institutions, government agencies, researchers, and corporate partners.",
  },
];

const PROGRAMME_HIGHLIGHTS = [
  "Project Overview",
  "Objectives",
  "Target Communities",
  "Activities Conducted",
  "Key Outcomes",
  "Partnerships and Collaborators",
  "Impact Stories",
];

export default function OurApproachPage() {
  return (
    <main className="landing landing-naturgeist">
      {/* ── Hero ── */}
      <section className="approach-hero">
        <div className="approach-hero-bg">
          <Image
            src="/images/project/sustainable.jpg"
            alt="NaturGeist community engagement"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
        <div className="approach-hero-overlay" aria-hidden />
        <div className="approach-hero-content">
          <span
            className="lp-section-label"
            style={{ color: "rgba(196,230,196,0.9)" }}
          >
            How We Work
          </span>
          <h1 className="approach-hero-title">Our Approach</h1>
          <p className="approach-hero-sub">
            We combine evidence, skills, and collective action to build
            resilient communities and sustainable futures.
          </p>
        </div>
      </section>

      {/* ── Approach Pillars ── */}
      <section className="approach-section approach-section-light">
        <div className="approach-inner">
          <div className="approach-pillars-header">
            <span className="lp-section-label">Our Approach</span>
            <h2 className="approach-section-title">
              How We Translate Vision Into Action
            </h2>
            <p className="approach-section-subtitle">
              Five interconnected pillars guide the way we design, deliver,
              and sustain our work.
            </p>
          </div>
          <div className="approach-pillars-grid">
            {APPROACH_PILLARS.map((pillar) => (
              <div key={pillar.title} className="approach-pillar-card">
                <div className="approach-pillar-icon">
                  <pillar.icon size={26} />
                </div>
                <h3 className="approach-pillar-title">{pillar.title}</h3>
                <p className="approach-pillar-text">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programmes & Projects ── */}
      <section className="approach-section approach-section-dark">
        <div className="approach-inner">
          <span
            className="lp-section-label"
            style={{ color: "rgba(196,230,196,0.85)" }}
          >
            Our Work On Ground
          </span>
          <h2
            className="approach-section-title"
            style={{ color: "#ffffff" }}
          >
            Programmes & Projects
          </h2>
          <p className="approach-programme-intro">
            This section will showcase our ongoing and completed initiatives
            in detail, including:
          </p>
          <div className="approach-programme-list">
            {PROGRAMME_HIGHLIGHTS.map((item) => (
              <div key={item} className="approach-programme-chip">
                <CheckCircle2 size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="approach-programme-note">
            Detailed programme profiles are being compiled and will be
            published here soon. In the meantime, explore our{" "}
            <Link href="/impact">Impact</Link> and{" "}
            <Link href="/events">Events</Link> pages for a glimpse of our
            ongoing work.
          </p>
        </div>
      </section>

      {/* ── Get Involved / Work With Us ── */}
      <section className="approach-section approach-section-light">
        <div className="approach-inner">
          <div className="approach-pillars-header">
            <span className="lp-section-label">Work With Us</span>
            <h2 className="approach-section-title">Get Involved</h2>
            <p className="approach-section-subtitle">
              There are many ways to stand with NaturGeist — choose what
              fits you best.
            </p>
          </div>

          <div className="approach-involve-grid">
            {/* Volunteer */}
            <div className="approach-involve-card">
              <div className="approach-involve-icon">
                <Heart size={26} />
              </div>
              <h3 className="approach-involve-title">Volunteer</h3>
              <p className="approach-involve-text">
                Contribute your skills, knowledge, and time to meaningful
                community initiatives.
              </p>
              <a
                href="mailto:naturgeistsociety@gmail.com"
                className="approach-involve-link"
              >
                <Mail size={16} />
                naturgeistsociety@gmail.com
              </a>
            </div>

            {/* Internships */}
            <div className="approach-involve-card">
              <div className="approach-involve-icon">
                <GraduationCap size={26} />
              </div>
              <h3 className="approach-involve-title">Internships</h3>
              <p className="approach-involve-text">
                Gain practical experience in research, programme
                development, communications, and community engagement.
              </p>
              <a
                href="mailto:naturgeistsociety@gmail.com"
                className="approach-involve-link"
              >
                <Mail size={16} />
                naturgeistsociety@gmail.com
              </a>
            </div>

            {/* Partnerships */}
            <div className="approach-involve-card">
              <div className="approach-involve-icon">
                <Building2 size={26} />
              </div>
              <h3 className="approach-involve-title">Partnerships</h3>
              <p className="approach-involve-text">
                Collaborate with us through CSR initiatives, academic
                partnerships, technical expertise, and joint programmes.
              </p>
              <Link href="/contact" className="approach-involve-link">
                Get in Touch
              </Link>
            </div>

            {/* Donations */}
            <div className="approach-involve-card">
              <div className="approach-involve-icon">
                <HandCoins size={26} />
              </div>
              <h3 className="approach-involve-title">Donations</h3>
              <p className="approach-involve-text">
                Support our mission to build resilient communities and
                sustainable futures.
              </p>
              <div className="lp-form-note">
                Bank Account Details — will be updated here soon.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Transparency & Governance ── */}
      <section className="approach-section approach-section-dark">
        <div className="approach-inner">
          <span
            className="lp-section-label"
            style={{ color: "rgba(196,230,196,0.85)" }}
          >
            Transparency & Governance
          </span>
          <h2 className="approach-section-title" style={{ color: "#ffffff" }}>
            Responsible & Transparent Governance
          </h2>
          <p className="approach-body approach-body-dark">
            NaturGeist is committed to responsible and transparent
            governance.
          </p>
          <div className="approach-governance-list">
            <div className="approach-governance-item">
              <span className="approach-governance-label">
                Registration Details
              </span>
              <span className="approach-governance-value">
                To be updated
              </span>
            </div>
            <div className="approach-governance-item">
              <span className="approach-governance-label">Darpan ID</span>
              <span className="approach-governance-value">
                To be updated
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
