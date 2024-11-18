// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Card, Badge, ListGroup, Alert } from "react-bootstrap";
import PropTypes from "prop-types";

const TaskDetails = ({ task }) => {
  const [validation, setValidation] = useState({ error: "", success: "" });

  // Perform validation when the task prop changes
  useEffect(() => {
    validateTask(task);
  }, [task]);

  // Validate task details
  const validateTask = (task) => {
    if (!task.title) {
      setValidation({ error: "Task title is required", success: "" });
    } else if (!task.description) {
      setValidation({ error: "Task description is required", success: "" });
    } else {
      setValidation({ error: "", success: "Task details are valid" });
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">{task.title}</Card.Header>
      <Card.Body>
        {/* Show validation errors if any */}
        {validation.error && (
          <Alert variant="danger">
            <strong>Error: </strong> {validation.error}
          </Alert>
        )}

        {validation.success && (
          <Alert variant="success">
            <strong>Success: </strong> {validation.success}
          </Alert>
        )}

        <Card.Text>{task.description}</Card.Text>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Deadline:</strong> {task.deadline}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Category:</strong> {task.category}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Assigned to:</strong> {task.assignee}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Status:</strong>
            <Badge
              pill
              variant={
                task.status === "Closed"
                  ? "success"
                  : task.status === "In Progress"
                  ? "warning"
                  : "primary"
              }
            >
              {task.status}
            </Badge>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Priority:</strong>
            <Badge
              pill
              variant={
                task.priority === "High"
                  ? "danger"
                  : task.priority === "Medium"
                  ? "warning"
                  : "secondary"
              }
            >
              {task.priority}
            </Badge>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

TaskDetails.propTypes = {
  task: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    deadline: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    assignee: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["Closed", "In Progress", "Open"]).isRequired,
    priority: PropTypes.oneOf(["High", "Medium", "Low"]).isRequired,
  }).isRequired,
};

export default TaskDetails;
