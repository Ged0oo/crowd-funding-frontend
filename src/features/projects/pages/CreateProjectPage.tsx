import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  projectDetailsSchema,
  type ProjectDetailsFormData,
} from "../schemas/projectSchema";
import { useCreateProject } from "../hooks/useCreateProject";
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

const CreateProjectPage: React.FC = () => {
  const [step, setStep] = useState<Step>(1);
  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createMutation = useCreateProject();

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
  });

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = methods;

  // ── Step navigation ───────────────────────

  const goToStep2 = async () => {
    const valid = await trigger();
    if (valid) setStep(2);
  };

  const goToStep3 = () => {
    if (images.length === 0) return; // require at least 1 image
    setStep(3);
  };

  // ── Final submit ──────────────────────────

  const onSubmit = async () => {
    const formData = getValues();

    createMutation.mutate(
      {
        title: formData.title,
        details: formData.details,
        category_id: formData.category_id,
        total_target: formData.total_target,
        start_date: formData.start_date,
        end_date: formData.end_date,
        tags,
      },
      {
        onSuccess: async (project) => {
          // Upload images after project is created
          if (images.length > 0) {
            try {
              await import("../api/projectsApi").then(
                ({ uploadProjectImages }) =>
                  uploadProjectImages(
                    project.id,
                    images.map((img) => img.file),
                    setUploadProgress,
                  ),
              );
            } catch {
              console.error(
                "Image upload failed — project was created without images",
              );
            }
          }
          // Navigation handled by useCreateProject hook
        },
      },
    );
  };

  // ── Step indicator ────────────────────────

  const StepIndicator: React.FC = () => (
    <div className="mb-8 flex items-center justify-center gap-2">
      {([1, 2, 3] as const).map((s) => (
        <React.Fragment key={s}>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full 
                        text-sm font-semibold transition-colors
              ${
                s === step
                  ? "bg-blue-600 text-white"
                  : s < step
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
          >
            {s < step ? "✓" : s}
          </div>
          {s < 3 && (
            <div
              className={`h-1 w-16 rounded ${
                s < step ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <PageWrapper>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Create a New Project
        </h1>
        <p className="mb-6 text-gray-600">
          {step === 1 && "Fill in your project details"}
          {step === 2 && "Upload project images"}
          {step === 3 && "Add tags and review your project"}
        </p>

        <StepIndicator />

        <FormProvider {...methods}>
          {/* ── STEP 1: Details ───────────────── */}
          {step === 1 && (
            <form onSubmit={handleSubmit(goToStep2)} className="space-y-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Project Title
                </label>
                <Input
                  {...register("title")}
                  placeholder="Give your project a clear title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Project Details
                </label>
                <Textarea
                  {...register("details")}
                  placeholder="Describe your project in detail..."
                  rows={6}
                />
                {errors.details && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.details.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category
                </label>
                {categoriesLoading ? (
                  <Spinner />
                ) : (
                  <select
                    {...register("category_id", { valueAsNumber: true })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 
                               text-sm focus:border-blue-500 focus:ring-1 
                               focus:ring-blue-500"
                  >
                    <option value={0}>Select a category</option>
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

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Funding Target (EGP)
                </label>
                <Input
                  type="number"
                  {...register("total_target", { valueAsNumber: true })}
                  placeholder="10000"
                  min={1}
                />
                {errors.total_target && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.total_target.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <Input type="date" {...register("start_date")} />
                  {errors.start_date && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.start_date.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <Input type="date" {...register("end_date")} />
                  {errors.end_date && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.end_date.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Next: Upload Images →</Button>
              </div>
            </form>
          )}

          {/* ── STEP 2: Images ───────────────── */}
          {step === 2 && (
            <div className="space-y-6">
              <ImageUploader images={images} onChange={setImages} />

              {images.length === 0 && (
                <p className="text-sm text-amber-600">
                  Please upload at least one image to continue.
                </p>
              )}

              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  ← Back
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
              <TagInput tags={tags} onChange={setTags} />

              {/* Review summary */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Review Your Project
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Title</dt>
                    <dd className="text-gray-900">{getValues("title")}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Details
                    </dt>
                    <dd className="line-clamp-3 text-gray-900">
                      {getValues("details")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Category
                    </dt>
                    <dd className="text-gray-900">
                      {categories?.find(
                        (c) => c.id === getValues("category_id"),
                      )?.name ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Funding Target
                    </dt>
                    <dd className="text-gray-900">
                      {getValues("total_target").toLocaleString()} EGP
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Start Date
                      </dt>
                      <dd className="text-gray-900">
                        {getValues("start_date")}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        End Date
                      </dt>
                      <dd className="text-gray-900">{getValues("end_date")}</dd>
                    </div>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Images
                    </dt>
                    <dd className="text-gray-900">{images.length} image(s)</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tags</dt>
                    <dd className="flex flex-wrap gap-1">
                      {tags.length > 0 ? (
                        tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-blue-100 px-2 py-0.5 
                                       text-xs text-blue-800"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">No tags</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Upload progress */}
              {createMutation.isPending && uploadProgress > 0 && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    Uploading images... {uploadProgress}%
                  </p>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error */}
              {createMutation.isError && (
                <p className="text-sm text-red-600">
                  {createMutation.error?.message ||
                    "Failed to create project. Please try again."}
                </p>
              )}

              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  ← Back
                </Button>
                <Button onClick={onSubmit} disabled={createMutation.isPending}>
                  {createMutation.isPending
                    ? "Creating..."
                    : "🚀 Create Project"}
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
