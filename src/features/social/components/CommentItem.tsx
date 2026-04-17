import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MessageSquare, Trash2, CornerDownRight } from "lucide-react"
import { formatRelativeTime } from "../../../shared/utils/dateUtils"
import type { Comment } from "../../../types/social"
import { useReplies } from "../hooks/useReplies"
import { useAuthStore } from "../../../app/store"
import { toast } from "sonner"
import CommentForm from "./CommentForm"
import Button from "../../../shared/components/ui/Button"
import ReportButton from './ReportButton'

interface CommentItemProps {
  comment: Comment
  projectId: number
  onDelete: (id: number) => Promise<void>
  isDeleting?: boolean
  isReply?: boolean
}

export default function CommentItem({
  comment,
  projectId,
  onDelete,
  isDeleting,
  isReply = false,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const navigate = useNavigate()
  const { reply, isReplying: isSubmittingReply } = useReplies(projectId)
  const user = useAuthStore((state) => state.user)

  const isOwner = user?.id === comment.user.id

  const handleReplyClick = () => {
    if (!user) {
      toast.info("Please login to reply to this comment")
      navigate("/authenticate")
      return
    }
    setIsReplying(!isReplying)
  }

  const handleReply = async (content: string) => {
    await reply({ commentId: comment.id, content })
    setIsReplying(false)
  }

  return (
    <div className={`flex flex-col ${isReply ? "ml-8 mt-4" : "mt-6"}`}>
      <div className="flex gap-3 group">
        <div className="flex-1 min-w-0">
          <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-4 shadow-card transition-all group-hover:border-outline-variant/30">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-on-surface font-headline">
                {comment.user.first_name} {comment.user.last_name}
              </span>
              <span className="text-[10px] text-secondary font-medium uppercase tracking-wider">
                {formatRelativeTime(comment.created_at)}
              </span>
            </div>
            
            <p className="text-sm text-on-surface-variant font-body leading-relaxed">
              {comment.content}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-1 ml-1">
            {!isReply && (
              <Button
                variant="ghost"
                onClick={handleReplyClick}
                className="!px-2 !py-1 !text-xs gap-1.5 text-secondary"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Reply
              </Button>
            )}

            {isOwner && (
              <Button
                variant="ghost"
                onClick={() => onDelete(comment.id)}
                disabled={isDeleting}
                className="!px-2 !py-1 !text-xs gap-1.5 text-secondary hover:!text-error"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            )}

            {!isOwner && (
              <ReportButton 
                type="comment" 
                targetId={comment.id} 
              />
            )}
          </div>

          {isReplying && (
            <div className="mt-4 flex gap-3">
              <CornerDownRight className="w-5 h-5 text-outline-variant mt-2" />
              <CommentForm
                placeholder={`Reply to ${comment.user.first_name}...`}
                onSubmit={handleReply}
                isSubmitting={isSubmittingReply}
                autoFocus
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}

          {!isReply && comment.replies && comment.replies.length > 0 && (
            <div className="space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  projectId={projectId}
                  onDelete={onDelete}
                  isDeleting={isDeleting}
                  isReply
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}