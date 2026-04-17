import { useQuery } from "@tanstack/react-query";
import type { SearchResult } from "../../../types/discovery";
import { searchProjects } from "../api/discoveryApi";

export function useSearch(query: string) {
  return useQuery<SearchResult, Error>({
    queryKey: ["search", query],
    queryFn: () => searchProjects(query),
    enabled: query.trim().length > 0,
  });
}
