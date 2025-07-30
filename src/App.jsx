import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FeedbackForm from './pages/FeedbackForm';
import FeedbackList from './pages/FeedbackList';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { authAPI } from './services/api';
import './App.css';

function App() {
  const [feedbackData, setFeedbackData] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      rating: 5,
      message: 'Excellent service! The team was very helpful and responsive.',
      date: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      rating: 4,
      message: 'Great experience overall. Would recommend to others.',
      date: '2024-01-14'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: '',
      rating: 3,
      message: 'Good service but could be improved in some areas.',
      date: '2024-01-13'
    }
  ]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  const addFeedback = (newFeedback) => {
    const feedback = {
      ...newFeedback,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setFeedbackData([feedback, ...feedbackData]);
  };

  const deleteFeedback = (id) => {
    setFeedbackData(feedbackData.filter(feedback => feedback.id !== id));
  };

  const toggleAdmin = () => {
    setIsAdmin(!isAdmin);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleSignup = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
  };

  // Check for existing token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authAPI.getProfile();
          setUser(userData);
          setIsAdmin(userData.isAdmin);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar
          isAdmin={isAdmin}
          toggleAdmin={toggleAdmin}
          user={user}
          onLogout={handleLogout}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route
              path="/feedback"
              element={<FeedbackForm addFeedback={addFeedback} user={user} />}
            />
            <Route
              path="/list"
              element={<FeedbackList />}
            />
            <Route
              path="/admin"
              element={
                isAdmin ?
                  <Admin feedbackData={feedbackData} deleteFeedback={deleteFeedback} /> :
                  <div className="unauthorized">
                    <h2>Access Denied</h2>
                    <p>Please enable admin mode to access this page.</p>
                  </div>
              }
            />
            <Route
              path="/login"
              element={<Login onLogin={handleLogin} />}
            />
            <Route
              path="/signup"
              element={<Signup onSignup={handleSignup} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
