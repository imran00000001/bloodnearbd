import axios from "axios";

// Allow overriding the API base URL via Vite env var VITE_API_BASE.
// Locally this falls back to your local backend; on Vercel, set
// VITE_API_BASE to your deployed backend URL in Project Settings > Environment Variables.
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const axiosSecure = axios.create({
  baseURL: API_BASE,
});

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;