import {
  FETCH_PROJECTS,
  ADD_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
} from "../constants/projectConstants";

// Fetch projects action
export const fetchProjects = () => async (dispatch) => {
  try {
    const projects = [
      {
        id: 1,
        title: "Website Redesign",
        category: "Web Development",
        deadline: "2024-12-01",
      },
      {
        id: 2,
        title: "Mobile App",
        category: "App Development",
        deadline: "2025-01-15",
      },
    ]; // Replace with API call if needed
    dispatch({ type: FETCH_PROJECTS, payload: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};

// Add project action
export const addProject = (project) => async (dispatch) => {
  try {
    dispatch({ type: ADD_PROJECT, payload: { ...project, id: Date.now() } });
  } catch (error) {
    console.error("Error adding project:", error);
  }
};

// Update project action
export const updateProject = (projectId, updatedData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROJECT, payload: { projectId, updatedData } });
  } catch (error) {
    console.error("Error updating project:", error);
  }
};

// Delete project action
export const deleteProject = (projectId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PROJECT, payload: projectId });
  } catch (error) {
    console.error("Error deleting project:", error);
  }
};
