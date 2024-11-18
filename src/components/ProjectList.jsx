// eslint-disable-next-line no-unused-vars
import React from "react";
import { Card, Button, Row, Col, Badge } from "react-bootstrap";
import PropTypes from "prop-types";

const ProjectList = ({ projects, onEdit, onDelete }) => {
  return (
    <Row>
      {projects.map((project) => (
        <Col key={project.id} md={4}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>{project.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {project.category}
              </Card.Subtitle>
              <Card.Text>{project.description}</Card.Text>

              <Row>
                <Col>
                  <Card.Text>
                    <strong>Deadline:</strong> {project.deadline}
                  </Card.Text>
                </Col>
                <Col>
                  <Card.Text>
                    <strong>Start Date:</strong> {project.startDate}
                  </Card.Text>
                </Col>
              </Row>

              <Card.Text>
                <strong>Status:</strong>
                <Badge
                  pill
                  variant={
                    project.status === "Closed"
                      ? "success"
                      : project.status === "In Progress"
                      ? "warning"
                      : "primary"
                  }
                >
                  {project.status}
                </Badge>
              </Card.Text>

              <Card.Text>
                <strong>Assigned To:</strong> {project.assignedTo || "N/A"}
              </Card.Text>

              <Button variant="warning" onClick={() => onEdit(project.id)}>
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => onDelete(project.id)}
                className="ml-2"
              >
                Delete
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      deadline: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      assignedTo: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProjectList;
