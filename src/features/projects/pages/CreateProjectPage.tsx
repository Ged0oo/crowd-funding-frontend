import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  projectDetailsSchema,
  type ProjectDetailsFormData,
} from "../schemas/projectSchema";
import { createProject, uploadProjectImages } from "../api/projectsApi";
import { useCategories } from "../hooks/useCategories";
import ImageUploader, {
  type FileWithPreview,
} from "../components/ImageUploader";
import TagInput from "../components/TagInput";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import Textarea from "../../../shared/components/ui/Textarea";
import Spinner from "../../../shared/components/ui/Spinner";
import PageWrapper from "../../../shared/components/layout/PageWrapper";

type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, string> = {
  1: "Project Details",
  2: "Upload Images",
  3: "Tags & Review",
};

const CreateProjectPage: React.FC = () => {
  const [step, setStep] = useState<Step>(1);
  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // ── Step 1 Form ───────────────────────────

  const methods = useForm<ProjectDetailsFormData>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: {
      title: "",
      details: "",
      category_id: 0,
      total_target: 0,
      start_date: "",
      end_date: "",
    },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = methods;

  // Watch values for review section
  const watchedValues = watch();

  // ── Step navigation ───────────────────────

  const goToStep2 = async () => {
    const valid = await trigger();
    if (valid) setStep(2);
  };

  const goToStep3 = () => {
    if (images.length === 0) return;
    setStep(3);
  };

  // ── Final submit ──────────────────────────

  const onSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    setUploadProgress(0);

    try {
      const formData = getValues();

      const project = await createProject({
        title: formData.title,
        details: formData.details,
        category_id: formData.category_id,
        total_target: formData.total_target,
        start_date: formData.start_date,
        end_date: formData.end_date,
        tags,
      });

      if (images.length > 0) {
        try {
          setUploadProgress(10);
          await uploadProjectImages(
            project.id,
            images.map((img) => img.file),
            (percent) => setUploadProgress(percent),
          );
          setUploadProgress(100);
        } catch {
          console.error("Image upload partially failed");
        }
      }

      // Cleanup previews
      images.forEach((img) => URL.revokeObjectURL(img.preview));

      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate(`/projects/${project.id}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to create project. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step indicator ────────────────────────

  const StepIndicator: React.FC = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2">
        {([1, 2, 3] as const).map((s) => (
          <React.Fragment key={s}>
            <button
              type="button"
              onClick={() => {
                if (s < step) setStep(s);
              }}
              disabled={s > step}
              className={`flex h-10 w-10 items-center justify-center rounded-full 
                          text-sm font-semibold transition-all
                ${
                  s === step
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : s < step
                      ? "bg-green-500 text-white cursor-pointer hover:bg-green-600"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
            >
              {s < step ? (
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                s
              )}
            </button>
            {s < 3 && (
              <div
                className={`h-1 w-12 rounded sm:w-20 ${
                  s < step ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="mt-3 text-center text-sm font-medium text-gray-600">
        Step {step}: {STEP_LABELS[step]}
      </p>
    </div>
  );

  return (
    <PageWrapper>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Create a New Project
        </h1>
        <p className="mb-8 text-gray-600">
          Launch your fundraising campaign in three simple steps.
        </p>

        <StepIndicator />

        <FormProvider {...methods}>
          {/* ── STEP 1: Details ───────────────── */}
          {step === 1 && (
            <form
              onSubmit={handleSubmit(goToStep2)}
              className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <Input
                label="Project Title"
                {...register("title")}
                error={errors.title?.message}
                placeholder="Give your project a clear, compelling title"
              />

              <Textarea
                label="Project Details"
                {...register("details")}
                error={errors.details?.message}
                placeholder="Describe your project, its goals, and why people should support it..."
                rows={6}
              />

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                {categoriesLoading ? (
                  <div className="flex items-center gap-2 py-2">
                    <Spinner />{" "}
                    <span className="text-sm text-gray-500">
                      Loading categories...
                    </span>
                  </div>
                ) : (
                  <select
                    {...register("category_id", { valueAsNumber: true })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 
                               text-sm focus:border-blue-500 focus:ring-1 
                               focus:ring-blue-500 focus:outline-none
                               bg-white transition-colors"
                  >
                    <option value={0}>Select a category...</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
                {errors.category_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.category_id.message}
                  </p>
                )}
              </div>

              <Input
                label="Funding Target (EGP)"
                type="number"
                {...register("total_target", { valueAsNumber: true })}
                error={errors.total_target?.message}
                placeholder="10000"
                min={1}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Start Date"
                  type="date"
                  {...register("start_date")}
                  error={errors.start_date?.message}
                />
                <Input
                  label="End Date"
                  type="date"
                  {...register("end_date")}
                  error={errors.end_date?.message}
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button type="submit">Next: Upload Images →</Button>
              </div>
            </form>
          )}

          {/* ── STEP 2: Images ───────────────── */}
          {step === 2 && (
            <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Project Images
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  The first image will be used as the cover image on project
                  cards.
                </p>
              </div>

              <ImageUploader
                images={images}
                onChange={setImages}
                disabled={isSubmitting}
              />

              {images.length === 0 && (
                <div className="rounded-lg bg-amber-50 p-3">
                  <p className="text-sm text-amber-700">
                    ⚠️ Please upload at least one image to continue.
                  </p>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  ← Back to Details
                </Button>
                <Button onClick={goToStep3} disabled={images.length === 0}>
                  Next: Add Tags →
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Tags + Review ────────── */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Tags section */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Tags
                </h2>
                <TagInput tags={tags} onChange={setTags} />
              </div>

              {/* Review summary */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-lg font-semibold text-gray-900">
                  Review Your Project
                </h2>

                <dl className="divide-y divide-gray-100">
                  {/* Title */}
                  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Title</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {watchedValues.title || "—"}
                    </dd>
                  </div>

                  {/* Details */}
                  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Details
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 line-clamp-3">
                      {watchedValues.details || "—"}
                    </dd>
                  </div>

                  {/* Category */}
                  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Category
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {categories?.find(
                        (c) => c.id === watchedValues.category_id,
                      )?.name ?? "—"}
                    </dd>
                  </div>

                  {/* Funding target */}
                  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Funding Target
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-green-700 sm:col-span-2 sm:mt-0">
                      {watchedValues.total_target
                        ? `${watchedValues.total_target.toLocaleString()} EGP`
                        : "—"}
                    </dd>
                  </div>

                  {/* Dates */}
                  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Campaign Period
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {watchedValues.start_date && watchedValues.end_date ? (
                        <>
                          {new Date(
                            watchedValues.start_date,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          →{" "}
                          {new Date(watchedValues.end_date).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>

                  {/* Images */}
                  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Images
                    </dt>
                    <dd className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="flex flex-wrap gap-2">
                        {images.map((img, index) => (
                          <div
                            key={img.id}
                            className="relative h-16 w-16 overflow-hidden rounded-md border border-gray-200"
                          >
                            <img
                              src={img.preview}
                              alt={`Preview ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            {index === 0 && (
                              <span
                                className="absolute bottom-0 left-0 right-0 bg-blue-600 
                                            px-1 py-0.5 text-center text-[9px] text-white"
                              >
                                Cover
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {images.length} image{images.length !== 1 && "s"}
                      </p>
                    </dd>
                  </div>

                  {/* Tags */}
                  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Tags</dt>
                    <dd className="mt-1 sm:col-span-2 sm:mt-0">
                      {tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-blue-100 px-2.5 py-0.5 
                                         text-xs font-medium text-blue-800"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">
                          No tags added
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Upload progress */}
              {isSubmitting && uploadProgress > 0 && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-center gap-3">
                    <Spinner />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800">
                        {uploadProgress < 100
                          ? "Uploading images..."
                          : "Finalizing..."}
                      </p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-blue-200">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-blue-600">
                        {uploadProgress}% complete
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {submitError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex gap-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        Something went wrong
                      </p>
                      <p className="mt-1 text-sm text-red-600">{submitError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-between pt-2">
                <Button
                  variant="secondary"
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                >
                  ← Back to Images
                </Button>
                <Button
                  onClick={onSubmit}
                  disabled={isSubmitting}
                  className="min-w-45"
                >
                  {isSubmitting ? (
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
                      Creating Project...
                    </span>
                  ) : (
                    "🚀 Create Project"
                  )}
                </Button>
              </div>
            </div>
          )}
        </FormProvider>
      </div>
    </PageWrapper>
  );
};

export default CreateProjectPage;
