import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAdmin, toggleAdmin, user, onLogout }) => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-brand">
                    <Link to="/" className="nav-logo">
                        Feedback System
                    </Link>
                </div>

                <div className="nav-menu">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/feedback"
                        className={`nav-link ${location.pathname === '/feedback' ? 'active' : ''}`}
                    >
                        Submit Feedback
                    </Link>
                    <Link
                        to="/list"
                        className={`nav-link ${location.pathname === '/list' ? 'active' : ''}`}
                    >
                        View Feedback
                    </Link>
                    <Link
                        to="/admin"
                        className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                    >
                        Admin
                    </Link>
                </div>

                <div className="nav-admin">
                    {user ? (
                        <div className="user-section">
                            <span className="user-email">{user.email}</span>
                            <button
                                onClick={toggleAdmin}
                                className={`admin-toggle ${isAdmin ? 'active' : ''}`}
                            >
                                {isAdmin ? 'Admin Mode: ON' : 'Admin Mode: OFF'}
                            </button>
                            <button onClick={onLogout} className="logout-button">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="auth-link">
                                Login
                            </Link>
                            <Link to="/signup" className="auth-link signup">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                <div className="nav-toggle">
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 