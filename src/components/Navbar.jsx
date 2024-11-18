// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useSelector } from "react-redux";

const NavBar = () => {
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isHomePage = location.pathname === "/";

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky="top"
      className="py-3 shadow"
    >
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to="/"
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            letterSpacing: "0.5px",
            color: "#fff",
            "@media (max-width: 576px)": {
              fontSize: "1.6rem",
            },
          }}
        >
          Project Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link
              as={Link}
              to="/dashboard"
              className="nav-link px-3 mx-2 text-light hover-effect"
              style={{ fontSize: "1.1rem" }}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/projects"
              className="nav-link px-3 mx-2 text-light hover-effect"
              style={{ fontSize: "1.1rem" }}
            >
              Projects
            </Nav.Link>
            {!isLoggedIn && isHomePage && (
              <>
                <Nav.Link as={Link} to="/login">
                  <Button
                    variant="outline-light"
                    className="px-4 py-2 mx-2 rounded-pill fw-bold"
                    style={{ transition: "all 0.3s ease" }}
                  >
                    Login
                  </Button>
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <Button
                    variant="primary"
                    className="px-4 py-2 mx-2 rounded-pill fw-bold"
                    style={{
                      transition: "all 0.3s ease",
                      backgroundColor: "#0d6efd",
                      borderColor: "#0d6efd",
                    }}
                  >
                    Register
                  </Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
