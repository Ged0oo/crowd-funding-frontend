import { useQuery } from "@tanstack/react-query";
import { getCategoryProjects } from "../api/discoveryApi";

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: () => getCategoryProjects(slug),
    enabled: Boolean(slug),
  });
}
