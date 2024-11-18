import { LOGIN_SUCCESS, LOGIN_FAILURE } from "../constants/authConstants";
import axios from "axios";

export const loginUser = (userData) => async (dispatch) => {
  try {
    const response = await axios.post(
      "https://project-management-tool-backend-cxpj.onrender.com/api/auth/login",
      userData
    );
    // Store auth token in localStorage
    localStorage.setItem("authToken", response.data.token);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: response.data,
    });
    // Handle success, store token or navigate
  } catch (error) {
    // Check if error.response is defined and contains data
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.message
        : "An error occurred while logging in";

    dispatch({
      type: LOGIN_FAILURE,
      payload: errorMessage,
    });

    // Handle failure
    throw new Error(errorMessage); // Optionally, throw an error to handle in component
  }
};
