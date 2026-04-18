import { useQuery } from "@tanstack/react-query";
import type { PaginatedResult } from "../../../types/discovery";
import type { ProjectCardProps } from "../../../types/projects";
import { getCategoryProjects } from "../api/discoveryApi";

export function useCategory(slug: string) {
  return useQuery<PaginatedResult<ProjectCardProps>, Error>({
    queryKey: ["category", slug],
    queryFn: () => getCategoryProjects(slug),
    enabled: Boolean(slug),
  });
}
