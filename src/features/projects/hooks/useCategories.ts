import { useQuery } from "@tanstack/react-query";
import { getCategories as fetchCategories } from "../api/projectsApi";
import type { Category } from "../../../types/projects";


export const useCategories = () => {
    return useQuery<Category[], Error>({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}