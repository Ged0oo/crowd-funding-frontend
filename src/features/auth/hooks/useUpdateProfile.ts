import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileApi } from "../api/authApi";

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => updateProfileApi(data),
        onSuccess: () => {
            // console.log("Profile updated successfully!");
            // Automatically refetch the profile data so the UI updates instantly
            queryClient.invalidateQueries({ queryKey: ['myProfile'] });
        },
        onError: (error) => {
            console.error("Error updating profile", error);
        }
    });
};
