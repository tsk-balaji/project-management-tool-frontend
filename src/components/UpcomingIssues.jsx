// eslint-disable-next-line no-unused-vars
import React from "react";
import { Card, Badge, Container, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UpcomingIssues = () => {
  const upcomingIssues = useSelector((state) => state.dashboard.upcomingIssues);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Upcoming Issues</h2>
      <Row>
        {upcomingIssues.length > 0 ? (
          upcomingIssues.map((issue) => (
            <Col md={6} key={issue.id} className="mb-3">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    <span>{issue.title}</span>
                    <Badge bg="warning">Due Soon</Badge>
                  </Card.Title>
                  <Card.Text>
                    <strong>Due Date:</strong>{" "}
                    {new Date(issue.dueDate).toLocaleDateString()}
                  </Card.Text>
                  <Card.Text>
                    <strong>Description:</strong> {issue.description || "N/A"}
                  </Card.Text>
                  <Card.Text>
                    <strong>Project:</strong>{" "}
                    {issue.projectName ? (
                      <Link
                        to={`/project/${issue.projectId}`} // Navigate to project details page
                        className="text-primary"
                        style={{ textDecoration: "underline" }}
                      >
                        {issue.projectName}
                      </Link>
                    ) : (
                      "N/A"
                    )}
                  </Card.Text>
                  <div className="d-flex justify-content-end">
                    <Button
                      as={Link}
                      to={`/edit-issue/${issue._id}`} // Navigate to issue details page (optional)
                      variant="outline-primary"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <div className="text-center">
              <p className="text-muted">
                No upcoming issues within the next 3 days.
              </p>
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default UpcomingIssues;
