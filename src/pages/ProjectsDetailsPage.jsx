// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // For navigation
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "Open",
    priority: "Medium",
    dueDate: "",
  });

  const token = localStorage.getItem("authToken");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    } else {
      window.location.href = "/login";
    }
  }, [id, token]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        projectResponse,
        issuesResponse,
        allProjectsResponse,
        usersResponse,
      ] = await Promise.all([
        axios.get(
          `https://project-management-tool-backend-cxpj.onrender.com/api/projects/${id}`,
          config
        ),
        axios.get(
          "https://project-management-tool-backend-cxpj.onrender.com/api/issues",
          config
        ),
        axios.get(
          "https://project-management-tool-backend-cxpj.onrender.com/api/projects",
          config
        ),
        axios.get(
          "https://project-management-tool-backend-cxpj.onrender.com/api/auth/users",
          config
        ),
      ]);

      setProject(projectResponse.data);
      setIssues(issuesResponse.data.filter((issue) => issue.projectId === id));
      setAllProjects(allProjectsResponse.data);
      setUsers(usersResponse.data.users);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    try {
      const taskData = {
        ...newTask,
        projectId: id,
      };

      await axios.post(
        "https://project-management-tool-backend-cxpj.onrender.com/api/issues",
        taskData,
        config
      );

      fetchAllData(); // Refresh data
      setIsCreateTaskOpen(false);
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        status: "Open",
        priority: "Medium",
        dueDate: "",
      });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="container mt-4">
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {project && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>{project.title}</h1>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/projects")}
            >
              Back to Projects
            </button>
          </div>
          <p className="lead">{project.description}</p>
          <p>
            <strong>Deadline:</strong>{" "}
            {new Date(project.deadline).toLocaleDateString()}
          </p>
        </>
      )}

      <p>
        <strong>Total Projects:</strong> {allProjects.length}
      </p>

      <h5>Tasks</h5>
      {issues.length > 0 ? (
        issues.map((issue) => (
          <div
            key={issue._id}
            className={`card mb-3 ${
              issue.status === "Closed"
                ? "bg-success text-white"
                : issue.dueDate && new Date(issue.dueDate) < new Date()
                ? "bg-danger text-white"
                : ""
            }`}
          >
            <div className="card-body">
              <h5 className="card-title">{issue.title}</h5>
              <p className="card-text">{issue.description}</p>
              <div className="d-flex justify-content-between align-items-baseline">
                {issue.dueDate && (
                  <small>
                    <strong>Due Date:</strong>{" "}
                    {new Date(issue.dueDate).toLocaleDateString()}
                  </small>
                )}
                <Link
                  to={`/edit-issue/${issue._id}`}
                  className="btn btn-primary btn-sm"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No tasks found.</p>
      )}

      <button
        className="btn btn-info"
        onClick={() => setIsCreateTaskOpen(true)}
      >
        Create New Task
      </button>

      {/* Modal */}
      {isCreateTaskOpen && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Create New Task</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsCreateTaskOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="taskTitle" className="form-label">
                      Task Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="taskTitle"
                      placeholder="Enter task title"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="taskDescription" className="form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="taskDescription"
                      rows="3"
                      placeholder="Enter task description"
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="assignedTo" className="form-label">
                      Assign To
                    </label>
                    <select
                      className="form-select"
                      id="assignedTo"
                      value={newTask.assignedTo}
                      onChange={(e) =>
                        setNewTask({ ...newTask, assignedTo: e.target.value })
                      }
                    >
                      <option value="">Select a user</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="taskDueDate" className="form-label">
                      Due Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="taskDueDate"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsCreateTaskOpen(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateTask}
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
