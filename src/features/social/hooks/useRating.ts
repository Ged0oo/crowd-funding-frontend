import { useMutation, useQueryClient } from "@tanstack/react-query"
import { rateProject } from "../api/socialApi"

export function useRating(projectId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["rate", projectId],
    mutationFn: (value: number) => rateProject(projectId, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] })
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["homepage"] })
    },
  })
}