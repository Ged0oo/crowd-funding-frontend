import { verfiyGoogleAuth, myProfileApi } from "../api/authApi";
import { useMutation } from "@tanstack/react-query";
import { type GoogleAuthPayload } from "../../../types/auth";

import { useAuthStore } from "../stores/authStore";

export const useGoogleAuth = () => {
    return useMutation({
        mutationFn: (token: GoogleAuthPayload) => verfiyGoogleAuth(token),
        onSuccess: async (response) => {
            console.log('successful google login. Payload is:', response.data);
            
            // Django might return `access` or `access_token` depending on jwt serialization config
            const access = response.data.access || response.data.access_token || response.data.key;
            const refresh = response.data.refresh || response.data.refresh_token;

            if (access) {
                useAuthStore.getState().setAccessToken(access);
                if (refresh) {
                    localStorage.setItem('refreshToken', refresh);
                }

                // Fetch and store user details immediately
                try {
                    const profileRes = await myProfileApi();
                    const user = profileRes.data?.data || profileRes.data;
                    useAuthStore.getState().setUser(user);
                } catch (e) {
                    console.error("Failed to fetch user profile after Google login", e);
                }
            } else {
                console.error("Tokens were missing from the backend response!", response.data);
            }
        },
        onError: (error) => {
            console.error('error while google login', error);
        }
    })
}