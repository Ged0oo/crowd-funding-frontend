import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProjectComments, postComment, deleteComment } from "../api/socialApi"
import { toast } from "sonner"

export function useComments(projectId: number) {
  const queryClient = useQueryClient()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["comments", projectId],
    queryFn: ({ pageParam }) => getProjectComments(projectId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined
      const url = new URL(lastPage.next)
      const nextPage = url.searchParams.get("page")
      return nextPage ? Number(nextPage) : undefined
    },
  })

  const comments = data?.pages.flatMap((page) => page.results) ?? []

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => postComment(projectId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", projectId] })
      toast.success("Comment posted")
    },
  })

  const removeCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", projectId] })
      toast.success("Comment deleted")
    },
  })

  return {
    comments,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    addComment: addCommentMutation.mutateAsync,
    isSubmitting: addCommentMutation.isPending,
    deleteComment: removeCommentMutation.mutateAsync,
  }
}