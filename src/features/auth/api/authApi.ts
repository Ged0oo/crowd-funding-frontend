import api from "../../../services/axios";
import { type LoginPayload, type GoogleAuthPayload } from "../../../types/auth";

export const registerUser = async (userData: any) => {
    if (userData instanceof FormData) {
        const response = await api.post('auth/register/', userData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    }

    const response = await api.post('auth/register/', userData);
    return response;
}

export const verfiyOtp = async (otp: any) => {
    const response = await api.post('auth/otp/verify/', otp);
    return response;
}

export const loginUser = async (data: LoginPayload) => {
    const response = await api.post('auth/login/', data);
    return response;
}

export const verfiyGoogleAuth = async (token: GoogleAuthPayload) => {
    const response = await api.post('auth/google/', token);
    return response;
}

export const myProfileApi = async () => {
    const response = await api.get('auth/me/');
    return response;
}

export const logoutApi = async (refreshToken: string) => {
    const response = await api.post('auth/logout/', { refresh: refreshToken });
    return response;
}

export const updateProfileApi = async (data: any) => {
    const response = await api.patch('auth/me/', data);
    return response;
}

export const resendOtpApi = async (email: string) => {
    const response = await api.post('auth/otp/resend/', { email });
    return response;
}

export const forgotPasswordApi = async (email: string) => {
    const response = await api.post('auth/forgetpassword/', { email });
    return response;
}

export const resetPasswordApi = async (data: { email: string, otp: string, new_password: string }) => {
    const response = await api.post('auth/resetpassword/', data);
    return response;
}

export const deleteAccountApi = async () => {
    const response = await api.delete('auth/users/');
    return response;
}