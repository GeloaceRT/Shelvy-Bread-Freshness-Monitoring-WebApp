import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, Leaf, BarChart3, Star, Circle } from 'lucide-react';
import './LoginPage.css';

const LoginPage = ({ onLogin, onNavigateToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) {
      onLogin(formData.email, formData.password, rememberMe);
    }
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (onNavigateToSignup) {
      onNavigateToSignup();
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log('Forgot password clicked');
  };

  return (
    <div className="page-frame">
      <div className="login-page">
      {/* Left Side - Hero Section */}
      <div className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            {/* Brand Header */}
            <div className="brand-header">
              <div className="brand-icon">
                <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.80116 8.08428C8.90741 6.20194 10.5826 4.42788 12.7011 2.86388L12.9249 2.86237L14.7651 2.86133M10.3136 3.18958C10.4956 3.15275 10.6791 3.11933 10.864 3.08938C15.7577 5.15431 19.5496 8.1177 21.5327 11.4179M18.2471 2.86133L19.0816 2.86225C19.5229 2.86224 19.9598 2.88253 20.3907 2.92219C22.4719 4.47252 24.1188 6.22561 25.211 8.08428M12.0843 11.4179C14.0252 8.19889 17.6987 5.3014 22.4408 3.24977C22.6498 3.29372 22.8566 3.34271 23.0613 3.39605M31.1763 11.9866L31.569 13.5051C32.4101 16.7578 30.455 20.0764 27.2024 20.9175C26.705 21.0461 26.1934 21.1112 25.6796 21.1112L6.92057 21.1117C3.56091 21.1117 0.837219 18.3882 0.837219 15.0286C0.837219 14.5148 0.902295 14.003 1.03092 13.5055L1.4235 11.9873C2.81254 6.61536 7.65883 2.86272 13.2075 2.86242H19.3926C24.9411 2.86242 29.7874 6.61476 31.1763 11.9866Z" fill="white"/>
                </svg>
              </div>
              <h1 className="brand-title">Shelvy</h1>
              <p className="brand-description">Welcome back to your bakery dashboard</p>
            </div>

            {/* Features */}
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <Leaf size={18} />
                </div>
                <span>Real-time freshness tracking</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Sparkles size={18} />
                </div>
                <span>Reduce waste by 40%</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <BarChart3 size={16} />
                </div>
                <span>Analytics dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="form-section">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Welcome back!</h2>
            <p className="form-subtitle">Sign in to monitor your bread quality</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-field">
              <label className="field-label">📧 Email Address</label>
              <div className="input-container">
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-field">
              <label className="field-label">🔒 Password</label>
              <div className="input-container password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input password-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="form-options">
              <div className="remember-me-container">
                <button
                  type="button"
                  className={`custom-checkbox ${rememberMe ? 'checked' : ''}`}
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  {rememberMe && <div className="checkbox-indicator"></div>}
                </button>
                <label className="remember-me-label">Remember me</label>
              </div>
              <a href="#" className="forgot-password-link" onClick={handleForgotPassword}>
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-button">
              🔑 Sign In
            </button>

            {/* Divider */}
            <div className="form-divider">
              <span>or</span>
            </div>

            {/* Sign Up Link */}
            <div className="signup-link-container">
              <p className="signup-text">
                New to Shelvy?{' '}
                <a href="#" className="signup-link" onClick={handleCreateAccount}>Create an account</a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="decorative-elements">
        <Star className="decorative-star star-1" size={24} />
        <Circle className="decorative-circle circle-1" size={16} />
        <Star className="decorative-star star-2" size={20} />
      </div>
      </div>
    </div>
  );
};

export default LoginPage;
