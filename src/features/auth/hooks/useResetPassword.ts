import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi } from "../api/authApi";

export const useResetPassword = () => {
    return useMutation({
        mutationFn: (data: { email: string, otp: string, new_password: string }) => resetPasswordApi(data),
        onSuccess: () => {
            // console.log("Password Reset Successfully");
        },
        onError: (error) => {
            console.error("Failed to reset password", error);
        }
    });
};
