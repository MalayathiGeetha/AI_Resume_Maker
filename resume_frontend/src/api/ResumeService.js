import axios from "axios";

export const baseURLL = "http://localhost:8080";

export const axiosInstance = axios.create({
  baseURL: baseURLL,
});

export const generateResume = async (description, template,jobRole) => {
  const token = localStorage.getItem("token");

  const response = await axiosInstance.post(
    "/api/v1/resume/generate",
    {
      userDescription: description,
      template: template,
      jobRole: jobRole,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


export const scoreResume = async (resumeData, jobRole = "") => {
  // payload: { data: resumeData, jobRole }
  const response = await axiosInstance.post("/api/v1/resume/score", {
    data: resumeData,
    jobRole,
  });
  return response.data;
};


// ResumeService.js (additions to existing file)
export const generateCoverLetter = async (resumeData, jobRole = "", company = "", jobTitle = "", lengthInWords = 220) => {
  const payload = {
    resume: resumeData,
    jobRole,
    company,
    jobTitle,
    lengthInWords
  };
  const response = await axiosInstance.post("/api/v1/resume/cover-letter", payload);
  return response.data;
};





