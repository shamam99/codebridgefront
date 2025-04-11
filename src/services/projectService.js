import API from "./axiosInstance";

// Upload project (multipart/form-data)
export const uploadProject = async (formData) => {
  const res = await API.post("/projects", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Get projects for user
export const getUserProjects = async (userId) => {
  const res = await API.get(`/projects/users/${userId}/projects`);
  return res.data;
};
