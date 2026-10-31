const API_BASE = '/api/courses';

// Fetch all courses
export const fetchCourses = async () => {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch courses');
  }
  const result = await response.json();
  return result.data || [];
};

// Create a new course
export const createCourse = async (courseData) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData)
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to create course');
  }
  return result.data;
};

// Update an existing course
export const updateCourse = async (id, courseData) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData)
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to update course');
  }
  return result.data;
};

// Delete a course
export const deleteCourse = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete course');
  }
  return result.data;
};
