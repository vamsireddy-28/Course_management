import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, course, isDeleting }) => {
  if (!isOpen || !course) return null;

  const targetId = course._id ? String(course._id) : String(course.id);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-container delete-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="modal-header">
          <div className="delete-header-icon-wrap">
            <AlertTriangle className="delete-warning-icon" size={22} />
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="delete-body">
          <h3 id="delete-dialog-title" className="delete-title">
            Delete Course Confirmation
          </h3>
          <p className="delete-message">
            Are you sure you want to permanently delete <strong>"{course.title}"</strong>?
          </p>
          <p className="delete-subtext">
            This action will delete the course from your MongoDB database immediately and cannot be undone.
          </p>
        </div>

        <div className="modal-actions delete-actions">
          <button
            type="button"
            className="btn-modal-cancel"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger-confirm"
            onClick={() => onConfirm(targetId)}
            disabled={isDeleting}
            id="confirm-delete-button"
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Deleting...' : 'Delete Course'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
