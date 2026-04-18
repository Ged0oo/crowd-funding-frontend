import { useMutation, useQueryClient } from "@tanstack/react-query"
import { rateProject } from "../api/socialApi"
import type { Project } from "../../../types/projects"

export function useRating(projectId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["rate", projectId],
    mutationFn: (value: number) => rateProject(projectId, value),
    onSuccess: (data) => {
      // Manual cache update for instant feedback
      queryClient.setQueryData(["project", projectId], (oldData: Project | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          avg_rating: data.new_project_average ?? oldData.avg_rating,
          user_rating: data.value // or data.user_rating from serializer
        };
      });

      // Invalidate related lists to keep everything in sync
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["homepage"] })
    },
  })
}