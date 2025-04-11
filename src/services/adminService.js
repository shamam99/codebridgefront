import axios from "./axiosInstance";

// Admin Auth Headers
const getAdminHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Admin login
const loginAdmin = async (email, password) => {
  const res = await axios.post("/admin/login", { email, password });
  return res.data;
};

// Admin login
const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login"; 
  };
  

// Admin creation
const createAdmin = async (name, email, password) => {
  const res = await axios.post("/admin/create", { name, email, password }, getAdminHeaders());
  return res.data;
};

// User Management
const fetchUsers = async () => {
  const res = await axios.get("/admin/dashboard/users", getAdminHeaders());
  return res.data;
};
const deleteUser = async (id) => {
  await axios.delete(`/admin/dashboard/users/${id}`, getAdminHeaders());
};

// Post Management
const fetchPosts = async () => {
  const res = await axios.get("/admin/dashboard/posts", getAdminHeaders());
  return res.data;
};
const deletePost = async (id) => {
  await axios.delete(`/admin/dashboard/posts/${id}`, getAdminHeaders());
};

// Comment Management
const fetchComments = async () => {
  const res = await axios.get("/admin/dashboard/comments", getAdminHeaders());
  return res.data;
};
const deleteComment = async (id) => {
  await axios.delete(`/admin/dashboard/comments/${id}`, getAdminHeaders());
};

// News Management
const fetchNews = async (page = 1, limit = 5) => {
  const res = await axios.get(`/admin/dashboard/news?page=${page}&limit=${limit}`, getAdminHeaders());
  return res.data;
};
const createNews = async (title, content) => {
  const res = await axios.post("/admin/dashboard/news", { title, content }, getAdminHeaders());
  return res.data;
};
const deleteNews = async (id) => {
  await axios.delete(`/admin/dashboard/news/${id}`, getAdminHeaders());
};

const adminService = {
  loginAdmin,
  logoutAdmin,
  createAdmin,
  fetchUsers,
  deleteUser,
  fetchPosts,
  deletePost,
  fetchComments,
  deleteComment,
  fetchNews,
  createNews,
  deleteNews,
};

export default adminService;
