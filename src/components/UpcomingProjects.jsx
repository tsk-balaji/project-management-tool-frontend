// eslint-disable-next-line no-unused-vars
import React from "react";
import { Card, Badge, Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

const UpcomingProjects = () => {
  const upcomingProjects = useSelector(
    (state) => state.dashboard.upcomingProjects
  );

  return (
    <Container className="mt-4">
      <h2>Upcoming Projects</h2>
      <Row>
        {upcomingProjects.length > 0 ? (
          upcomingProjects.map((project) => (
            <Col md={6} key={project.id} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{project.name}</Card.Title>
                  <Card.Text>
                    <strong>Deadline:</strong>{" "}
                    {new Date(project.deadline).toLocaleDateString()}
                  </Card.Text>
                  <Card.Text>
                    <strong>Description:</strong> {project.description}
                  </Card.Text>
                  <Badge bg="info">Project ID: {project.id}</Badge>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p>No upcoming projects within the next 3 days.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default UpcomingProjects;
