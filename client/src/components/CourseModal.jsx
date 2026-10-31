import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Star, DollarSign, Link as LinkIcon, AlertCircle } from 'lucide-react';

const CourseModal = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) => {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    rating: 4.8,
    amount: '',
    buyNowLink: '',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState('');
  const [imageUploadType, setImageUploadType] = useState('upload');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        shortDescription: initialData.shortDescription || initialData.description || '',
        rating: initialData.rating !== undefined ? initialData.rating : 4.8,
        amount: initialData.amount !== undefined ? initialData.amount : (initialData.price || ''),
        buyNowLink: initialData.buyNowLink || '',
        image: initialData.image || ''
      });
      setImagePreview(initialData.image || '');
      setImageUploadType(initialData.image && initialData.image.startsWith('data:') ? 'upload' : 'url');
    } else {
      setFormData({
        title: '',
        shortDescription: '',
        rating: 4.8,
        amount: '',
        buyNowLink: '',
        image: ''
      });
      setImagePreview('');
      setImageUploadType('upload');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData((prev) => ({ ...prev, image: reader.result }));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, image: url }));
    setImagePreview(url);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.image.trim()) {
      setError('Course image is required. Upload an image or provide a link.');
      return;
    }
    if (!formData.title.trim()) {
      setError('Course title is required.');
      return;
    }
    if (!formData.shortDescription.trim()) {
      setError('Short description is required.');
      return;
    }
    if (formData.rating === '' || isNaN(formData.rating) || Number(formData.rating) < 0 || Number(formData.rating) > 5) {
      setError('Please provide a valid rating between 0 and 5.');
      return;
    }
    if (formData.amount === '' || isNaN(formData.amount) || Number(formData.amount) < 0) {
      setError('Please provide a valid positive amount.');
      return;
    }
    if (!formData.buyNowLink.trim()) {
      setError('Buy Now link is required.');
      return;
    }

    onSubmit({
      ...formData,
      rating: Number(formData.rating),
      amount: Number(formData.amount)
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {isEditing ? 'Update Course' : 'Create Course'}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="modal-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">
              Course Image <span className="required-star">*</span>
            </label>

            <div className="image-type-toggle">
              <button
                type="button"
                className={`toggle-tab ${imageUploadType === 'upload' ? 'active' : ''}`}
                onClick={() => setImageUploadType('upload')}
              >
                <Upload size={14} />
                <span>Upload Image</span>
              </button>
              <button
                type="button"
                className={`toggle-tab ${imageUploadType === 'url' ? 'active' : ''}`}
                onClick={() => setImageUploadType('url')}
              >
                <ImageIcon size={14} />
                <span>Image URL</span>
              </button>
            </div>

            {imageUploadType === 'upload' ? (
              <div className="image-dropzone">
                <input
                  type="file"
                  id="course-image-input"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="file-input-hidden"
                />
                <label htmlFor="course-image-input" className="dropzone-label">
                  <Upload size={24} className="dropzone-icon" />
                  <span className="dropzone-text">Click to choose an image file</span>
                  <span className="dropzone-hint">PNG, JPG, WEBP (Max 5MB)</span>
                </label>
              </div>
            ) : (
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleImageUrlChange}
                placeholder="https://images.unsplash.com/..."
                className="form-input"
              />
            )}

            {imagePreview && (
              <div className="image-preview-box">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="preview-img"
                  onError={() => setError('Unable to load image from provided source')}
                />
                <span className="preview-label">Image Preview</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="field-title">
              Course Title <span className="required-star">*</span>
            </label>
            <input
              id="field-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Modern Full Stack Development"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="field-description">
              Short Description <span className="required-star">*</span>
            </label>
            <textarea
              id="field-description"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              placeholder="Brief course summary..."
              className="form-textarea"
              rows={3}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="field-rating">
                Course Rating (0.0 - 5.0) <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <Star size={16} className="input-icon text-amber" />
                <input
                  id="field-rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  placeholder="4.8"
                  className="form-input has-icon"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="field-amount">
                Course Amount <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <DollarSign size={16} className="input-icon" />
                <input
                  id="field-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="49.99"
                  className="form-input has-icon"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="field-buynow">
              Buy Now Link <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <LinkIcon size={16} className="input-icon" />
              <input
                id="field-buynow"
                type="url"
                name="buyNowLink"
                value={formData.buyNowLink}
                onChange={handleInputChange}
                placeholder="https://example.com/checkout/course"
                className="form-input has-icon"
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-submit"
              disabled={isSubmitting}
              id="submit-course-btn"
            >
              {isSubmitting 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Course' : 'Create Course')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;
