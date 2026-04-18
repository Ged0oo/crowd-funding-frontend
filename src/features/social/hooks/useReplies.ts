import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postReply } from "../api/socialApi"

export function useReplies(projectId: number) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) => 
      postReply(commentId, content),
    onSuccess: () => {
      // Since replies are nested in comments, we refresh the whole thread
      queryClient.invalidateQueries({ queryKey: ["comments", projectId] })
    },
  })

  return {
    reply: mutation.mutateAsync,
    isReplying: mutation.isPending
  }
}