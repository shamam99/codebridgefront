import axios from "axios";
import { getStoredToken } from "./authService";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically add correct token for regular vs admin routes
API.interceptors.request.use((config) => {
  const isAdminRoute = config.url?.startsWith("/admin");

  const token = isAdminRoute
    ? localStorage.getItem("adminToken")
    : getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
