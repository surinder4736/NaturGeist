'use client';

import { useState } from 'react';
import Image from 'next/image';

const GOVERNING_BODY = [
  {
    role: 'President',
    name: 'Dr. Vikash Kumar Thakur',
    description: 'Early Career Researcher',
    location: '-',
    image: '/images/team/vikash-kumar-thakur.jpg',
  },
  {
    role: 'Vice President',
    name: 'Ms. Subha Dogra',
    description: 'Gender Expert (South Asia) | Programme Monitoring & Evaluation',
    location: '-',
    image: '/images/team/subha-dogra.jpg',
  },
  {
    role: 'Secretary',
    name: 'Ms. Sameeksha Shukla',
    description: 'Research Scholar, Mental Health Expert',
    location: '-',
    image: '/images/team/sameeksha-shukla.jpg',
  },
  {
    role: 'Treasurer',
    name: 'Mr. Pravin Kumar Dixit',
    description: 'Business',
    location: '-',
    image: '/images/team/pravin-kumar-dixit.jpg',
  },
] as const;

const EXECUTIVE_MEMBERS = [
  { name: 'Mr. Abhishek Kumar', 
    description: 'Output Head - Communication', 
    location: '-' ,
    image: '/images/team/abhishek-kumar.jpg',
  },
  { name: 'Mr. Sandeep', description: 'Lawyer', location: '—',
    image: '/images/team/sandeep.jpg',
   },
  { name: 'Ms. Jyoti Puri', description: 'Banking & Finance Professional', location: '-',
    image: '/images/team/jyoti-puri.jpg',
   },
  { name: 'Mr. Santosh Kumar Singh', description: 'Finance Consultant', location: '-',
    image: '/images/team/santosh-kumar-singh.jpg',
   },
  { name: 'Ms. Minakshi Saini', description: 'Senior International Volleyball Coach', location: '-',
    image: '/images/team/minakshi-saini.jpg',
   },
] as const;

function TeamImage({ src, alt, id }: { src: string; alt: string; id: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="team-card-avatar">
      {!loaded && <div className="team-card-avatar-skeleton" aria-hidden="true" />}
      <Image 
        src={src} 
        alt={alt} 
        fill
        className={`team-card-avatar-image ${loaded ? 'team-card-avatar-loaded' : ''}`}
        loading="lazy" 
        quality={90}
        sizes="200px"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default function TeamPage() {
  return (
    <main className="page-content">
      <div className="content-wrap">
        <h1 className="content-title">Governing Body and Members</h1>
        <p className="content-lead">
          The people behind NaturGeist—dedicated to climate, circularity, and community.
        </p>

        <section className="team-section">
          <h2 className="team-section-title">Governing Body</h2>
          <div className="team-grid team-grid-governing">
            {GOVERNING_BODY.map((person) => (
              <div key={person.role} className="team-card team-card-governing">
                <TeamImage src={person.image} alt={person.name} id={person.role} />
                <span className="team-card-badge">{person.role}</span>
                <h3 className="team-card-name">{person.name}</h3>
                <p className="team-card-role">{person.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="team-section">
          <h2 className="team-section-title">Executive Members</h2>
          <div className="team-grid team-grid-executive">
            {EXECUTIVE_MEMBERS.map((person) => (
              <div key={person.name} className="team-card">
                <TeamImage src={person.image} alt={person.name} id={person.name} />
                <h3 className="team-card-name">{person.name}</h3>
                <p className="team-card-role">{person.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
