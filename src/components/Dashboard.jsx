// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Badge, Alert, Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx"; // Library to handle Excel export

const Dashboard = () => {
  const [projectsStats, setProjectsStats] = useState([]);
  const [issuesStats, setIssuesStats] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState({
    projects: [],
    issues: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return diffDays > 0 && diffDays <= 3;
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

        const [projectsResponse, issuesResponse] = await Promise.all([
          axios.get(
            "https://project-management-tool-backend-cxpj.onrender.com/api/projects/",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get(
            "https://project-management-tool-backend-cxpj.onrender.com/api/issues/",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        const projectsData = Array.isArray(projectsResponse.data)
          ? projectsResponse.data
          : [];
        const issuesData = Array.isArray(issuesResponse.data)
          ? issuesResponse.data
          : [];

        setProjectsStats(projectsData);
        setIssuesStats(issuesData);

        const upcomingIssues = issuesData.filter((issue) =>
          isDeadlineUpcoming(issue.deadline)
        );
        const upcomingProjects = projectsData.filter((project) =>
          isDeadlineUpcoming(project.deadline)
        );

        setUpcomingDeadlines({
          issues: upcomingIssues,
          projects: upcomingProjects,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data: ", err);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Create sheets for projects and issues
    const projectsSheet = XLSX.utils.json_to_sheet(projectsStats);
    const issuesSheet = XLSX.utils.json_to_sheet(issuesStats);

    // Add sheets to the workbook
    XLSX.utils.book_append_sheet(workbook, projectsSheet, "Projects");
    XLSX.utils.book_append_sheet(workbook, issuesSheet, "Issues");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "Dashboard_Report.xlsx");
  };

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

      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="success" onClick={exportToExcel}>
          Export
        </Button>
        <Link to="/projects">
          <Button variant="primary">Go to Projects</Button>
        </Link>
      </div>

      <Row>
        <Col md={6}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <span>Total Projects</span>
                <Badge bg="primary" pill>
                  {projectsStats.length}
                </Badge>
              </Card.Title>
            </Card.Body>
          </Card>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <span>Upcoming Projects</span>
                <Badge bg="info" pill>
                  {upcomingDeadlines.projects.length}
                </Badge>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <span>Upcoming Issues</span>
                <Badge bg="info" pill>
                  {upcomingDeadlines.issues.length}
                </Badge>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
