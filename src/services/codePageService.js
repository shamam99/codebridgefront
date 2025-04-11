import API from "./axiosInstance";

export const fetchCodePages = async () => {
  const response = await API.get("/code/pages");
  return response.data;
};

export const createCodePage = async (pageData) => {
  const response = await API.post("/code/pages", pageData);
  return response.data;
};

export const deleteCodePage = async (id) => {
  const response = await API.delete(`/code/pages/${id}`);
  return response.data;
};
