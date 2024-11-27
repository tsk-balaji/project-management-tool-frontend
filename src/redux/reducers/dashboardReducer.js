const initialState = {
  upcomingProjects: [],
  upcomingIssues: [],
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_UPCOMING_PROJECTS":
      return { ...state, upcomingProjects: action.payload };
    case "SET_UPCOMING_ISSUES":
      return { ...state, upcomingIssues: action.payload };
    default:
      return state;
  }
};

export const setUpcomingProjects = (projects) => ({
  type: "SET_UPCOMING_PROJECTS",
  payload: projects,
});

export const setUpcomingIssues = (issues) => ({
  type: "SET_UPCOMING_ISSUES",
  payload: issues,
});

export default dashboardReducer;
