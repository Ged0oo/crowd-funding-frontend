import { useQuery } from "@tanstack/react-query";
import type { HomepageData } from "../../../types/discovery";
import { getHomepage } from "../api/discoveryApi";

export function useHomepage() {
  return useQuery<HomepageData, Error>({
    queryKey: ["homepage"],
    queryFn: getHomepage,
  });
}
