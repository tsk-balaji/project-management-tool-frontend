// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "Member",
  });
  const [error, setError] = useState("");
  const [existingUser, setExistingUser] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, name, password, role } = formData;

      // Validate password
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        setError(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character"
        );
        return;
      }

      const response = await axios.post(
        "https://project-management-tool-backend-cxpj.onrender.com/api/auth/register",
        {
          email,
          name,
          password,
          role,
        }
      );
      alert(response.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.response?.status === 400) {
        setError(
          error.response.data.message ||
            "Please fill in all required fields correctly"
        );
      } else if (error.response?.status === 409) {
        setError(
          "This email is already registered. Please use a different email."
        );
        setExistingUser(error.response?.data?.existingEmail || "");
      } else if (!navigator.onLine) {
        setError("Please check your internet connection and try again");
      } else {
        setError("Registration failed. Please try again later.");
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "20px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        borderRadius: "8px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#333",
          marginBottom: "30px",
        }}
      >
        Register
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
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Register
        </button>
        {error && (
          <p
            style={{
              color: "#dc3545",
              textAlign: "center",
              margin: "10px 0",
              padding: "10px",
              backgroundColor: "#f8d7da",
              borderRadius: "4px",
              border: "1px solid #f5c6cb",
            }}
          >
            {error}
            {existingUser && (
              <span style={{ display: "block", marginTop: "10px" }}>
                Already registered with this email: <b>{existingUser}</b>
              </span>
            )}
          </p>
        )}
      </form>
    </div>
  );
};

export default Register;
