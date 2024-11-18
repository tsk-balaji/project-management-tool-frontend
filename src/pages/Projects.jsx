// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (token) {
      fetchProjects();
    } else {
      window.location.href = "/login";
    }
  }, [token]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        "https://project-management-tool-backend-cxpj.onrender.com/api/projects",
        config
      );
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleEditClick = (projectId) => {
    navigate(`/edit-project/${projectId}`);
  };

  const handleNewProjectChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://project-management-tool-backend-cxpj.onrender.com/api/projects",
        newProject,
        config
      );
      setProjects((prevProjects) => [response.data.project, ...prevProjects]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="container mt-5">
      {/* Dashboard and Add Project Buttons */}
      <h1 className="text-center mb-4"> Projects </h1>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button
            className="btn btn-outline-secondary btn-lg shadow-sm"
            onClick={() => navigate("/dashboard")}
          >
            <i className="fas fa-tachometer-alt me-2"></i>
            Dashboard
          </button>
        </div>
        <button
          className="btn btn-primary btn-lg shadow-sm"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Add New Project
        </button>
      </div>

      {/* Project List */}
      <div className="row g-4">
        {projects.map((project) => (
          <div key={project._id} className="col-md-4">
            <div className="card h-100 shadow-sm hover-shadow transition">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-primary mb-3">
                  {project.title}
                </h5>
                <p className="card-text flex-grow-1">{project.description}</p>
                <div className="mt-3">
                  <p className="text-muted mb-3">
                    <i className="far fa-calendar-alt me-2"></i>
                    <strong>Deadline:</strong>{" "}
                    {new Date(project.deadline).toLocaleDateString()}
                  </p>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary flex-grow-1"
                      onClick={() => handleProjectClick(project._id)}
                    >
                      <i className="fas fa-arrow-right me-2"></i>
                      View Project
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => handleEditClick(project._id)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Create New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <form onSubmit={handleAddProject}>
            <div className="mb-3">
              <label className="form-label fw-bold">Project Title</label>
              <input
                type="text"
                className="form-control form-control-lg"
                name="title"
                value={newProject.title}
                onChange={handleNewProjectChange}
                placeholder="Enter project title"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea
                className="form-control"
                name="description"
                rows="4"
                value={newProject.description}
                onChange={handleNewProjectChange}
                placeholder="Enter project description"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold">Deadline</label>
              <input
                type="date"
                className="form-control"
                name="deadline"
                value={newProject.deadline}
                onChange={handleNewProjectChange}
              />
            </div>
            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="light"
                onClick={() => setShowAddModal(false)}
                size="lg"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" size="lg">
                Create Project
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
