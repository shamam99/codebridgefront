import axios from "axios";

const API_URL = "http://localhost:3001/api/auth"; // Change this if your backend has a different URL

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = async (fullName, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { fullName, email, password });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};
