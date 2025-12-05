import axios from "axios";

export const baseURLL = "http://localhost:8080";

export const axiosInstance = axios.create({
  baseURL: baseURLL,
});

export const generateResume = async (description, template) => {
  const token = localStorage.getItem("token");

  const response = await axiosInstance.post(
    "/api/v1/resume/generate",
    {
      userDescription: description,
      template: template,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};






