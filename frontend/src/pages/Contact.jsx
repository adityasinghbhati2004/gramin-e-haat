import { useState } from 'react';
import { createComplaint } from '../api';

const Contact = ({ user }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!user) {
      setError('Please log in to submit a complaint.');
      return;
    }
    if (!subject.trim() || !message.trim()) {
      setError('Subject and message are required.');
      return;
    }
    try {
      await createComplaint({ userId: user.id, subject, message });
      setSubject('');
      setMessage('');
      setSuccess('Submitted successfully.');
    } catch (err) {
      setError(err.message || 'Failed to submit');
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Contact & Complaints</h1>
        <form className="form-card" onSubmit={handleSubmit}>
          <label className="auth-label">
            Subject
            <input className="auth-input" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </label>
          <label className="auth-label">
            Message
            <textarea className="auth-input" rows="4" value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
          {error && <div className="auth-error">{error}</div>}
          {success && <div style={{ color: 'var(--success)' }}>{success}</div>}
          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
