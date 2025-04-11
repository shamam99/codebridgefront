import API from "./axiosInstance";

// Get logged-in user profile
export const getMyProfile = async () => {
  const response = await API.get("/users/profile");
  return response.data;
};

// Get a specific user profile
export const getUserProfile = async (userId) => {
  const response = await API.get(`/users/${userId}`);
  return response.data;
};


// Update profile
export const updateProfile = async (profileData) => {
  const response = await API.put("/users/profile", profileData);
  return response.data;
};

// Follow a user
export const followUser = async (userId) => {
  const response = await API.post(`/users/${userId}/follow`);
  return response.data;
};

// Unfollow a user
export const unfollowUser = async (userId) => {
  const response = await API.post(`/users/${userId}/unfollow`);
  return response.data;
};

