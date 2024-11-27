// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("email", formData.email); // Store email in localStorage before sending it

    try {
      // Step 1: Login user and retrieve auth token
      const loginResponse = await axios.post(
        "https://project-management-tool-backend-cxpj.onrender.com/api/auth/login",
        formData
      );

      console.log(loginResponse);

      const token = loginResponse.data.token; // Get token from login response
      localStorage.setItem("authToken", token); // Save token

      if (loginResponse.data.user) {
        localStorage.setItem(
          "userDetails",
          JSON.stringify(loginResponse.data.user)
        );
      }

      console.log("User Details Saved:", localStorage.getItem("userDetails"));

      // Step 3: Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(error); // Log error details for debugging
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "30px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#007bff",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        Login
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={{
            padding: "15px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            fontSize: "16px",
            backgroundColor: "#fff",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
            color: "#333", // Ensure text is visible
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={{
            padding: "15px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            fontSize: "16px",
            backgroundColor: "#fff",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
            color: "#333", // Ensure text is visible
          }}
        />
        <button
          type="submit"
          style={{
            padding: "15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s, box-shadow 0.3s",
          }}
          onMouseOver={(e) =>
            (e.target.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)")
          }
          onMouseOut={(e) => (e.target.style.boxShadow = "none")}
        >
          Login
        </button>
        {error && (
          <p style={{ color: "red", textAlign: "center", margin: "10px 0" }}>
            {error}
          </p>
        )}
      </form>
      <div style={{ textAlign: "center", marginTop: "15px" }}>
        <Link
          to="/forgot-password"
          style={{
            color: "#007bff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
          onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
          onMouseOut={(e) => (e.target.style.textDecoration = "none")}
        >
          Forgot Password?
        </Link>
        <span style={{ margin: "0 10px", color: "#555" }}>|</span>
        <Link
          to="/register"
          style={{
            color: "#007bff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
          onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
          onMouseOut={(e) => (e.target.style.textDecoration = "none")}
        >
          Create an Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
