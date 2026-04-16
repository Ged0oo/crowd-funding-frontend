import React, { useState } from "react";
import { useCancelProject } from "../hooks/useCreateProject";
import Button from "../../../shared/components/ui/Button";
import Modal from "../../../shared/components/ui/Modal";

import type { CancelProjectBtnProps } from "../../../types/projects";

const CancelProjectBtn: React.FC<CancelProjectBtnProps> = ({
  projectId,
  fundedPct,
  isOwner,
  isCancelled,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { mutate: cancel, isPending, error } = useCancelProject(projectId);

  if (!isOwner) return null;
  if (isCancelled) return null;
  if (fundedPct >= 25) return null;

  const handleConfirm = () => {
    cancel(undefined, {
      onSuccess: () => {
        setShowModal(false);
      },
    });
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setShowModal(true)}
        className="w-full"
      >
        Cancel Project
      </Button>

      <Modal open={showModal} title="Cancel Project">
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to cancel this project? This action{" "}
            <strong>cannot be undone</strong>.
          </p>
          <p className="text-sm text-gray-500">
            Current funding: <strong>{fundedPct.toFixed(1)}%</strong> of target
          </p>

          {error && (
            <p className="text-sm text-red-600">
              {error.message || "Failed to cancel project. Please try again."}
            </p>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              disabled={isPending}
            >
              Keep Project
            </Button>
            <Button
              variant="secondary"
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending ? "Cancelling..." : "Yes, Cancel Project"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CancelProjectBtn;
export type { CancelProjectBtnProps };
