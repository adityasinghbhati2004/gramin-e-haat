import { Link } from 'react-router-dom';
import '../index.css';

const HelpCenter = () => {
  const faqs = [
    { question: "How can I track my order?", answer: "You can track your order by going to your Dashboard > My Purchases and clicking the 'Track' button next to your order." },
    { question: "What is your return policy?", answer: "We accept returns within 7 days of delivery. You can request a return from your Dashboard." },
    { question: "How long does a refund take?", answer: "Refunds are processed within 5-7 business days after the returned item is received and inspected." },
    { question: "How can I sell my products here?", answer: "Create an account and select 'SELLER' role during signup. Complete your profile to start listing products." },
  ];

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Help Center</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <div className="card">
            <h3>Frequently Asked Questions</h3>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {faqs.map((faq, index) => (
                <div key={index} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>{faq.question}</h4>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card" style={{ height: 'fit-content' }}>
            <h3>Need More Help?</h3>
            <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>
              If you couldn't find the answer to your question, feel free to reach out to our support team.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/contact" className="btn btn-primary" style={{ textAlign: 'center' }}>Contact Support</Link>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '4px' }}>
                <p><strong>Email:</strong> support@graminehaat.com</p>
                <p><strong>Phone:</strong> +91 1800-123-4567</p>
                <p><strong>Hours:</strong> Mon - Fri, 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
