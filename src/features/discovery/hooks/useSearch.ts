import { useQuery } from "@tanstack/react-query";
import { searchProjects } from "../api/discoveryApi";

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchProjects(query),
    enabled: query.trim().length > 0,
  });
}
