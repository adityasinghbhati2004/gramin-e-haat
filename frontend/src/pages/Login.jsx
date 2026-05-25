import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, verifyOtp } from '../api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await loginUser(email, password);
      if (res.requiresOtp) {
        setRequiresOtp(true);
        setError('');
      } else {
        onLogin(res);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.message && err.message.includes('requiresOtp')) {
          setRequiresOtp(true);
          setError('');
      } else if (err.message && err.message.includes('Account not verified')) {
          setRequiresOtp(true);
          setError('');
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const user = await verifyOtp(email, otp);
      onLogin(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'OTP Verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="auth-card">
          <h1 className="section-title">{requiresOtp ? 'Verify OTP' : 'Login'}</h1>
          
          {requiresOtp ? (
            <form onSubmit={handleOtpSubmit} className="auth-form">
              <p style={{ marginBottom: '20px', textAlign: 'center', color: 'var(--text-light)' }}>
                Your account is not verified. An OTP has been sent via SMS to your registered mobile number.
                Please check your phone.
              </p>
              <label className="auth-label">
                Enter 6-digit OTP
                <input
                  className="auth-input"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  required
                />
              </label>
              {error && <div className="auth-error">{error}</div>}
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Verifying...' : 'Verify & Sign In'}
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="auth-form">
                <label className="auth-label">
                  Email
                  <input
                    className="auth-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
                <label className="auth-label">
                  Password
                  <input
                    className="auth-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>
                {error && <div className="auth-error">{error}</div>}
                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
              <div className="auth-footer">
                New here? <Link to="/signup">Create an account</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
