import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us – NaturGeist',
  description: 'Get in touch with NaturGeist Society for People and Planet.',
};

const ADDRESS = 'G-2/17 A, First Floor, Gali No-9, Sai Enclave Mohan Garden, Uttam Nagar, New Delhi-110059';
const MAP_QUERY = encodeURIComponent(ADDRESS);

const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/naturgeist-society-for-people-and-planet',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/naturgeist6?igsh=MTJmenQxOGs5MDFqcg==',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.35" cy="6.65" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <main className="page-content contact-us-page contact-us-no-scroll">
      <div className="contact-us-layout">
        <div className="contact-us-info">
          <h1 className="contact-us-title">CONTACT US-</h1>
          <p className="contact-us-intro">
            We welcome conversations, collaborations, and shared work.
          </p>
          <div className="contact-us-details">
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:naturgeistsociety@gmail.co">naturgeistsociety@gmail.com</a>
            </p>
            <p>
              <strong>Contact Number:</strong>{' '}
              <a href="tel:+918796791536">+91 8796791536</a>
            </p>
            <p>
              <strong>Location:</strong> {ADDRESS}
            </p>
          </div>
          <section className="contact-us-social">
            <h2 className="contact-us-partner-title">Follow us</h2>
            <div className="contact-us-social-links">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`NaturGeist on ${social.name}`}
                  className="contact-us-social-link"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </section>
          <section className="contact-us-partner">
            <h2 className="contact-us-partner-title">Partner with us</h2>
            <p className="contact-us-org-name">NaturGeist Society for People and Planet</p>
            <p className="contact-us-tagline">Care • Perseverance • People & Planet</p>
          </section>
        </div>
        <div className="contact-us-map-wrap">
          <iframe
            title="NaturGeist office location map"
            src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
            className="contact-us-map"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </main>
  );
}
