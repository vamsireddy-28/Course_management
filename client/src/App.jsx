import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CourseCard from './components/CourseCard';
import CourseModal from './components/CourseModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { fetchCourses, createCourse, updateCourse, deleteCourse } from './services/api';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedCourseForEdit, setSelectedCourseForEdit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourseForDelete, setSelectedCourseForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch courses from database
  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCourses();
      setCourses(data);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError(err.message || 'Unable to connect to course server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedCourseForEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenUpdateModal = (course) => {
    setSelectedCourseForEdit(course);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedCourseForEdit(null);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedCourseForEdit) {
        const idToUpdate = selectedCourseForEdit._id || selectedCourseForEdit.id;
        const updated = await updateCourse(String(idToUpdate), formData);
        setCourses((prev) =>
          prev.map((c) =>
            String(c._id) === String(updated._id) || (c.id && String(c.id) === String(updated.id))
              ? updated
              : c
          )
        );
        showToast('Course updated successfully in MongoDB Atlas!');
      } else {
        const created = await createCourse(formData);
        setCourses((prev) => [created, ...prev]);
        showToast('New course created and saved to MongoDB Atlas!');
      }
      setIsFormModalOpen(false);
      setSelectedCourseForEdit(null);
    } catch (err) {
      console.error('Submission failed:', err);
      showToast(err.message || 'Operation failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDeleteModal = (course) => {
    setSelectedCourseForDelete(course);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCourseForDelete(null);
  };

  const handleConfirmDelete = async (courseId) => {
    setIsDeleting(true);
    try {
      await deleteCourse(String(courseId));
      setCourses((prev) =>
        prev.filter((c) => String(c._id) !== String(courseId) && String(c.id) !== String(courseId))
      );
      showToast('Course successfully deleted from MongoDB Atlas!');
      setIsDeleteModalOpen(false);
      setSelectedCourseForDelete(null);
    } catch (err) {
      console.error('Delete failed:', err);
      showToast(err.message || 'Failed to delete course.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar
        onCreateCourseClick={handleOpenCreateModal}
        totalCourses={courses.length}
      />

      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} className="toast-icon" />
          ) : (
            <AlertCircle size={18} className="toast-icon" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <main className="main-content">
        <div className="content-container">
          {loading && (
            <div className="loading-state">
              <Loader2 className="spinner-icon" size={36} />
              <p>Fetching courses from database...</p>
            </div>
          )}

          {!loading && error && (
            <div className="error-banner">
              <AlertCircle size={24} />
              <div>
                <h4>Connection Error</h4>
                <p>{error}</p>
                <button type="button" className="btn-retry" onClick={loadCourses}>
                  Retry Connection
                </button>
              </div>
            </div>
          )}

          {!loading && !error && courses.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-card">
                <h3>No Courses Found</h3>
                <p>Click below to create your first course in MongoDB.</p>
                <button
                  type="button"
                  className="btn-create-course inline-btn"
                  onClick={handleOpenCreateModal}
                >
                  Create Course
                </button>
              </div>
            </div>
          )}

          {!loading && !error && courses.length > 0 && (
            <div className="courses-grid" id="courses-grid">
              {courses.map((course) => (
                <CourseCard
                  key={course._id || course.id}
                  course={course}
                  onUpdate={handleOpenUpdateModal}
                  onDelete={handleOpenDeleteModal}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <CourseModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        initialData={selectedCourseForEdit}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        course={selectedCourseForDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default App;
