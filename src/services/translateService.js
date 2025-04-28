import API from "./axiosInstance";

// TRANSLATE CODE
export const translateCode = async ({ code, fromLang, toLang }) => {

  const response = await API.post("/translate", {
    code,
    fromLang,
    toLang,
  });
  
  return response.data;
};

// RUN CODE
export const runCode = async ({ code, language }) => {
  const response = await API.post("/translate/run", {
    code,
    language,
  });
  return response.data;
};

// DEBUG CODE
export const debugCode = async ({ code, language }) => {
  const response = await API.post("/translate/debug", {
    code,
    language,
  });
  return response.data;
};
