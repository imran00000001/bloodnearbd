import axios from "axios";

// Allow overriding the API base URL via Vite env var VITE_API_BASE (e.g. http://localhost:5000)
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const axiosPublic = axios.create({
  baseURL: API_BASE,
});

const usePublicAxios = () => axiosPublic;

export default usePublicAxios;
