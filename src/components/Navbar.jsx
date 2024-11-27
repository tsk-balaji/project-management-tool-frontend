// eslint-disable-next-line no-unused-vars
import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavBar = () => {
  const isLoggedIn = Boolean(localStorage.getItem("authToken")); // Check if user is logged in
  const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {}; // Get user details from localStorage

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">
          Project Manager
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/projects">
              Projects
            </Nav.Link>
            <NavDropdown title="Issues" id="issues-dropdown">
              <NavDropdown.Item as={Link} to="/issues">
                All Issues
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/issues/upcoming">
                Upcoming Issues
              </NavDropdown.Item>
            </NavDropdown>
            {!isLoggedIn && ( // Conditionally render Account dropdown if not logged in
              <NavDropdown title="Account" id="account-dropdown">
                <NavDropdown.Item as={Link} to="/login">
                  Login
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/register">
                  Register
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/forgot-password">
                  Forgot Password
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
          {isLoggedIn && ( // Render profile dropdown if logged in
            <Nav>
              <NavDropdown
                align="end"
                title={
                  <span>
                    <i
                      className="bi bi-person-circle"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  </span>
                }
                id="profile-dropdown"
              >
                <NavDropdown.Header>
                  <div>
                    <strong>{userDetails.name || "User Name"}</strong>
                  </div>
                  <small>{userDetails.email || "user@example.com"}</small>
                </NavDropdown.Header>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  as={Link}
                  to="/login"
                  onClick={() => {
                    localStorage.removeItem("authToken"); // Clear token on logout
                    localStorage.removeItem("userDetails"); // Clear user details
                    window.location.reload(); // Reload to update NavBar
                  }}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
