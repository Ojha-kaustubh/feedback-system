import { Link } from 'react-router-dom';
import './Home.css';

const Home = ({ user }) => {
  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            {user ? `Welcome back, ${user.name || user.email}!` : 'Welcome to Our Feedback Collection System'}
          </h1>
          <p className="hero-subtitle">
            {user
              ? 'Ready to share more feedback? Your input helps us improve!'
              : 'Help us improve by sharing your valuable feedback. Your voice matters!'
            }
          </p>
          <div className="hero-buttons">
            {user ? (
              <>
                <Link to="/feedback" className="btn btn-primary">
                  Submit Feedback
                </Link>
                <Link to="/list" className="btn btn-secondary">
                  View Feedback
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-secondary">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Why Share Your Feedback?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Voice Your Opinion</h3>
              <p>Share your thoughts and experiences to help us understand your needs better.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Drive Improvements</h3>
              <p>Your feedback directly influences our product development and service enhancements.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Build Community</h3>
              <p>Join our community of users who are passionate about making our services better.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Fill Out the Form</h3>
              <p>Provide your name, rating, and detailed feedback message.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Submit Your Feedback</h3>
              <p>Click submit and your feedback will be instantly recorded.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Track Progress</h3>
              <p>View all feedback submissions and see how your input contributes to improvements.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <h2>Ready to Share Your Feedback?</h2>
          <p>Start making a difference today by submitting your first feedback.</p>
          <Link to="/feedback" className="btn btn-primary btn-large">
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 