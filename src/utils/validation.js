// Utility functions for validation

/**
 * Validate project data
 * @param {Object} project - Project object with title, category, and deadline
 * @returns {Object} - Validation result with isValid and errors
 */
export const validateProject = (project) => {
  const errors = {};

  if (!project.title || project.title.trim() === "") {
    errors.title = "Title is required.";
  }

  if (!project.category || project.category.trim() === "") {
    errors.category = "Category is required.";
  }

  if (!project.deadline || isNaN(Date.parse(project.deadline))) {
    errors.deadline = "A valid deadline is required.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
