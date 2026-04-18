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
  const {
    mutate: cancel,
    isPending,
    error,
    reset: resetMutation,
  } = useCancelProject(projectId);

  if (!isOwner) return null;
  if (isCancelled) return null;
  if (fundedPct >= 25) return null;

  const handleOpenModal = () => {
    resetMutation();
    setShowModal(true);
  };

  const handleConfirm = () => {
    cancel(undefined, {
      onSuccess: () => {
        setShowModal(false);
      },
    });
  };

  const handleClose = () => {
    if (!isPending) {
      setShowModal(false);
    }
  };
  return (
    <>
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <h4 className="mb-2 text-sm font-semibold text-red-800">Danger Zone</h4>
        <p className="mb-3 text-xs text-red-600">
          You can cancel this project because it has received less than 25% of
          its funding goal ({fundedPct.toFixed(1)}% funded).
        </p>
        <Button variant="danger" onClick={handleOpenModal} className="w-full">
          Cancel Project
        </Button>
      </div>

      <Modal open={showModal} onClose={handleClose} title="Cancel Project">
        <div className="space-y-4">
          {/* Warning icon */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Are you absolutely sure?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              This action{" "}
              <strong className="text-red-600">cannot be undone</strong>. The
              project will be permanently marked as cancelled and will no longer
              accept donations.
            </p>
          </div>

          {/* Current funding info */}
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Current funding</span>
              <span className="font-medium text-gray-900">
                {fundedPct.toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${Math.min(fundedPct, 100)}%` }}
              />
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-sm text-red-700">
                {(error as Error).message ||
                  "Failed to cancel project. Please try again."}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1"
            >
              Keep Project
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirm}
              disabled={isPending}
              className="flex-1"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Cancelling...
                </span>
              ) : (
                "Yes, Cancel Project"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CancelProjectBtn;
export type { CancelProjectBtnProps };
