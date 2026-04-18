import { useEffect } from "react";
import { useMyProfile } from "./useMyProfile";
import { useAuthStore } from "../stores/authStore";

export const useInitializeAuth = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const { data: profileResponse } = useMyProfile();

    useEffect(() => {
        if (profileResponse?.data) {
            const user = profileResponse.data.data || profileResponse.data;
            setUser(user);
        }
    }, [profileResponse, setUser]);
};
