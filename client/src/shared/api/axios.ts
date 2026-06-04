import axios from "axios";
import { API_CONFIG } from "@/shared/api/config";

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
});

export default api;
