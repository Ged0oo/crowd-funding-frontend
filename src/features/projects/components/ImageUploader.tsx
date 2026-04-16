import React, { useState, useRef, useCallback } from "react";

import type {
  FileWithPreview,
  ImageUploaderProps,
} from "../../../types/projects";

const maxSize = 5;

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxFiles = 10,
  maxSizeMB = maxSize,
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
        if (images.length + newImages.length >= maxFiles) {
          setError(`You can only upload up to ${maxFiles} images.`);
          break;
        }
        if (!file.type.startsWith("image/")) {
          setError("Please upload only image files.");
          return;
        }
        if (file.size > maxSizeBytes) {
          setError(`File size exceeds ${maxSizeMB} MB limit.`);
          return;
        }
        newImages.push({
          file,
          preview: URL.createObjectURL(file),
          id: `${file.name}-${file.size}-${file.lastModified}`,
        });
      }
      if (newImages.length > 0) {
        onChange([...images, ...newImages]);
      }
    },
    [images, onChange, maxFiles, maxSizeBytes, maxSizeMB],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateAndAddFiles(e.dataTransfer.files);
      }
    },
    [validateAndAddFiles],
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

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center 
                    rounded-lg border-2 border-dashed p-8 transition-colors
                    ${
                      dragOver
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-gray-50 hover:border-gray-400"
                    }`}
      >
        <svg
          className="mb-3 h-10 w-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="mb-1 text-sm font-medium text-gray-700">
          Drag & drop images here, or click to browse
        </p>
        <p className="text-xs text-gray-500">
          Max {maxFiles} images · {maxSizeMB}MB each · JPG, PNG, WebP
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-lg border border-gray-200"
            >
              <img
                src={img.preview}
                alt="Preview"
                className="h-32 w-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(img.id);
                }}
                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 
                           text-white opacity-0 transition-opacity 
                           group-hover:opacity-100 hover:bg-red-600"
              >
                <svg
                  className="h-4 w-4"
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
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                <p className="truncate text-xs text-white">{img.file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Counter */}
      <p className="text-sm text-gray-500">
        {images.length} / {maxFiles} images selected
      </p>
    </div>
  );
};

export default ImageUploader;
export type { FileWithPreview, ImageUploaderProps };
