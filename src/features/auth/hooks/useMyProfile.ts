import { myProfileApi } from "../api/authApi";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";

export const useMyProfile = () => {
    const accessToken = useAuthStore((state) => state.accessToken);
    return useQuery({
        queryKey: ['myProfile'],
        queryFn: () => myProfileApi(),
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        enabled: !!accessToken,
    })
}