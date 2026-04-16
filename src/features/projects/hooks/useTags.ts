import { useQuery } from "@tanstack/react-query";
import { searchTags } from "../api/projectsApi";
import type { TagAutoCompleteResponse } from "../../../types/projects";

export const useTagAutoComplete = (query: string) => {
    return useQuery<TagAutoCompleteResponse, Error>({
        queryKey: ["tag-autocomplete", query],
        queryFn: () => searchTags(query),
        enabled: query.length >= 1,
        staleTime: 1000 * 30, // 30 seconds
    });
}

export default useTagAutoComplete;