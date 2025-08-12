import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getAccessToken } from "../service/AuthService";


export const currentBaseUrl = "https://infotube-server.onrender.com/";

let baseURL =`${currentBaseUrl}/api`

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true
});
  
axiosInstance.interceptors.request.use((config) => {
    let token = getAccessToken()
    console.log(token)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axios.interceptors.response.use(
    res => res,
    async error => {
      const originalRequest = error.config;
  
      if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        const res = await axios.get("/api/refresh", { withCredentials: true });
        const newAccessToken = res.data.accessToken;
        axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      }
  
      return Promise.reject(error);
    }
);

export default axiosInstance;