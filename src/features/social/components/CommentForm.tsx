import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../../app/store"
import { SendHorizonal } from "lucide-react"
import { toast } from "sonner"
import Textarea from "../../../shared/components/ui/Textarea"
import Button from "../../../shared/components/ui/Button"
import Spinner from "../../../shared/components/ui/Spinner"

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment too long"),
})

type CommentFormValues = z.infer<typeof commentSchema>

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>
  isSubmitting: boolean
  placeholder?: string
  autoFocus?: boolean
  onCancel?: () => void
  initialValue?: string
}

export default function CommentForm({
  onSubmit,
  isSubmitting,
  placeholder = "Write a comment...",
  autoFocus = false,
  onCancel,
  initialValue = "",
}: CommentFormProps) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: initialValue },
  })

  const handleFormSubmit = async (data: CommentFormValues) => {
    if (!user) {
      toast.info("Please login to post a comment")
      navigate("/authenticate")
      return
    }

    try {
      await onSubmit(data.content)
      reset()
    } catch (err) {
			//should be handled before hand
			console.error("Failed to submit comment:", err)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit(handleFormSubmit)} 
      className="w-full space-y-3"
    >
      <div className="relative group">
        <Textarea
          {...register("content")}
          autoFocus={autoFocus}
          placeholder={placeholder}
          rows={3}
          className={`pr-12 ${errors.content ? "border-error" : ""}`}
        />
        
        <Button
          type="submit"
          disabled={isSubmitting || !isValid}
          variant="primary"
          className="absolute right-3 bottom-3 !p-2 !rounded-xl"
        >
          {isSubmitting ? (
            <Spinner size="sm" />
          ) : (
            <SendHorizonal className="w-5 h-5" />
          )}
        </Button>
      </div>

      {(errors.content || onCancel) && (
        <div className="flex justify-between items-center px-1">
          {errors.content ? (
            <p className="text-error text-xs font-medium">{errors.content.message}</p>
          ) : <div />}
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-bold text-secondary hover:text-on-surface transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </form>
  )
}