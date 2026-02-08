import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us – NaturGeist',
  description: 'Get in touch with NaturGeist Society for People and Planet.',
};

export default function ContactPage() {
  return (
    <main className="page-content contact-us-page">
      <div className="content-wrap contact-us-wrap">
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
            <strong>Location:</strong> G-2/17 A, First Floor, Gali No-9, Sai Enclave Mohan Garden, Uttam Nagar, New Delhi-110059
          </p>
        </div>

        <section className="contact-us-partner">
          <h2 className="contact-us-partner-title">Partner with us</h2>
          <p className="contact-us-org-name">NaturGeist Society for People and Planet</p>
          <p className="contact-us-tagline">Care • Perseverance • People & Planet</p>
        </section>

        <hr className="contact-us-divider" />

        <footer className="compact-footer">
          <p className="compact-footer-copy">
            © {new Date().getFullYear()} NaturGeist · <Link href="/causes">Causes</Link> · <Link href="/impact">Impact</Link> · <Link href="/contact">Contact</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
