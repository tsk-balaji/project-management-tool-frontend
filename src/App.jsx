// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux"; // Import Provider from react-redux
import store from "./redux/store"; // Import the Redux store
import Home from "./pages/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Projects from "./pages/Projects";
import Dashboard from "./components/Dashboard";
import ActivateAccount from "./components/ActivateAccount";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div
          className="app-container"
          style={{ minHeight: "100vh", width: "100%" }}
        >
          <div className="content" style={{ paddingTop: "60px" }}>
            {" "}
            {/* Account for NavBar height */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/" element={<Login />} />
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
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
