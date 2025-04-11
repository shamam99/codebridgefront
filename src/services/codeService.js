import API from "./axiosInstance";

export const runCode = async ({ code, language }) => {
  const response = await API.post("/translate/run", { code, language });
  return response.data;
};

export const debugCode = async ({ code, language }) => {
  const response = await API.post("/translate/debug", { code, language });
  return response.data;
};
