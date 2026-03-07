'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Heart, Leaf, Globe, Mail, MapPin, Briefcase, GraduationCap, Clock, ArrowRight } from 'lucide-react';

const OPEN_POSITIONS = [
  {
    title: 'Program Coordinator',
    type: 'Full-time',
    location: 'Delhi, India',
    department: 'Programs',
    description: 'Lead and coordinate community development programs focused on environmental sustainability and livelihood enhancement.',
  },
  {
    title: 'Research Associate',
    type: 'Full-time',
    location: 'Remote / Delhi',
    department: 'Research',
    description: 'Conduct field research on climate adaptation, gender equity, and community resilience across rural regions.',
  },
  {
    title: 'Communications Specialist',
    type: 'Full-time',
    location: 'Delhi, India',
    department: 'Communications',
    description: 'Create impactful content and manage outreach to amplify our mission and connect with stakeholders.',
  },
  {
    title: 'Field Officer',
    type: 'Contract',
    location: 'Multiple Locations',
    department: 'Operations',
    description: 'Work directly with communities to implement programs and gather ground-level insights.',
  },
];

const VOLUNTEER_OPPORTUNITIES = [
  {
    icon: Heart,
    title: 'Community Outreach',
    description: 'Help us connect with communities and spread awareness about sustainable practices.',
  },
  {
    icon: Leaf,
    title: 'Environmental Drives',
    description: 'Participate in tree plantation, clean-up drives, and conservation activities.',
  },
  {
    icon: GraduationCap,
    title: 'Skill Workshops',
    description: 'Share your expertise through workshops on livelihood skills and capacity building.',
  },
  {
    icon: Globe,
    title: 'Digital Volunteers',
    description: 'Support our digital presence through content creation, design, and social media.',
  },
];

const BENEFITS = [
  { title: 'Meaningful Impact', description: 'Work that directly benefits communities and the environment' },
  { title: 'Learning & Growth', description: 'Continuous opportunities for professional development' },
  { title: 'Collaborative Culture', description: 'Join a passionate team committed to positive change' },
  { title: 'Flexible Work', description: 'Remote-friendly policies with work-life balance' },
];

const VALUES = [
  { icon: Heart, label: 'Dignity-Centred', description: 'We believe in respect and agency for all' },
  { icon: Users, label: 'Community-Led', description: 'Working with communities, not for them' },
  { icon: Leaf, label: 'Sustainability', description: 'Long-term commitment over quick wins' },
  { icon: Globe, label: 'Inclusivity', description: 'Embracing diversity in all forms' },
];

export default function JoinUsPage() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeTab, setActiveTab] = useState<'careers' | 'volunteer' | 'internship'>('volunteer');

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
    <main className="join-page">
      {/* Hero Section */}
      <section className="join-hero">
        <div className="join-hero-bg">
          <Image
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1400&h=700&fit=crop"
            alt=""
            fill
            className="join-hero-bg-img"
            priority
            sizes="100vw"
          />
          <span className="join-hero-overlay" aria-hidden />
        </div>
        <div className="join-hero-content">
          <span className="join-hero-badge">Join Our Mission</span>
          <h1 className="join-hero-title">
            <span className="join-hero-line">Be Part of</span>
            <span className="join-hero-line join-hero-highlight">Something Meaningful</span>
          </h1>
          <p className="join-hero-subtitle">
            Join NaturGeist and work towards sustainable development that centers dignity, community, and care for people and planet.
          </p>
          <div className="join-hero-actions">
            {/* <a href="#opportunities" className="join-btn join-btn-primary">
              View Opportunities
              <ArrowRight size={18} />
            </a> */}
            <Link href="/contact" className="join-btn join-btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="join-why" ref={setRef(0)}>
        <div className="join-why-inner">
          <div className="join-why-text lp-reveal">
            <h2 className="join-section-title">Why Join NaturGeist?</h2>
            <p className="join-why-description">
              At NaturGeist, we believe that meaningful change requires passionate individuals who share our vision. 
              Whether you're looking for a career, volunteer opportunity, or internship, you'll find a supportive 
              environment where your contributions make a real difference.
            </p>
          </div>
          <div className="join-values-grid lp-reveal">
            {VALUES.map((value, index) => (
              <div key={value.label} className={`join-value-card lp-reveal lp-reveal-delay-${index}`}>
                <div className="join-value-icon">
                  <value.icon size={24} />
                </div>
                <h3 className="join-value-title">{value.label}</h3>
                <p className="join-value-desc">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="join-benefits" ref={setRef(1)}>
        <div className="join-benefits-inner">
          <div className="join-benefits-image lp-reveal">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=450&fit=crop"
              alt="Team collaboration"
              width={600}
              height={450}
              className="join-img"
            />
          </div>
          <div className="join-benefits-content lp-reveal lp-reveal-right">
            <h2 className="join-section-title">What We Offer</h2>
            <div className="join-benefits-list">
              {BENEFITS.map((benefit) => (
                <div key={benefit.title} className="join-benefit-item">
                  <div className="join-benefit-marker" />
                  <div>
                    <h3 className="join-benefit-title">{benefit.title}</h3>
                    <p className="join-benefit-desc">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="join-opportunities" id="opportunities" ref={setRef(2)}>
        <div className="join-opportunities-inner">
          <h2 className="join-section-title join-section-title-center lp-reveal">
            Explore Opportunities
          </h2>
          <p className="join-opportunities-subtitle lp-reveal">
            Find the right opportunity that matches your skills and passion
          </p>

          {/* Tabs */}
          <div className="join-tabs lp-reveal">
            {/* <button
              className={`join-tab ${activeTab === 'careers' ? 'join-tab-active' : ''}`}
              onClick={() => setActiveTab('careers')}
            >
              <Briefcase size={18} />
              Careers
            </button> */}
            <button
              className={`join-tab ${activeTab === 'volunteer' ? 'join-tab-active' : ''}`}
              onClick={() => setActiveTab('volunteer')}
            >
              <Heart size={18} />
              Volunteer
            </button>
            {/* <button
              className={`join-tab ${activeTab === 'internship' ? 'join-tab-active' : ''}`}
              onClick={() => setActiveTab('internship')}
            >
              <GraduationCap size={18} />
              Internship
            </button> */}
          </div>

          {/* Careers Content */}
          {activeTab === 'careers' && (
            <div className="join-careers-grid">
              {OPEN_POSITIONS.map((position, index) => (
                <div key={position.title} className={`join-position-card lp-reveal lp-reveal-delay-${index % 4}`}>
                  <div className="join-position-header">
                    <span className="join-position-dept">{position.department}</span>
                    <span className="join-position-type">{position.type}</span>
                  </div>
                  <h3 className="join-position-title">{position.title}</h3>
                  <p className="join-position-desc">{position.description}</p>
                  <div className="join-position-meta">
                    <span className="join-position-location">
                      <MapPin size={14} />
                      {position.location}
                    </span>
                    <Link href="/contact" className="join-position-apply">
                      Apply Now
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Volunteer Content */}
          {activeTab === 'volunteer' && (
            <div className="join-volunteer-section">
              <div className="join-volunteer-grid">
                {VOLUNTEER_OPPORTUNITIES.map((opp, index) => (
                  <div key={opp.title} className={`join-volunteer-card lp-reveal lp-reveal-delay-${index}`}>
                    <div className="join-volunteer-icon">
                      <opp.icon size={28} />
                    </div>
                    <h3 className="join-volunteer-title">{opp.title}</h3>
                    <p className="join-volunteer-desc">{opp.description}</p>
                  </div>
                ))}
              </div>
              {/* <div className="join-volunteer-cta lp-reveal">
                <p>Ready to make a difference? Register as a volunteer today.</p>
                <Link href="/contact" className="join-btn join-btn-primary">
                  Become a Volunteer
                  <ArrowRight size={18} />
                </Link>
              </div> */}
            </div>
          )}

          {/* Internship Content */}
          {activeTab === 'internship' && (
            <div className="join-internship-section lp-reveal">
              <div className="join-internship-card">
                <div className="join-internship-content">
                  <GraduationCap size={48} className="join-internship-icon" />
                  <h3 className="join-internship-title">Internship Program</h3>
                  <p className="join-internship-desc">
                    Our internship program offers students and young professionals hands-on experience 
                    in sustainable development, community engagement, research, and communications. 
                    Gain real-world skills while contributing to meaningful projects.
                  </p>
                  <div className="join-internship-details">
                    <div className="join-internship-detail">
                      <Clock size={16} />
                      <span>Duration: 3-6 months</span>
                    </div>
                    <div className="join-internship-detail">
                      <MapPin size={16} />
                      <span>Location: Delhi / Remote</span>
                    </div>
                    <div className="join-internship-detail">
                      <Briefcase size={16} />
                      <span>Stipend: Performance-based</span>
                    </div>
                  </div>
                  <Link href="/contact" className="join-btn join-btn-primary">
                    Apply for Internship
                    <ArrowRight size={18} />
                  </Link>
                </div>
                <div className="join-internship-image">
                  <Image
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&h=400&fit=crop"
                    alt="Interns working together"
                    width={500}
                    height={400}
                    className="join-img"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="join-cta" ref={setRef(3)}>
        <div className="join-cta-inner lp-reveal">
          <h2 className="join-cta-title">Ready to Join Us?</h2>
          <p className="join-cta-text">
            Take the first step towards a meaningful career. Send us your resume and tell us why you want to be part of NaturGeist.
          </p>
          <div className="join-cta-contact">
            <a href="mailto:careers@naturgeist.org" className="join-cta-email">
              <Mail size={20} />
              careers@naturgeist.org
            </a>
          </div>
          <div className="join-cta-buttons">
            <Link href="/contact" className="join-btn join-btn-light">
              Contact Us
            </Link>
            <Link href="/team" className="join-btn join-btn-outline">
              Meet Our Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
