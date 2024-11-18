// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // Update API endpoint to include full URL path
      const response = await axios.post(
        "https://project-management-tool-backend-cxpj.onrender.com/api/auth/forgot-password",
        { email: email }
      );
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className=" col-lg-9">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4 text-primary">
                Forgot Password?
              </h2>
              <p className="text-muted text-center mb-4">
                Enter your email address and reset link will be sent.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="emailInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    disabled={isLoading}
                  />
                  <label htmlFor="emailInput">Email address</label>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-bold text-uppercase"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Processing...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
              {message && (
                <div
                  className="alert alert-success mt-4 text-center"
                  role="alert"
                >
                  {message}
                </div>
              )}
              {error && (
                <div
                  className="alert alert-danger mt-4 text-center"
                  role="alert"
                >
                  {error}
                </div>
              )}
              <div className="text-center mt-4">
                <a href="/login" className="text-decoration-none">
                  Back to Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
