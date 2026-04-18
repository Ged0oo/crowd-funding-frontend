import { verfiyOtp, resendOtpApi, myProfileApi } from "../api/authApi";
import { useMutation } from "@tanstack/react-query";
import { type OtpPayload } from "../../../types/auth";

import { useAuthStore } from "../stores/authStore";

export const useOtp = () => {
    return useMutation({
        mutationFn: (data: OtpPayload) => verfiyOtp(data),
        onSuccess: async (response) => {
            // console.log("otp verified", response);
            const {access, refresh} = response.data.Tokens;
            if (refresh && access)
            {
                useAuthStore.getState().setAccessToken(access);
                localStorage.setItem("refreshToken", refresh);

                // Fetch and store user details immediately
                try {
                    const profileRes = await myProfileApi();
                    const user = profileRes.data?.data || profileRes.data;
                    useAuthStore.getState().setUser(user);
                } catch (e) {
                    console.error("Failed to fetch user profile after OTP", e);
                }
            }
        },
        onError(error) {
            console.error("error with otp", error);
        }
    })
}

export const useResendOtp = () => {
    return useMutation({
        mutationFn: (email: string) => resendOtpApi(email),
        onSuccess: () => {
            console.log("OTP Resent Successfully");
        },
        onError: (error) => {
            console.error("Failed to resend OTP", error);
        }
    });
};