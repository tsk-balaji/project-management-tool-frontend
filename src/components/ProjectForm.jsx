import React, { useState, useEffect } from "react";
import { Form, Button, Col, Row, Card, Spinner } from "react-bootstrap";
import PropTypes from "prop-types";

const ProjectForm = ({ initialValues, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialValues.title);
  const [deadline, setDeadline] = useState(initialValues.deadline);
  const [name, setName] = useState(initialValues.name || "");
  const [description, setDescription] = useState(
    initialValues.description || ""
  );
  const [teamMembers, setTeamMembers] = useState(
    initialValues.teamMembers || []
  );
  const [teamLeader, setTeamLeader] = useState(initialValues.teamLeader || "");
  const [tasks, setTasks] = useState(initialValues.tasks || []);
  const [assignedUsers, setAssignedUsers] = useState(
    initialValues.assignedUsers || []
  );
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await fetch(
          "https://project-management-tool-backend-cxpj.onrender.com/api/auth/users",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const usersData = await response.json();
        setUsers(usersData.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleTaskChange = (index, key, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][key] = value;
    setTasks(updatedTasks);
  };

  const handleAddSubtask = (taskIndex) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subtasks = updatedTasks[taskIndex].subtasks || [];
    updatedTasks[taskIndex].subtasks.push({
      subtaskTitle: "",
      subtaskDescription: "",
    });
    setTasks(updatedTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !deadline.trim() || !teamLeader.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsLoading(true); // Start loading
    const project = {
      title,
      deadline,
      name,
      description,
      teamMembers,
      teamLeader,
      tasks,
      assignedUsers,
    };

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Authentication token is missing.");
        return;
      }

      const response = await fetch(
        "https://project-management-tool-backend-cxpj.onrender.com/api/projects/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(project),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create project");
      }

      const savedProject = await response.json();
      alert("Project created successfully!");
      onSubmit(savedProject); // Notify parent
    } catch (error) {
      console.error("Error creating project:", error);
      alert(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow">
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Project Details</h4>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col sm={12} md={6}>
              <Form.Group controlId="formProjectTitle">
                <Form.Label className="fw-bold">Title</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="form-control-lg"
                />
              </Form.Group>
            </Col>

            <Col sm={12} md={6}>
              <Form.Group controlId="formProjectDeadline">
                <Form.Label className="fw-bold">Deadline</Form.Label>
                <Form.Control
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  className="form-control-lg"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formProjectName">
            <Form.Label className="fw-bold">Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control-lg"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProjectDescription">
            <Form.Label className="fw-bold">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control-lg"
            />
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Team Management</h4>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3" controlId="formProjectTeamLeader">
            <Form.Label className="fw-bold">Team Leader</Form.Label>
            <Form.Select
              value={teamLeader}
              onChange={(e) => setTeamLeader(e.target.value)}
              className="form-control-lg"
            >
              <option value="">Select Team Leader</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProjectTeamMembers">
            <Form.Label className="fw-bold">Team Members</Form.Label>
            <Form.Select
              multiple
              value={teamMembers}
              onChange={(e) =>
                setTeamMembers(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
              className="form-control-lg"
              style={{ height: "150px" }}
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Tasks</h4>
          <Button
            variant="light"
            onClick={() =>
              setTasks([...tasks, { title: "", description: "", subtasks: [] }])
            }
          >
            Add Task
          </Button>
        </Card.Header>
        <Card.Body>
          {tasks.map((task, index) => (
            <Card key={index} className="mb-3 border-secondary">
              <Card.Body>
                <Row className="mb-3">
                  <Col sm={12} md={6}>
                    <Form.Control
                      type="text"
                      placeholder="Task Title"
                      value={task.title}
                      onChange={(e) =>
                        handleTaskChange(index, "title", e.target.value)
                      }
                      className="form-control-lg"
                    />
                  </Col>
                  <Col sm={12} md={6}>
                    <Form.Control
                      as="textarea"
                      placeholder="Task Description"
                      value={task.description}
                      onChange={(e) =>
                        handleTaskChange(index, "description", e.target.value)
                      }
                      className="form-control-lg"
                    />
                  </Col>
                </Row>

                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="ms-4">
                    <h5 className="mb-3">Subtasks</h5>
                    {task.subtasks.map((subtask, subtaskIndex) => (
                      <Row key={subtaskIndex} className="mb-2">
                        <Col sm={12} md={6}>
                          <Form.Control
                            type="text"
                            placeholder="Subtask Title"
                            value={subtask.subtaskTitle}
                            onChange={(e) =>
                              handleTaskChange(index, "subtasks", [
                                ...task.subtasks.slice(0, subtaskIndex),
                                { ...subtask, subtaskTitle: e.target.value },
                                ...task.subtasks.slice(subtaskIndex + 1),
                              ])
                            }
                          />
                        </Col>
                        <Col sm={12} md={6}>
                          <Form.Control
                            type="text"
                            placeholder="Subtask Description"
                            value={subtask.subtaskDescription}
                            onChange={(e) =>
                              handleTaskChange(index, "subtasks", [
                                ...task.subtasks.slice(0, subtaskIndex),
                                {
                                  ...subtask,
                                  subtaskDescription: e.target.value,
                                },
                                ...task.subtasks.slice(subtaskIndex + 1),
                              ])
                            }
                          />
                        </Col>
                      </Row>
                    ))}
                  </div>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAddSubtask(index)}
                >
                  Add Subtask
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-between">
        <Button
          variant="primary"
          type="submit"
          className="btn-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Save Project"
          )}
        </Button>
        <Button
          variant="secondary"
          type="button"
          className="btn-lg"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
};

ProjectForm.propTypes = {
  initialValues: PropTypes.shape({
    title: PropTypes.string,
    deadline: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    teamMembers: PropTypes.array,
    teamLeader: PropTypes.string,
    tasks: PropTypes.array,
    assignedUsers: PropTypes.array,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

ProjectForm.defaultProps = {
  initialValues: {
    title: "",
    deadline: "",
    name: "",
    description: "",
    teamMembers: [],
    teamLeader: "",
    tasks: [],
    assignedUsers: [],
  },
};

export default ProjectForm;
