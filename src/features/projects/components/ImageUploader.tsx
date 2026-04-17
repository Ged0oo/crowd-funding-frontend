import React, { useState, useRef, useCallback } from "react";

import type {
  FileWithPreview,
  ImageUploaderProps,
} from "../../../types/projects";

const maxSize = 5;
const acceptedFormats = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxFiles = 10,
  maxSizeMB = maxSize,
  disabled = false,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateAndAddFiles = useCallback(
    (fileList: FileList | File[]) => {
      setError(null);
      const files = Array.from(fileList);
      const newImages: FileWithPreview[] = [];
      for (const file of files) {
        // Max count check
        if (images.length + newImages.length >= maxFiles) {
          setError(`You can only upload up to ${maxFiles} images.`);
          break;
        }

        // Format check
        if (!acceptedFormats.includes(file.type)) {
          setError("Please upload only image files (JPEG, PNG, WebP, GIF).");
          return;
        }

        // Size check
        if (file.size > maxSizeBytes) {
          setError(`File size exceeds ${maxSizeMB} MB limit.`);
          return;
        }

        const duplicate = images.some(
          (img) => img.file.name === file.name && img.file.size === file.size,
        );
        if (duplicate) {
          setError(`File "${file.name}" is already added.`);
          continue;
        }

        newImages.push({
          file,
          preview: URL.createObjectURL(file),
          id: `${file.name}-${file.size}-${file.lastModified}`,
          progress: 0,
          status: "pending",
        });
      }

      if (newImages.length > 0) {
        onChange([...images, ...newImages]);
      }
    },
    [images, onChange, maxFiles, maxSizeBytes, maxSizeMB],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setDragOver(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (
        !disabled &&
        e.dataTransfer.files &&
        e.dataTransfer.files.length > 0
      ) {
        validateAndAddFiles(e.dataTransfer.files);
      }
    },
    [validateAndAddFiles, disabled],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        validateAndAddFiles(e.target.files);
        e.target.value = "";
      }
    },
    [validateAndAddFiles],
  );

  const handleRemove = useCallback(
    (id: string) => {
      const updated = images.filter((img) => img.id !== id);
      const removed = images.find((img) => img.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      onChange(updated);
    },
    [images, onChange],
  );

  const handleMoveLeft = useCallback(
    (index: number) => {
      if (index === 0) return;
      const newImages = [...images];
      [newImages[index - 1], newImages[index]] = [
        newImages[index],
        newImages[index - 1],
      ];
      onChange(newImages);
    },
    [images, onChange],
  );

  const handleMoveRight = useCallback(
    (index: number) => {
      if (index === images.length - 1) return;
      const newImages = [...images];
      [newImages[index], newImages[index + 1]] = [
        newImages[index + 1],
        newImages[index],
      ];
      onChange(newImages);
    },
    [images, onChange],
  );

  return (
    <div className="space-y-4">
      {/* ── Drop zone ────────────────────────── */}
      {images.length < maxFiles && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center 
                      rounded-lg border-2 border-dashed p-8 transition-all
                      ${disabled ? "cursor-not-allowed opacity-50" : ""}
                      ${
                        dragOver
                          ? "border-blue-500 bg-blue-50 scale-[1.01]"
                          : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50"
                      }`}
        >
          <svg
            className="mb-3 h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mb-1 text-sm font-medium text-gray-700">
            {dragOver
              ? "Drop images here..."
              : "Drag & drop images here, or click to browse"}
          </p>
          <p className="text-xs text-gray-500">
            JPG, PNG, WebP, GIF · Max {maxSizeMB}MB each · Up to {maxFiles}{" "}
            images
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={acceptedFormats.join(",")}
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />
        </div>
      )}

      {/* ── Errors ───────────────────────────── */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3">
          <p className="text-sm text-red-600">⚠️ {error}</p>
        </div>
      )}

      {/* ── Preview grid ─────────────────────── */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-lg border border-gray-200 
                         bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-32">
                <img
                  src={img.preview}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                {/* First image badge */}
                {index === 0 && (
                  <span
                    className="absolute left-1 top-1 rounded bg-blue-600 px-1.5 py-0.5 
                                text-xs font-medium text-white"
                  >
                    Cover
                  </span>
                )}

                {/* Progress overlay (during upload) */}
                {img.status === "uploading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">
                        {img.progress}%
                      </div>
                      <div className="mx-4 mt-1 h-1.5 overflow-hidden rounded-full bg-white/30">
                        <div
                          className="h-full rounded-full bg-white transition-all"
                          style={{ width: `${img.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Error overlay */}
                {img.status === "error" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/40">
                    <span className="text-sm font-medium text-white">
                      Upload failed
                    </span>
                  </div>
                )}

                {/* Action buttons (hover) */}
                <div
                  className="absolute right-1 top-1 flex gap-1 opacity-0 
                              transition-opacity group-hover:opacity-100"
                >
                  {/* Move left */}
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveLeft(index);
                      }}
                      className="rounded-full bg-white/90 p-1 text-gray-700 
                                 shadow hover:bg-white"
                      title="Move left (make cover)"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Move right */}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveRight(index);
                      }}
                      className="rounded-full bg-white/90 p-1 text-gray-700 
                                 shadow hover:bg-white"
                      title="Move right"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(img.id);
                    }}
                    className="rounded-full bg-red-500/90 p-1 text-white 
                               shadow hover:bg-red-600"
                    title="Remove"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* File info */}
              <div className="px-2 py-1.5">
                <p className="truncate text-xs font-medium text-gray-700">
                  {img.file.name}
                </p>
                <p className="text-xs text-gray-400">
                  {formatSize(img.file.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Counter ──────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {images.length} / {maxFiles} images
          {images.length === 0 && (
            <span className="ml-2 text-amber-600">(at least 1 required)</span>
          )}
        </p>
        {images.length > 0 && (
          <button
            type="button"
            onClick={() => {
              images.forEach((img) => URL.revokeObjectURL(img.preview));
              onChange([]);
            }}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Remove all
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
export type { FileWithPreview, ImageUploaderProps };
