import API from "./axiosInstance";
import { getStoredToken } from "./authService";  

// TRANSLATE CODE
export const translateCode = async ({ code, fromLang, toLang }) => {
  const token = getStoredToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await API.post("/translate", {
    code,
    fromLang,
    toLang,
  }, { headers });
  
  return response.data;
};

// RUN CODE
export const runCode = async ({ code, language }) => {
  const response = await API.post("/code/run", {
    code,
    language,
  });
  return response.data;
};

// DEBUG CODE
export const debugCode = async ({ code, language }) => {
  const response = await API.post("/code/debug", {
    code,
    language,
  });
  return response.data;
};
