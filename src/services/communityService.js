import axios from "./axiosInstance";

// Get all posts
export const fetchPosts = async () => {
  const response = await axios.get("/community");
  return response.data;
};

// Create a new post
export const createPost = async (data) => {
  const response = await axios.post("/community", data);
  return response.data;
};

// Update a post
export const updatePost = async (id, data) => {
  const response = await axios.put(`/community/${id}`, data);
  return response.data;
};

// Delete a post
export const deletePost = async (id) => {
  const response = await axios.delete(`/community/${id}`);
  return response.data;
};

// Search Users
export const searchCommunity = async (query) => {
    const response = await axios.get(`/search?q=${query}`);
    return response.data;
  };