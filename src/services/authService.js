import API from "./axiosInstance";

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

