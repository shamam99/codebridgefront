import axios from "./axiosInstance";

export const fetchNews = async () => {
  const response = await axios.get("/news");
  return response.data;
};
