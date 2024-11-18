// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditIssuePage = () => {
  const { issueId } = useParams(); // Get the issue ID from the URL params
  const [issue, setIssue] = useState(null);
  const [editedTask, setEditedTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "Open",
    priority: "Medium",
    dueDate: "",
  });
  const [users, setUsers] = useState([]); // To store the list of users for assignment
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate(); // For navigation back to project details page
  const token = localStorage.getItem("authToken");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (token) {
      fetchIssueDetails();
      fetchUsers(); // Fetch users for assignment dropdown
    } else {
      window.location.href = "/login";
    }
  }, [issueId, token]);

  const fetchIssueDetails = async () => {
    try {
      const response = await axios.get(
        `https://project-management-tool-backend-cxpj.onrender.com/api/issues/${issueId}`,
        config
      );
      setIssue(response.data);
      setEditedTask({
        title: response.data.title,
        description: response.data.description,
        assignedTo: response.data.assignedTo,
        status: response.data.status,
        priority: response.data.priority,
        dueDate: response.data.dueDate || "",
      });
    } catch (error) {
      console.error("Error fetching issue details:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://project-management-tool-backend-cxpj.onrender.com/api/auth/users",
        config
      );
      setUsers(response.data.users); // Set the list of users for the dropdown
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUpdateTask = async () => {
    try {
      const updatedIssueData = {
        ...editedTask,
      };

      const response = await axios.put(
        `https://project-management-tool-backend-cxpj.onrender.com/api/issues/${issueId}`,
        updatedIssueData,
        config
      );
      console.log(response.data.message);

      // Get projectId from issue state since it's not in response
      if (issue && issue.projectId) {
        navigate(`/project/${issue.projectId}`);
      } else {
        console.error("No projectId found");
        // Fallback to previous page if no projectId
        navigate(-1);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setIsDeleting(true);
      try {
        await axios.delete(
          `https://project-management-tool-backend-cxpj.onrender.com/api/issues/${issueId}`,
          config
        );
        if (issue && issue.projectId) {
          navigate(`/project/${issue.projectId}`);
        } else {
          navigate(-1);
        }
      } catch (error) {
        console.error("Error deleting task:", error);
        setIsDeleting(false);
      }
    }
  };

  if (!issue)
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status"></div>
      </div>
    );

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Edit Task: {issue.title}</h2>
          <button
            className="btn btn-danger"
            onClick={handleDeleteTask}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Task"}
          </button>
        </div>
        <div className="card-body">
          <div className="form-group mb-3">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              className="form-control"
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
            />
          </div>
          <div className="form-group mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
            ></textarea>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={editedTask.status}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, status: e.target.value })
                  }
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={editedTask.priority}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, priority: e.target.value })
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-group mb-3">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-control"
              value={editedTask.dueDate}
              onChange={(e) =>
                setEditedTask({ ...editedTask, dueDate: e.target.value })
              }
            />
          </div>

          {/* Assign User Dropdown */}
          <div className="form-group mb-3">
            <label className="form-label">Assign User</label>
            <select
              className="form-select"
              value={editedTask.assignedTo}
              onChange={(e) =>
                setEditedTask({ ...editedTask, assignedTo: e.target.value })
              }
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleUpdateTask}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditIssuePage;
