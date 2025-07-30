import { useState } from 'react';
import { feedbackAPI } from '../services/api';
import './FeedbackForm.css';

const FeedbackForm = ({ addFeedback, user }) => {
    const [formData, setFormData] = useState({
        name: user ? user.name || '' : '',
        email: user ? user.email || '' : '',
        rating: 0,
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (formData.rating === 0) {
            newErrors.rating = 'Please select a rating';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Feedback message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Feedback message must be at least 10 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleRatingClick = (rating) => {
        setFormData(prev => ({
            ...prev,
            rating
        }));

        if (errors.rating) {
            setErrors(prev => ({
                ...prev,
                rating: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                await feedbackAPI.create(formData);
                setIsSubmitted(true);
                setFormData({
                    name: user ? user.name || '' : '',
                    email: user ? user.email || '' : '',
                    rating: 0,
                    message: ''
                });
                setHoveredRating(0);

                // Reset submission status after 5 seconds
                setTimeout(() => {
                    setIsSubmitted(false);
                }, 5000);
            } catch (error) {
                console.error('Feedback submission error:', error);
                // You could add error handling here if needed
            }
        }
    };

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((star) => (
            <span
                key={star}
                className={`star ${star <= (hoveredRating || formData.rating) ? 'filled' : ''}`}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
            >
                ★
            </span>
        ));
    };

    if (isSubmitted) {
        return (
            <div className="feedback-form-container">
                <div className="success-message">
                    <div className="success-icon">✓</div>
                    <h2>Thank You!</h2>
                    <p>Your feedback has been submitted successfully. We appreciate your input!</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsSubmitted(false)}
                    >
                        Submit Another Feedback
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="feedback-form-container">
            <div className="form-header">
                <h1>Share Your Feedback</h1>
                <p>Help us improve by sharing your thoughts and experiences with us.</p>
            </div>

            <form className="feedback-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={errors.name ? 'error' : ''}
                        placeholder="Enter your name"
                    />
                    {user && <small className="user-info">Pre-filled from your account (you can edit if needed)</small>}
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email {user ? '' : '(Optional)'}</label>
                                         <input
                         type="email"
                         id="email"
                         name="email"
                         value={formData.email}
                         onChange={handleInputChange}
                         className={errors.email ? 'error' : ''}
                         placeholder="Enter your email address"
                     />
                     {user && <small className="user-info">Pre-filled from your account (you can edit if needed)</small>}
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label>Rating *</label>
                    <div className="rating-container">
                        <div className="stars">
                            {renderStars()}
                        </div>
                        <span className="rating-text">
                            {formData.rating > 0 ? `${formData.rating} out of 5 stars` : 'Select a rating'}
                        </span>
                    </div>
                    {errors.rating && <span className="error-message">{errors.rating}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="message">Feedback Message *</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className={errors.message ? 'error' : ''}
                        placeholder="Please share your detailed feedback, suggestions, or experiences..."
                        rows="6"
                    />
                    <div className="char-count">
                        {formData.message.length}/500 characters
                    </div>
                    {errors.message && <span className="error-message">{errors.message}</span>}
                </div>

                <button type="submit" className="btn btn-primary btn-submit">
                    Submit Feedback
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm; 