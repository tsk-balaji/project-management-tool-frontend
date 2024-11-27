// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AllIssues.css"; // Import custom CSS for card styles

const AllIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all issues
  const fetchAllIssues = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Get token from localStorage
      if (!token) {
        setError("Authorization token is missing.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "https://project-management-tool-backend-cxpj.onrender.com/api/issues/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIssues(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching issues:", err);
      setError("Failed to load issues. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllIssues();
  }, []);

  // Handle loading state
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  // Render all issues
  return (
    <Container className="mt-4">
      <h2>All Issues</h2>
      <Row className="equal-height-cards">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <Col md={6} lg={4} key={issue.id} className="mb-4">
              <Card className="shadow-sm h-100">
                {" "}
                {/* Ensure consistent height */}
                <Card.Body className="d-flex flex-column">
                  <Card.Title>
                    <Link
                      to={`/edit-issue/${issue.id}`}
                      className="issue-title-link"
                    >
                      {issue.title}
                    </Link>
                  </Card.Title>
                  <Card.Text>
                    <strong>Due Date:</strong>{" "}
                    {new Date(issue.dueDate).toLocaleDateString()}
                  </Card.Text>
                  <Card.Text>
                    <strong>Project:</strong>{" "}
                    <Link to={`/project/${issue.projectId}`}>
                      {issue.projectName}
                    </Link>
                  </Card.Text>
                  <Card.Text>
                    <strong>Description:</strong> {issue.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p>No issues available at the moment.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default AllIssues;
