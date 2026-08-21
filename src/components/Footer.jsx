import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Award, Smartphone } from 'lucide-react';

const FOOTER_COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About GlobeGo', to: '/' },
      { label: 'How the AI Planner Works', to: '/ai-planner' },
      { label: 'Careers & Team', to: '/' },
      { label: 'Investor Relations', to: '/' },
      { label: 'Press & Newsroom', to: '/' },
    ],
  },
  {
    title: 'Explore & Plan',
    links: [
      { label: 'AI Trip Planner', to: '/ai-planner' },
      { label: 'Flight Search & Booking', to: '/flights' },
      { label: 'Explore Destinations', to: '/explore' },
      { label: 'Group Trip & Splitter', to: '/group' },
      { label: 'Travel Wishlist', to: '/wishlist' },
      { label: 'Travel Preferences Engine', to: '/preferences' },
    ],
  },
  {
    title: 'Policies & Legal',
    links: [
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms & Conditions', to: '/' },
      { label: 'Cookie Preferences', to: '/' },
      { label: 'Accessibility Statement', to: '/' },
      { label: 'Your Privacy Choices', to: '/' },
    ],
  },
  {
    title: 'Help & Support',
    links: [
      { label: 'Customer Support 24/7', to: '/ai-planner' },
      { label: 'Cancel or Change Trip', to: '/dashboard' },
      { label: 'Member Rewards FAQs', to: '/stats' },
      { label: 'List Your Property', to: '/' },
      { label: 'Trust & Safety Guidelines', to: '/' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 32, marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="brand-icon-box">
              <Compass size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.25rem' }}>GlobeGo Group</div>
              <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Next-generation AI travel portal & itinerary planning engine</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', fontSize: '0.85rem' }}>
              <ShieldCheck size={18} color="#ffc72c" />
              <span>Verified Stays & Safe Bookings</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', fontSize: '0.85rem' }}>
              <Award size={18} color="#ffc72c" />
              <span>Member Price Guarantee</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', fontSize: '0.85rem' }}>
              <Smartphone size={18} color="#ffc72c" />
              <span>Instant AI Mobile Itineraries</span>
            </div>
          </div>
        </div>

        <div className="footer-columns-grid">
          {FOOTER_COLUMNS.map((col) => (
            <div className="footer-col" key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom-row">
          <span>© {new Date().getFullYear()} GlobeGo Group, Inc., an Expedia-style AI travel platform. All rights reserved.</span>
          <span>Security &amp; SSL Encrypted · Member Rewards Program</span>
        </div>
      </div>
    </footer>
  );
}
