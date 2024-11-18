// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams and useNavigate
import { Modal, Button, Spinner } from "react-bootstrap"; // Import Bootstrap Modal, Button, and Spinner components

const EditProjectPage = () => {
  const { id } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State to control the delete confirmation modal
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const navigate = useNavigate(); // Hook for navigation

  const token = localStorage.getItem("authToken");

  // Redirect to login if no token is found
  if (!token) {
    window.location.href = "/login";
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch project details on component load
  useEffect(() => {
    if (id) {
      fetchProject();
    } else {
      setError("Invalid project ID");
    }
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    setError(""); // Reset error
    try {
      const response = await axios.get(
        `https://project-management-tool-backend-cxpj.onrender.com/api/projects/${id}`,
        config
      );
      setProject(response.data);
    } catch (error) {
      setError("Error fetching project details. Please try again.");
      console.error("Error fetching project details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error
    try {
      const response = await axios.put(
        `https://project-management-tool-backend-cxpj.onrender.com/api/projects/${id}`,
        project,
        config
      );
      console.log(response.data.message);

      // Ensure `id` is available before navigating
      if (id) {
        navigate(`/project/${id}`); // Redirect to the project details page
      } else {
        setError("Project ID not found.");
      }
    } catch (error) {
      setError("Error updating project. Please try again.");
      console.error("Error updating project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  // Function to handle project deletion
  const handleDelete = async () => {
    setLoading(true);
    setError(""); // Reset error
    try {
      await axios.delete(
        `https://project-management-tool-backend-cxpj.onrender.com/api/projects/${id}`,
        config
      );
      navigate("/projects"); // Redirect to the projects list after deletion
    } catch (error) {
      setError("Error deleting project. Please try again.");
      console.error("Error deleting project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Edit Project</h1>
      {loading && (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={project.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              name="description"
              rows="3"
              value={project.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Deadline</label>
            <input
              type="date"
              className="form-control"
              name="deadline"
              value={project.deadline}
              onChange={handleChange}
            />
          </div>
          <div className="mt-3">
            <button className="btn btn-success" type="submit">
              Save Changes
            </button>
            <button
              className="btn btn-danger ml-2"
              type="button"
              onClick={() => setShowDeleteModal(true)} // Show confirmation modal
            >
              Delete Project
            </button>
          </div>
        </form>
      )}

      {/* Modal for deletion confirmation */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this project?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete} // Call handleDelete function when confirmed
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditProjectPage;
