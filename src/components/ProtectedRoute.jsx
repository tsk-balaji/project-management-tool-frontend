// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = Boolean(localStorage.getItem("authToken")); // Check if logged in

  if (!isLoggedIn) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  // Render the children (protected component) if logged in
  return children;
};

// PropTypes validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // Ensure children is passed and is a valid React node
};

export default ProtectedRoute;
