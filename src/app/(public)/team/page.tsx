import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Team – NaturGeist',
  description: 'Governing body and team behind NaturGeist.',
};

const GOVERNING_BODY = [
  {
    role: 'President',
    name: 'Dr. Vikash Kumar Thakur',
    description: 'Early Career Researcher',
    location: 'Bhagalpur, Bihar',
  },
  {
    role: 'Vice President',
    name: 'Ms. Subha Dogra',
    description: 'Gender Expert (South Asia) | Programme Monitoring & Evaluation',
    location: 'Jammu, Jammu & Kashmir',
  },
  {
    role: 'Secretary',
    name: 'Ms. Sameeksha Shukla',
    description: 'Research Scholar, Mental Health Expert',
    location: 'Varanasi, Uttar Pradesh',
  },
  {
    role: 'Treasurer',
    name: 'Mr. Pravin Kumar Dixit',
    description: 'Business',
    location: 'Saran, Bihar',
  },
] as const;

const EXECUTIVE_MEMBERS = [
  { name: 'Mr. Abhishek Kumar', description: 'Output Head - Communication', location: 'Ranchi, Jharkhand' },
  { name: 'Mr. Sandeep', description: 'Lawyer', location: '—' },
  { name: 'Ms. Jyoti Puri', description: 'Banking & Finance Professional', location: 'Mandi Gobindgarh, Punjab' },
  { name: 'Mr. Santosh Kumar Singh', description: 'Finance Consultant', location: 'Saran, Bihar' },
  { name: 'Ms. Minakshi Saini', description: 'Senior International Volleyball Coach', location: 'Gurgaon, Haryana' },
] as const;

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
                <div className="team-card-avatar" aria-hidden>
                  <span className="team-card-avatar-placeholder">Photo</span>
                </div>
                <span className="team-card-badge">{person.role}</span>
                <h3 className="team-card-name">{person.name}</h3>
                <p className="team-card-role">{person.description}</p>
                <p className="team-card-location">{person.location}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="team-section">
          <h2 className="team-section-title">Executive Members</h2>
          <div className="team-grid team-grid-executive">
            {EXECUTIVE_MEMBERS.map((person) => (
              <div key={person.name} className="team-card">
                <div className="team-card-avatar" aria-hidden>
                  <span className="team-card-avatar-placeholder">Photo</span>
                </div>
                <h3 className="team-card-name">{person.name}</h3>
                <p className="team-card-role">{person.description}</p>
                <p className="team-card-location">{person.location}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="content-cta">
          <Link href="/contact" className="link-button">Contact us</Link>
        </p>

        <footer className="compact-footer">
          <p className="compact-footer-copy">
            © {new Date().getFullYear()} NaturGeist · <Link href="/causes">Causes</Link> · <Link href="/impact">Impact</Link> · <Link href="/contact">Contact</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
