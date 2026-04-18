import { useMutation } from "@tanstack/react-query";
import { forgotPasswordApi } from "../api/authApi";

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (email: string) => forgotPasswordApi(email),
        onSuccess: () => {
            // console.log("Forgot password API called successfully");
        },
        onError: (error) => {
            console.error("Forgot password API failed", error);
        }
    });
};
