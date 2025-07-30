import { useState } from 'react';
import './Admin.css';

const Admin = ({ feedbackData, deleteFeedback }) => {
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);

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

  const handleDeleteClick = (feedback) => {
    setFeedbackToDelete(feedback);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (feedbackToDelete) {
      deleteFeedback(feedbackToDelete.id);
      setShowDeleteModal(false);
      setFeedbackToDelete(null);
      setSelectedFeedback(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setFeedbackToDelete(null);
  };

  const getAverageRating = () => {
    if (feedbackData.length === 0) return 0;
    const total = feedbackData.reduce((sum, feedback) => sum + feedback.rating, 0);
    return (total / feedbackData.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbackData.forEach(feedback => {
      distribution[feedback.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage and moderate feedback submissions</p>
      </div>

      <div className="admin-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{feedbackData.length}</div>
            <div className="stat-label">Total Submissions</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{getAverageRating()}</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{ratingDistribution[5]}</div>
            <div className="stat-label">5-Star Reviews</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{ratingDistribution[1]}</div>
            <div className="stat-label">1-Star Reviews</div>
          </div>
        </div>
      </div>

      <div className="rating-distribution">
        <h3>Rating Distribution</h3>
        <div className="distribution-bars">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="distribution-bar">
              <div className="bar-label">{rating} ★</div>
              <div className="bar-container">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${feedbackData.length > 0 ? (ratingDistribution[rating] / feedbackData.length) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              <div className="bar-count">{ratingDistribution[rating]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="feedback-management">
        <h3>Feedback Management</h3>
        <div className="feedback-list">
          {feedbackData.length === 0 ? (
            <div className="no-feedback">
              <div className="no-feedback-icon">📝</div>
              <h3>No feedback to manage</h3>
              <p>There are no feedback submissions yet.</p>
            </div>
          ) : (
            feedbackData.map((feedback) => (
              <div key={feedback.id} className="feedback-item">
                <div className="feedback-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      {feedback.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                      <div className="user-name">{feedback.name}</div>
                      {feedback.email && (
                        <div className="user-email">{feedback.email}</div>
                      )}
                      <div className="feedback-date">
                        {new Date(feedback.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="feedback-rating">
                    {renderStars(feedback.rating)}
                    <span className="rating-number">{feedback.rating}/5</span>
                  </div>
                </div>
                
                <div className="feedback-content">
                  <p>{feedback.message}</p>
                </div>

                <div className="feedback-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedFeedback(selectedFeedback?.id === feedback.id ? null : feedback)}
                  >
                    {selectedFeedback?.id === feedback.id ? 'Hide Details' : 'View Details'}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteClick(feedback)}
                  >
                    Delete
                  </button>
                </div>

                {selectedFeedback?.id === feedback.id && (
                  <div className="feedback-details">
                    <h4>Feedback Details</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <strong>Submission ID:</strong> {feedback.id}
                      </div>
                      <div className="detail-item">
                        <strong>Submitted:</strong> {new Date(feedback.date).toLocaleString()}
                      </div>
                      <div className="detail-item">
                        <strong>Rating:</strong> {feedback.rating} out of 5 stars
                      </div>
                      {feedback.email && (
                        <div className="detail-item">
                          <strong>Contact:</strong> {feedback.email}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this feedback?</p>
              <div className="feedback-preview">
                <strong>{feedbackToDelete?.name}</strong> - {feedbackToDelete?.rating} stars
                <p>"{feedbackToDelete?.message.substring(0, 100)}..."</p>
              </div>
              <p className="warning">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin; 