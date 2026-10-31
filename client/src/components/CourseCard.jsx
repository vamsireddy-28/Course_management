import React from 'react';
import { Star, ExternalLink, Edit3, Trash2 } from 'lucide-react';

const CourseCard = ({ course, onUpdate, onDelete }) => {
  const { 
    image, 
    title, 
    shortDescription, 
    description, 
    rating, 
    amount, 
    price, 
    currency = 'INR',
    buyNowLink,
    buttonText = 'Buy Now'
  } = course;

  const descText = shortDescription || description || '';
  const numAmount = amount !== undefined ? amount : price;
  const currencySymbol = currency === 'INR' ? '₹' : (currency === 'USD' ? '$' : `${currency} `);
  const formattedAmount = typeof numAmount === 'number'
    ? `${currencySymbol}${numAmount.toLocaleString()}`
    : `${currencySymbol}${numAmount || 0}`;

  return (
    <div className="course-card" id={`course-card-${course._id || course.id}`}>
      {/* 1. Course Image */}
      <div className="card-image-wrapper">
        <img
          src={image}
          alt={title}
          className="card-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
          }}
        />
        <div className="card-badge-rating">
          <Star className="star-icon" size={13} fill="#F59E0B" stroke="#F59E0B" />
          <span>{Number(rating).toFixed(1)}</span>
        </div>
      </div>

      <div className="card-content">
        {/* 2. Course Title */}
        <h3 className="card-title" title={title}>
          {title}
        </h3>

        {/* 3. Short Description */}
        <p className="card-description" title={descText}>
          {descText}
        </p>

        {/* 4. Rating & 5. Amount */}
        <div className="card-meta-row">
          <div className="meta-left">
            <span className="price-label">Price</span>
          </div>
          <div className="meta-right">
            <div className="card-rating-inline">
              <Star className="star-icon" size={14} fill="#F59E0B" stroke="#F59E0B" />
              <span className="rating-value">{Number(rating).toFixed(1)}</span>
            </div>
            <div className="card-amount">
              {formattedAmount}
            </div>
          </div>
        </div>

        {/* 6. Buy Now & Management Buttons */}
        <div className="card-footer">
          <a
            href={buyNowLink && buyNowLink !== '#' ? buyNowLink : undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-buy-now"
            id={`btn-buynow-${course._id || course.id}`}
            onClick={(e) => {
              if (!buyNowLink || buyNowLink === '#') {
                e.preventDefault();
                alert(`Proceeding to checkout for "${title}"!`);
              }
            }}
          >
            <span>{buttonText}</span>
            <ExternalLink size={13} />
          </a>

          <div className="card-admin-actions">
            <button
              type="button"
              className="btn-action btn-update"
              onClick={() => onUpdate(course)}
              title="Update Course"
              id={`btn-update-${course._id || course.id}`}
            >
              <Edit3 size={13} />
              <span>Update Course</span>
            </button>
            <button
              type="button"
              className="btn-action btn-delete"
              onClick={() => onDelete(course)}
              title="Delete Course"
              id={`btn-delete-${course._id || course.id}`}
            >
              <Trash2 size={13} />
              <span>Delete Course</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
