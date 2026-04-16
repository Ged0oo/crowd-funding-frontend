import axios from "axios";

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

// export default registerUser;