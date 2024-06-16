import axios from "axios";

// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWY5NjZhYWExMjY0NDZjNTBlMTI2YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxMTk2MDM0MiwiZXhwIjoxNzEyMDQ2NzQyfQ.UaQQBcgA01mIQoudDnHN492mj-CHC6mW1arbGc4_EBg";
const token = localStorage.getItem("token");
const baseURL = import.meta.env.VITE_BASE_URL ;

export const authenticatedInstance = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Create an Axios instance without token
export const unauthenticatedInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});
