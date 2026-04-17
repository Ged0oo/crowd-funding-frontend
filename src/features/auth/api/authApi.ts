import axios from "axios";
import { type LoginPayload, type GoogleAuthPayload } from "../../../types/auth";
import { useAuthStore } from "../stores/authStore";

const authAPI = axios.create({
    baseURL: "http://127.0.0.1:8000/api/auth/",
    headers: {
        "Content-Type": "application/json",
    },
});


authAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

authAPI.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    const res = await axios.post('http://127.0.0.1:8000/api/auth/token/refresh/', {
                        refresh: refreshToken
                    });

                    const newAccessToken = res.data.access;

                    useAuthStore.getState().setAccessToken(newAccessToken);

                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    return authAPI(originalRequest);
                } catch (refreshError) {
                    useAuthStore.getState().logout();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

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

export const myProfileApi = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const response = await authAPI.get('me/', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return response;
}

export const logoutApi = async (refreshToken: string) => {
    const response = await authAPI.post('logout/', { refresh: refreshToken });
    return response;
}

export const updateProfileApi = async (data: any) => {
    const response = await authAPI.patch('me/', data);
    return response;
}

export const resendOtpApi = async (email: string) => {
    const response = await authAPI.post('otp/resend/', { email });
    return response;
}

export const forgotPasswordApi = async (email: string) => {
    const response = await authAPI.post('forgetpassword/', { email });
    return response;
}

export const resetPasswordApi = async (data: { email: string, otp: string, new_password: string }) => {
    const response = await authAPI.post('resetpassword/', data);
    return response;
}

export const deleteAccountApi = async () => {
    const response = await authAPI.delete('users/');
    return response;
}