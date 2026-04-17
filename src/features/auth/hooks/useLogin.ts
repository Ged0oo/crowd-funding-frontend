import { loginUser } from "../api/authApi";
import { useMutation } from "@tanstack/react-query";
import { type LoginPayload } from "../../../types/auth";

export const useLogin = () => {
    return useMutation({
        mutationFn: (data: LoginPayload) => loginUser(data),

        onSuccess: (response) => {
            console.log('logged in successfully');
            const {access, refresh} = response.data.Tokens;
            if (access && refresh) {
                localStorage.setItem('accessToken', access);
                localStorage.setItem('refreshToken', refresh);
            }
        },
        onError: (error) => {
            console.error("error while loggin in", error);
        }
    })
}