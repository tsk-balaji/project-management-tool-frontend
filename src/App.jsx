// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux"; // Import Provider from react-redux
import store from "./redux/store"; // Import the Redux store

import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Projects from "./pages/Projects";
import Dashboard from "./components/Dashboard";
import ActivateAccount from "./components/ActivateAccount";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ProjectDetailsPage from "./pages/ProjectsDetailsPage";
import EditProjectPage from "./pages/EditProject";
import EditIssuePage from "./pages/EditIssuePage";
import UpcomingProjects from "./components/UpcomingProjects";
import UpcomingIssues from "./components/UpcomingIssues";
import AllIssues from "./pages/AllIssues";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div
          className="app-container"
          style={{ minHeight: "100vh", width: "100%" }}
        >
          <div className="content" style={{ paddingTop: "60px" }}>
            <NavBar />
            <Routes>
              {/* Authorization Routes */}
              <Route path="/" element={<Login />} /> {/* Default Route */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/activate-account/:token"
                element={<ActivateAccount />}
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              {/* Dashboard Route */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              {/* Project Routes */}
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Projects />{" "}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/upcoming"
                element={
                  <ProtectedRoute>
                    <UpcomingProjects />{" "}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/project/:id"
                element={
                  <ProtectedRoute>
                    <ProjectDetailsPage />{" "}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-project/:id"
                element={
                  <ProtectedRoute>
                    <EditProjectPage />{" "}
                  </ProtectedRoute>
                }
              />
              {/* Issue Routes */}
              <Route
                path="/issues"
                element={
                  <ProtectedRoute>
                    <AllIssues />{" "}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/issues/upcoming"
                element={
                  <ProtectedRoute>
                    <UpcomingIssues />{" "}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-issue/:issueId"
                element={
                  <ProtectedRoute>
                    <EditIssuePage />{" "}
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
