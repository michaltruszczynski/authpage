import axios from "axios";

const BASE_URL = "https://authpageapi.onrender.com";

const axiosInstance = axios.create({
   baseURL: BASE_URL,
});


export const axiosPrivate = axios.create({
   baseURL: BASE_URL,
   withCredentials: true
});

export default axiosInstance;
