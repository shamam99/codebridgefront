import API from "./axiosInstance";

export const translateCode = async ({ code, fromLang, toLang }) => {
  const response = await API.post("/translate", {
    code,
    fromLang,
    toLang,
  });
  return response.data;
};

export const runCode = async ({ code, language }) => {
  const response = await API.post("/translate/run", {
    code,
    language,
  });
  return response.data;
};
