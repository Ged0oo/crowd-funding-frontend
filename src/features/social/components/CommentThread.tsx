import { useComments } from "../hooks/useComments"
import CommentItem from "./CommentItem"
import CommentForm from "./CommentForm"
import { MessageSquareOff } from "lucide-react"
import Spinner from "../../../shared/components/ui/Spinner"
import Badge from "../../../shared/components/ui/Badge"
import Button from "../../../shared/components/ui/Button"

interface CommentThreadProps {
  projectId: number
}

export default function CommentThread({ projectId }: CommentThreadProps) {
  const {
    comments,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    addComment,
    isSubmitting,
    deleteComment,
  } = useComments(projectId)

  const handlePostComment = async (content: string) => {
    await addComment(content)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-secondary">
        <Spinner size="lg" />
        <p className="font-medium animate-pulse">Loading discussion...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-bold font-headline mb-4 text-on-surface flex items-center gap-2">
          Discussion
          <Badge variant="neutral">
            {comments.length}
          </Badge>
        </h3>
        <div className="bg-surface-container-low p-4 rounded-3xl border border-outline-variant/10 shadow-card">
          <CommentForm 
            onSubmit={handlePostComment} 
            isSubmitting={isSubmitting} 
            placeholder="Share your thoughts on this project..."
          />
        </div>
      </section>

      <div className="space-y-2">
        {comments.length > 0 ? (
          <>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                projectId={projectId}
                onDelete={deleteComment}
              />
            ))}

            {hasNextPage && (
              <div className="pt-6 flex justify-center">
                <Button
                  variant="secondary"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="!rounded-full px-8"
                >
                  {isFetchingNextPage ? (
                    <span className="flex items-center gap-2">
                      <Spinner size="sm" />
                      Loading more...
                    </span>
                  ) : (
                    "Show more comments"
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-surface-container-low/50 rounded-3xl border border-dashed border-outline-variant/50">
            <MessageSquareOff className="w-12 h-12 text-surface-dim mb-3" />
            <p className="text-secondary font-medium">No comments yet.</p>
            <p className="text-xs text-secondary/60">Be the first to start the conversation!</p>
          </div>
        )}
      </div>
    </div>
  )
}