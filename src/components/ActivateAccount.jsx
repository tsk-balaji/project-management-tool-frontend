// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ActivateAccount = () => {
  const { token } = useParams(); // Get token from the URL
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await axios.get(
          `https://project-management-tool-backend-cxpj.onrender.com/api/auth/activate/${token}`
        );
        setMessage(response.data.message);
        setLoading(false);
        // Redirect to login page after successful activation
        const timer = setTimeout(() => {
          navigate("/login");
        }, 2000);
        return () => clearTimeout(timer);
      } catch (error) {
        setMessage(error.response?.data?.message || "Error activating account");
        setLoading(false);
      }
    };

    activateAccount();
  }, [token, navigate]);

  return (
    <div className="container">
      <div className="alert alert-info mt-5" role="alert">
        {loading ? <p>Activating your account...</p> : <p>{message}</p>}
      </div>
    </div>
  );
};

export default ActivateAccount;
