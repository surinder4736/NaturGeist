import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us – NaturGeist',
  description: 'Get in touch with NaturGeist Society for People and Planet.',
};

const ADDRESS = 'G-2/17 A, First Floor, Gali No-9, Sai Enclave Mohan Garden, Uttam Nagar, New Delhi-110059';
const MAP_QUERY = encodeURIComponent(ADDRESS);

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
              <a href="mailto:naturgeistsociety@gmail.com">naturgeistsociety@gmail.com</a>
            </p>
            <p>
              <strong>Contact Number:</strong>{' '}
              <a href="tel:+919650887924">+91 9650887924</a>
            </p>
            <p>
              <strong>Location:</strong> {ADDRESS}
            </p>
          </div>
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
