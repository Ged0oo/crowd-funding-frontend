import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../auth/stores/authStore"
import { AlertTriangle } from "lucide-react"
import { useReport } from "../hooks/useReport"
import { toast } from "sonner"
import Modal from "../../../shared/components/ui/Modal"
import Button from "../../../shared/components/ui/Button"
import Spinner from "../../../shared/components/ui/Spinner"

const REPORT_REASONS = [
  "Spam or misleading",
  "Harassment",
  "Inappropriate content",
  "Fraud or scam",
  "Intellectual property violation",
  "Hate speech",
  "Other"
]

interface ReportButtonProps {
  targetId: number
  type: "project" | "comment"
}

export default function ReportButton({ targetId, type }: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  
  const { sendProjectReport, sendCommentReport, isReporting } = useReport()

  const handleOpenModal = () => {
    if (!user) {
      toast.info(`Please login to report this ${type}`)
      navigate("/authenticate")
      return
    }
    setIsOpen(true)
  }

  const handleReport = async (reason: string) => {
    try {
      if (type === "project") {
        await sendProjectReport({ projectId: targetId, reason })
      } else {
        await sendCommentReport({ commentId: targetId, reason })
      }
      toast.success("Report submitted for review")
      setIsOpen(false)
    } catch {
      toast.error("Failed to submit report")
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        onClick={handleOpenModal}
        className="!gap-2 !px-3 !py-1.5 !text-xs text-secondary hover:!text-error uppercase tracking-wider"
      >
        <AlertTriangle size={14} />
        Report {type}
      </Button>

      <Modal
        open={isOpen}
        title={`Report ${type}`}
        onClose={() => setIsOpen(false)}
      >
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase text-secondary mb-3 px-1">
            Select a reason for reporting
          </p>
          <div className="flex flex-col gap-1 max-h-80 overflow-y-auto pr-1">
            {REPORT_REASONS.map((reason) => (
              <Button
                key={reason}
                variant="ghost"
                disabled={isReporting}
                onClick={() => handleReport(reason)}
                className="!justify-start !text-sm !py-3 !px-4 hover:!bg-primary/5 text-on-surface"
              >
                {isReporting ? (
                  <div className="flex items-center gap-3">
                    <Spinner size="sm" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  reason
                )}
              </Button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  )
}
