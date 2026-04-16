import { verfiyOtp } from "../api/authApi";
import { useMutation } from "@tanstack/react-query";
import { type OtpPayload } from "../../../types/auth";

export const useOtp = () => {
    return useMutation({
        mutationFn: (data: OtpPayload) => verfiyOtp(data),
        onSuccess: (response) => {
            console.log("otp verified", response);
            const {access, refresh} = response.data.Tokens;
            if (refresh && access)
            {
                localStorage.setItem("accessToken", access);
                localStorage.setItem("refreshToken", refresh);
            }
        },
        onError(error) {
            console.error("error with otp", error);
        }
    })
}