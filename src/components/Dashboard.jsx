// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Badge, Alert, Button } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as XLSX from "xlsx"; // Library to handle Excel export
import {
  setUpcomingProjects,
  setUpcomingIssues,
} from "../redux/reducers/dashboardReducer"; // Import your Redux actions

const Dashboard = () => {
  const [projectsStats, setProjectsStats] = useState([]);
  const [issuesStats, setIssuesStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch(); // Use dispatch to send actions to Redux
  const navigate = useNavigate();

  // Function to get the token
  const getAuthToken = () => localStorage.getItem("authToken");

  // Function to check if a deadline is within 3 days
  const isDeadlineUpcoming = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 3;
  };

  // Fetch projects and issues data
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

        const projectsData = projectsResponse.data.projects || [];
        const issuesData = issuesResponse.data || [];

        setProjectsStats(projectsData);
        setIssuesStats(issuesData);

        // Filter upcoming projects and issues
        const upcomingProjects = projectsData.filter((project) =>
          isDeadlineUpcoming(project.deadline)
        );
        const upcomingIssues = issuesData.filter((issue) =>
          isDeadlineUpcoming(issue.dueDate)
        );

        // Dispatch data to Redux
        dispatch(setUpcomingProjects(upcomingProjects));
        dispatch(setUpcomingIssues(upcomingIssues));

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "Failed to load data. Please check your connection or contact support."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]); // Add dispatch as a dependency

  // Export the data to Excel
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const projectsSheet = XLSX.utils.json_to_sheet(projectsStats);
    const issuesSheet = XLSX.utils.json_to_sheet(issuesStats);

    XLSX.utils.book_append_sheet(workbook, projectsSheet, "Projects");
    XLSX.utils.book_append_sheet(workbook, issuesSheet, "Issues");

    XLSX.writeFile(workbook, "Dashboard_Report.xlsx");
  };

  // Define upcoming deadlines for projects and issues
  const upcomingDeadlines = {
    projects: projectsStats.filter((project) =>
      isDeadlineUpcoming(project.deadline)
    ),
    issues: issuesStats.filter((issue) => isDeadlineUpcoming(issue.dueDate)),
  };

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

  // Render the dashboard
  return (
    <div>
      <h2 className="mb-4 " style={{ paddingTop: "60px" }}>
        Dashboard
      </h2>

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
          <Card
            className="mb-3 shadow-sm clickable-card"
            onClick={() => navigate("/projects")}
            style={{ cursor: "pointer" }}
          >
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
          <Card
            className="mb-3 shadow-sm clickable-card"
            onClick={() => navigate("/issues")}
            style={{ cursor: "pointer" }}
          >
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
          <Card
            className="mb-3 shadow-sm clickable-card"
            onClick={() => navigate("/projects/upcoming")}
            style={{ cursor: "pointer" }}
          >
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
          <Card
            className="mb-3 shadow-sm clickable-card"
            onClick={() => navigate("/issues/upcoming")}
            style={{ cursor: "pointer" }}
          >
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
