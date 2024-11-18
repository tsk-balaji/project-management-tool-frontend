// Import configureStore from Redux Toolkit
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./reducers/projectReducers";
import authReducer from "./reducers/authreducer";

const store = configureStore({
  reducer: {
    projects: projectReducer,
    auth: authReducer,
  },
});

export default store;
