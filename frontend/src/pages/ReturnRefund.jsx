import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCcw, DollarSign, Clock, CheckCircle } from 'lucide-react';

const ReturnRefund = () => {
  return (
    <div className="section" style={{ minHeight: '80vh', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
          <ArrowLeft size={18} />
          Back to Home
        </Link>
        
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 className="section-title" style={{ marginBottom: '1rem' }}>Returns & Refunds</h1>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
              We want you to be completely satisfied with your purchase. Here is our policy on returns and refunds.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', padding: '12px', backgroundColor: '#e0f2fe', color: '#0284c7', borderRadius: '50%', marginBottom: '1rem' }}>
                <Clock size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>7-Day Returns</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>You have 7 days from delivery to initiate a return.</p>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', padding: '12px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '50%', marginBottom: '1rem' }}>
                <RefreshCcw size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Easy Process</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Initiate returns directly from your dashboard.</p>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', padding: '12px', backgroundColor: '#fef3c7', color: '#d97706', borderRadius: '50%', marginBottom: '1rem' }}>
                <DollarSign size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Fast Refunds</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Refunds processed within 3-5 business days.</p>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>How to Initiate a Return</h2>
            <ol style={{ paddingLeft: '1.5rem', color: 'var(--text-color)', lineHeight: '1.8' }}>
              <li>Log in to your account and go to your <strong>Dashboard</strong>.</li>
              <li>Navigate to the <strong>Orders</strong> section.</li>
              <li>Find the order you wish to return and click <strong>Return Item</strong>.</li>
              <li>Select the reason for return and submit your request.</li>
              <li>Pack the item securely and hand it over to our pickup agent.</li>
            </ol>
          </div>

          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>Eligibility Criteria</h2>
            <ul style={{ paddingLeft: 0, color: 'var(--text-color)', lineHeight: '1.8', listStyleType: 'none', margin: 0 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '0.5rem' }}>
                <CheckCircle size={18} color="#16a34a" style={{ marginTop: '4px', flexShrink: 0 }} />
                <span>Items must be unused, unwashed, and in their original condition.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '0.5rem' }}>
                <CheckCircle size={18} color="#16a34a" style={{ marginTop: '4px', flexShrink: 0 }} />
                <span>Original tags, packaging, and accessories must be intact.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '0.5rem' }}>
                <CheckCircle size={18} color="#16a34a" style={{ marginTop: '4px', flexShrink: 0 }} />
                <span>Certain categories like perishable goods, personal care items, and custom-made products are non-returnable.</span>
              </li>
            </ul>
          </div>
          
          <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#fff7ed', borderLeft: '4px solid #ea580c', borderRadius: '4px' }}>
            <h4 style={{ color: '#ea580c', marginBottom: '0.5rem' }}>Need Further Assistance?</h4>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', margin: 0 }}>
              If you have any questions or face issues with your return, please contact our support team via the <Link to="/contact" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>Contact Us</Link> page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefund;
