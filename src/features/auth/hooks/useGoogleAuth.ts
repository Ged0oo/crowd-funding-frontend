import { verfiyGoogleAuth } from "../api/authApi";
import { useMutation } from "@tanstack/react-query";
import { type GoogleAuthPayload } from "../../../types/auth";

export const useGoogleAuth = () => {
    return useMutation({
        mutationFn: (token: GoogleAuthPayload) => verfiyGoogleAuth(token),
        onSuccess: (response) => {
            console.log('successful google login')
            const {access, refresh} = response.data;

            if (access && refresh)
            {
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
            }
        },
        onError: (error) => {
            console.error('error while google login', error);
        }
    })
} 