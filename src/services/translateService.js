import API from "./axiosInstance";

export const translateCode = async ({ code, fromLang, toLang }) => {
  const response = await API.post("/translate", {
    code,
    fromLang,
    toLang,
  });
  return response.data;
};
