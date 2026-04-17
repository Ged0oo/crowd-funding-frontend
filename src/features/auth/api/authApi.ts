import axios from "axios";
import { type LoginPayload, type GoogleAuthPayload } from "../../../types/auth";

const authAPI = axios.create({
    baseURL: "http://127.0.0.1:8000/api/auth/",
    headers: {
    "Content-Type": "application/json",
  },
});


authAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export const registerUser = async (userData: any) => {
    const response = await authAPI.post('register/', userData);
    return response;
}

export const verfiyOtp = async (otp: any) => {
    const response = await authAPI.post('otp/verify/', otp);
    return response;
}

export const loginUser = async (data: LoginPayload) => {
    const response = await authAPI.post('login/', data);
    return response;
} 

export const verfiyGoogleAuth = async (token: GoogleAuthPayload) => {
    const response = await authAPI.post('google/', token);
    return response;
}

// export default registerUser;