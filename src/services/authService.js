import API from "./axiosInstance";


export const getStoredToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const isLoggedIn = () => {
  return !!getStoredToken(); // true if token exists
};


// Register
export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// Login
export const loginUser = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};

