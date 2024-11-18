// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Container, Button, Spinner, Alert, Card } from "react-bootstrap";
import axios from "axios";
import ProjectList from "../components/ProjectList";
import ProjectForm from "../components/ProjectForm";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authorization token is missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "https://project-management-tool-backend-cxpj.onrender.com/api/projects/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProjects(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddOrUpdateProject = (project) => {
    if (selectedProject) {
      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === selectedProject.id ? { ...p, ...project } : p
        )
      );
    } else {
      setProjects((prevProjects) => [
        ...prevProjects,
        { ...project, id: Date.now() },
      ]);
    }
    setSelectedProject(null);
    setIsFormVisible(false);
  };

  const handleEdit = (id) => {
    const projectToEdit = projects.find((p) => p.id === id);
    setSelectedProject(projectToEdit);
    setIsFormVisible(true);
  };

  const handleDelete = (id) => {
    setProjects((prevProjects) => prevProjects.filter((p) => p.id !== id));
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center shadow">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">
              <i className="fas fa-project-diagram me-2"></i>Projects
            </h2>
            <Button
              variant={isFormVisible ? "outline-secondary" : "primary"}
              onClick={handleAddProject}
              className="rounded-pill shadow-sm"
            >
              <i
                className={`fas ${isFormVisible ? "fa-times" : "fa-plus"} me-2`}
              ></i>
              {isFormVisible ? "Cancel" : "Add Project"}
            </Button>
          </div>

          {isFormVisible ? (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <ProjectForm
                  initialValues={
                    selectedProject || { title: "", category: "", deadline: "" }
                  }
                  onSubmit={handleAddOrUpdateProject}
                  onCancel={handleCancel}
                />
              </Card.Body>
            </Card>
          ) : Array.isArray(projects) && projects.length > 0 ? (
            <ProjectList
              projects={projects}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <Alert variant="info" className="text-center">
              <i className="fas fa-info-circle me-2"></i>
              No projects found. Click &quot;Add Project &quot; to create one.
            </Alert>
          )}

          {isFormVisible && (
            <div className="text-end mt-3">
              <Button
                variant="outline-secondary"
                onClick={handleCancel}
                className="rounded-pill"
              >
                <i className="fas fa-times me-2"></i>
                Cancel
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Projects;
