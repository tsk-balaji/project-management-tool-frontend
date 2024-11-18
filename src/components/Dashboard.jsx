// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Badge, Alert } from "react-bootstrap";
import axios from "axios"; // Using axios for HTTP requests
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [projectsStats, setProjectsStats] = useState([]);
  const [issuesStats, setIssuesStats] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // For handling errors

  // Function to get the token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  // Function to check if issue/project deadline is within the next 3 days
  const isDeadlineUpcoming = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 3; // Check if the deadline is within the next 3 days
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setError("Authorization token is missing.");
          setLoading(false);
          return;
        }

        // Fetch projects data
        const projectsResponse = await axios.get(
          "https://project-management-tool-backend-cxpj.onrender.com/api/projects/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Fetch issues data
        const issuesResponse = await axios.get(
          "https://project-management-tool-backend-cxpj.onrender.com/api/issues/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const projectsData = Array.isArray(projectsResponse.data)
          ? projectsResponse.data
          : [];
        const issuesData = Array.isArray(issuesResponse.data)
          ? issuesResponse.data
          : [];

        // Ensure that `projectsStats` and `issuesStats` are arrays
        setProjectsStats(projectsData);
        setIssuesStats(issuesData);

        // Filter projects and issues with upcoming deadlines (within next 3 days)
        const upcomingIssues = issuesData.filter((issue) =>
          isDeadlineUpcoming(issue.deadline)
        );

        setUpcomingDeadlines(upcomingIssues);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data: ", err);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <Row>
        <Col md={6}>
          <Link to="/projects" style={{ textDecoration: "none" }}>
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                  <span>Total Projects</span>
                  <Badge bg="primary" pill>
                    {projectsStats.length}
                  </Badge>
                </Card.Title>
                <Card.Text>
                  Keep track of the number of projects you&apos;ve been
                  assigned.
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={6}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <span>Total Issues</span>
                <Badge bg="warning" pill>
                  {issuesStats.length}
                </Badge>
              </Card.Title>
              <Card.Text>
                Review the current number of issues associated with your
                projects.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <span>Upcoming Projects</span>
                <Badge bg="info" pill>
                  {
                    projectsStats.filter((project) =>
                      isDeadlineUpcoming(project.deadline)
                    ).length
                  }
                </Badge>
              </Card.Title>
              {projectsStats.length > 0 ? (
                <ul className="list-unstyled">
                  {projectsStats
                    .filter((project) => isDeadlineUpcoming(project.deadline))
                    .map((project, index) => (
                      <li key={index} className="mb-2">
                        <Link to={`/projects/${project._id}`}>
                          <strong>{project.name}</strong>
                        </Link>{" "}
                        - Deadline:{" "}
                        <span className="text-muted">
                          {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                </ul>
              ) : (
                <Alert variant="info">No projects data available</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={12}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <span>Issues With Upcoming Deadlines</span>
                <Badge bg="info" pill>
                  {upcomingDeadlines.length}
                </Badge>
              </Card.Title>
              {upcomingDeadlines.length > 0 ? (
                <ul className="list-unstyled">
                  {upcomingDeadlines.map((issue, index) => (
                    <li key={index} className="mb-2">
                      <Link to={`/issues/${issue._id}`}>
                        <strong>{issue.title}</strong>
                      </Link>{" "}
                      - Due:{" "}
                      <span className="text-muted">
                        {new Date(issue.deadline).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <Alert variant="info">No upcoming deadlines</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
