import { loginUser, myProfileApi } from "../api/authApi";
import { useMutation } from "@tanstack/react-query";
import { type LoginPayload } from "../../../types/auth";

import { useAuthStore } from "../stores/authStore";

export const useLogin = () => {
    return useMutation({
        mutationFn: (data: LoginPayload) => loginUser(data),

        onSuccess: async (response) => {
            console.log('logged in successfully');
            const {access, refresh} = response.data.Tokens;
            if (access && refresh) {
                useAuthStore.getState().setAccessToken(access);
                localStorage.setItem('refreshToken', refresh);

                // Fetch and store user details immediately
                try {
                    const profileRes = await myProfileApi();
                    const user = profileRes.data?.data || profileRes.data;
                    useAuthStore.getState().setUser(user);
                } catch (e) {
                    console.error("Failed to fetch user profile after login", e);
                }
            }
        },
        onError: (error) => {
            console.error("error while loggin in", error);
        }
    })
}