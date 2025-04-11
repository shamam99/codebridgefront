import API from "./axiosInstance";

// Fetch comments for a post
export const fetchComments = async (postId) => {
  const res = await API.get(`/comments/post/${postId}`);
  return res.data;
};

// Create a comment
export const createComment = async (postId, content) => {
  console.log("Sending comment:", { postId, content }); 
  return await API.post("/comments", { postId, content });
};

// Delete a comment
export const deleteComment = async (commentId) => {
  return await API.delete(`/comments/${commentId}`);
};

// Optional: Update a comment (if needed)
export const updateComment = async (commentId, content) => {
  const response = await API.put(`/comments/${commentId}`, { content });
  return response.data;
};
