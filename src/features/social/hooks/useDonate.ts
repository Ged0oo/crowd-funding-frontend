import { useMutation, useQueryClient } from "@tanstack/react-query"
import { donateToProject } from "../api/socialApi"
import type { Project } from "../../../types/projects"
import type { DonationHistoryItem } from "../../../types/social"

export function useDonate(projectId: number) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (amount: number) => donateToProject(projectId, amount),
    
    onMutate: async (newAmount) => {
      await queryClient.cancelQueries({ queryKey: ["project", projectId] })
      await queryClient.cancelQueries({ queryKey: ["user-donations"] })

      const prevProject = queryClient.getQueryData<Project>(["project", projectId])
      const prevHistory = queryClient.getQueryData<DonationHistoryItem[]>(["user-donations"])

      if (prevProject) {
        const updatedAmount = prevProject.current_amount + newAmount
        queryClient.setQueryData<Project>(["project", projectId], {
          ...prevProject,
          current_amount: updatedAmount,
          funded_pct: Math.min(100, Math.round((updatedAmount / prevProject.total_target) * 100)),
        })
      }

      if (prevHistory) {
        const newItem: DonationHistoryItem = {
          id: Math.random(), // Temporary ID
          project_title: prevProject?.title || "Project",
          amount: newAmount.toString(),
          created_at: new Date().toISOString(),
        }
        queryClient.setQueryData<DonationHistoryItem[]>(["user-donations"], [newItem, ...prevHistory])
      }

      return { prevProject, prevHistory }
    },

    onError: (err, newAmount, context) => {
      if (context?.prevProject) {
        queryClient.setQueryData(["project", projectId], context.prevProject)
      }
      if (context?.prevHistory) {
        queryClient.setQueryData(["user-donations"], context.prevHistory)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] })
      queryClient.invalidateQueries({ queryKey: ["user-donations"] })
    },
  })

  return {
    donate: mutation.mutateAsync,
    isDonating: mutation.isPending,
    error: mutation.error,
  }
}