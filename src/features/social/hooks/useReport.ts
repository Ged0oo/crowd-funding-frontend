import { useMutation } from "@tanstack/react-query"
import { reportProject, reportComment } from "../api/socialApi"

export function useReport() {
  const reportProjectMutation = useMutation({
    mutationFn: ({ projectId, reason }: { projectId: number; reason: string }) => 
      reportProject(projectId, reason),
  })

  const reportCommentMutation = useMutation({
    mutationFn: ({ commentId, reason }: { commentId: number; reason: string }) => 
      reportComment(commentId, reason),
  })

  return {
    sendProjectReport: reportProjectMutation.mutateAsync,
    sendCommentReport: reportCommentMutation.mutateAsync,
    isReporting: reportProjectMutation.isPending || reportCommentMutation.isPending
  }
}