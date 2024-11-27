// Import configureStore from Redux Toolkit
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./reducers/projectReducers";
import authReducer from "./reducers/authreducer";
import dashboardReducer from "./reducers/dashboardReducer";

const store = configureStore({
  reducer: {
    projects: projectReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
