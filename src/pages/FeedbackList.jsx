import { useState } from 'react';
import { useState, useEffect } from 'react';
import { feedbackAPI } from '../services/api';
import './FeedbackList.css';

const FeedbackList = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterRating, setFilterRating] = useState('all');

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'filled' : ''}`}
      >
        ★
      </span>
    ));
  };

  const sortFeedback = (data) => {
    return [...data].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'date':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const filterFeedback = (data) => {
    if (filterRating === 'all') return data;
    return data.filter(feedback => feedback.rating === parseInt(filterRating));
  };

  const sortedAndFilteredData = sortFeedback(filterFeedback(feedbackData));

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getAverageRating = () => {
    if (feedbackData.length === 0) return 0;
    const total = feedbackData.reduce((sum, feedback) => sum + feedback.rating, 0);
    return (total / feedbackData.length).toFixed(1);
  };

  const getRatingCount = (rating) => {
    return feedbackData.filter(feedback => feedback.rating === rating).length;
  };

  // Fetch feedback data from API
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const response = await feedbackAPI.getPublic();
        setFeedbackData(response.feedback);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setError('Failed to load feedback data');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  if (loading) {
    return (
      <div className="feedback-list-container">
        <div className="loading">Loading feedback data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feedback-list-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="feedback-list-container">
      <div className="list-header">
        <h1>Feedback Dashboard</h1>
        <p>View and analyze all submitted feedback</p>
      </div>

      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{feedbackData.length}</div>
            <div className="stat-label">Total Feedback</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{getAverageRating()}</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{getRatingCount(5)}</div>
            <div className="stat-label">5-Star Reviews</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{getRatingCount(1)}</div>
            <div className="stat-label">1-Star Reviews</div>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="filter-controls">
          <label htmlFor="rating-filter">Filter by Rating:</label>
          <select
            id="rating-filter"
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <div className="sort-controls">
          <label htmlFor="sort-by">Sort by:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
          </select>
          <button
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="feedback-table-container">
        {sortedAndFilteredData.length === 0 ? (
          <div className="no-feedback">
            <div className="no-feedback-icon">📝</div>
            <h3>No feedback found</h3>
            <p>There are no feedback entries matching your current filters.</p>
          </div>
        ) : (
          <div className="feedback-table">
            <div className="table-header">
              <div className="header-cell" onClick={() => handleSort('name')}>
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </div>
              <div className="header-cell" onClick={() => handleSort('rating')}>
                Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
              </div>
              <div className="header-cell">Message</div>
              <div className="header-cell" onClick={() => handleSort('date')}>
                Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </div>
            </div>

            <div className="table-body">
              {sortedAndFilteredData.map((feedback) => (
                <div key={feedback._id} className="table-row">
                  <div className="table-cell name-cell">
                    <div className="user-info">
                      <div className="user-avatar">
                        {feedback.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{feedback.name}</div>
                        {feedback.email && (
                          <div className="user-email">{feedback.email}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="table-cell rating-cell">
                    <div className="rating-display">
                      {renderStars(feedback.rating)}
                      <span className="rating-number">{feedback.rating}/5</span>
                    </div>
                  </div>
                  <div className="table-cell message-cell">
                    <div className="message-content">
                      {feedback.message.length > 100
                        ? `${feedback.message.substring(0, 100)}...`
                        : feedback.message}
                    </div>
                  </div>
                  <div className="table-cell date-cell">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackList; 