import { useMutation } from "@tanstack/react-query";
import { deleteAccountApi } from "../api/authApi";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

export const useDeleteAccount = () => {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => deleteAccountApi(),
        onSuccess: () => {
            console.log("Account successfully deleted (soft-delete).");
            logout(); // Clear all state completely since account is gone
            navigate("/"); // Boot out of the dashboard
        },
        onError: (error) => {
            console.error("Failed to delete account", error);
        }
    });
};
