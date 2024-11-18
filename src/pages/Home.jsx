// eslint-disable-next-line no-unused-vars
import React from "react";
import Login from "../components/Login";

const Home = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Welcome to Project Management App</h1>
      <p>Manage your projects, tasks, and team efficiently. Get started now!</p>
      <Login />
    </div>
  );
};

export default Home;
