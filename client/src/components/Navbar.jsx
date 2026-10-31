import React from 'react';
import { Plus, BookOpen } from 'lucide-react';

const Navbar = ({ onCreateCourseClick, totalCourses = 0 }) => {
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="brand-wrap">
          <div className="brand-logo">
            <BookOpen size={22} className="brand-icon" />
          </div>
          <div>
            <h1 className="brand-title">Course Management System</h1>
            <p className="brand-subtitle">
              {totalCourses} {totalCourses === 1 ? 'course' : 'courses'} available
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn-create-course"
            onClick={onCreateCourseClick}
            id="btn-create-course"
          >
            <Plus size={18} />
            <span>Create Course</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
