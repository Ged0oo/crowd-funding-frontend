import { useQuery } from "@tanstack/react-query";
import { getHomepage } from "../api/discoveryApi";

export function useHomepage() {
  return useQuery({
    queryKey: ["homepage"],
    queryFn: getHomepage,
  });
}
