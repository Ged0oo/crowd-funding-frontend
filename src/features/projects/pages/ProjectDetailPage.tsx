import React from "react";
import { useParams, Link } from "react-router-dom";
import { useProject } from "../hooks/useProject";
import { useAuthStore } from "../../auth/stores/authStore";

import ImageSlider from "../components/ImageSlider";
import SimilarProjects from "../components/SimilarProjects";
import CancelProjectBtn from "../components/CancelProjectBtn";
import Badge from "../../../shared/components/ui/Badge";
import Spinner from "../../../shared/components/ui/Spinner";
import PageWrapper from "../../../shared/components/layout/PageWrapper";
import CommentThread from '../../social/components/CommentThread';
import DonationProgress from '../../social/components/DonationProgress';
import DonateWidget from '../../social/components/DonateWidget';
import StarRating from '../../social/components/StarRating';
import ReportButton from '../../social/components/ReportButton';

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const { data: project, isLoading, isError, error } = useProject(projectId);
  const user = useAuthStore((state) => state.user);

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner />
        </div>
      </PageWrapper>
    );
  }

  if (isError || !project) {
    return (
      <PageWrapper>
        <div className="flex min-h-[50vh] flex-col items-center justify-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Project Not Found
          </h2>
          <p className="mb-6 text-gray-600">
            {error?.message || "The project you're looking for doesn't exist."}
          </p>
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const rawProject = project as unknown as {
    id: number;
    title?: string;
    details?: string;
    creator?: {
      id?: number | string;
      first_name?: string;
      last_name?: string;
      profile_picture?: string | null;
    };
    owner?: {
      id?: number | string;
      first_name?: string;
      last_name?: string;
      profile_picture?: string | null;
    };
    category?: { name?: string; slug?: string } | null;
    tags?: Array<{ id: number; name: string }>;
    images?: Array<{ id: number; image: string; created_at: string }>;
    media?: Array<{ id: number; image: string; created_at: string }>;
    current_amount?: number | string;
    current_donations?: number | string;
    total_target?: number | string;
    funded_pct?: number | string;
    funded_percentage?: number | string;
    avg_rating?: number | string;
    average_rating?: number | string;
    rating_count?: number;
    is_featured?: boolean;
    is_cancelled?: boolean;
    is_running?: boolean;
    start_date?: string;
    end_date?: string;
    start_time?: string;
    end_time?: string;
    created_at?: string;
  };

  const creator = rawProject.creator ?? rawProject.owner;
  const creatorFirstName = creator?.first_name ?? "Unknown";
  const creatorLastName = creator?.last_name ?? "User";
  const creatorInitials = `${creatorFirstName[0] ?? "U"}${creatorLastName[0] ?? "U"}`;

  const images = rawProject.images ?? rawProject.media ?? [];
  const tags = rawProject.tags ?? [];

  const totalTarget = toNumber(rawProject.total_target);
  const currentAmount =
    toNumber(rawProject.current_donations) ||
    toNumber(rawProject.current_amount);
  const fundedPct =
    rawProject.funded_pct !== undefined
      ? toNumber(rawProject.funded_pct)
      : rawProject.funded_percentage !== undefined
        ? toNumber(rawProject.funded_percentage)
        : totalTarget > 0
          ? (currentAmount / totalTarget) * 100
          : 0;

  const startDate = rawProject.start_date ?? rawProject.start_time;
  const endDate = rawProject.end_date ?? rawProject.end_time;
  const isRunning = Boolean(rawProject.is_running);
  const isCancelled = Boolean(rawProject.is_cancelled);

  const projectIdValue = toNumber(rawProject.id);
  const isOwner =
    creator?.id !== undefined &&
    user?.id !== undefined &&
    String(user.id) === String(creator.id);

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Image slider */}
          <ImageSlider images={images} />

          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {project.category && (
                <Link to={`/categories/${rawProject.category?.slug}`}>
                  <Badge>{rawProject.category?.name}</Badge>
                </Link>
              )}
              {rawProject.is_featured && <Badge>⭐ Featured</Badge>}
              {isCancelled && <Badge>Cancelled</Badge>}
              {!isCancelled && isRunning && <Badge>Running</Badge>}
              {!isCancelled && !isRunning && <Badge>Ended</Badge>}
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              {rawProject.title ?? "Untitled Project"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {creator?.profile_picture ? (
              <img
                src={creator.profile_picture}
                alt={creatorFirstName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                {creatorInitials}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {creatorFirstName} {creatorLastName}
              </p>
              <p className="text-xs text-gray-500">
                Created{" "}
                {rawProject.created_at
                  ? new Date(rawProject.created_at).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              About This Project
            </h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {rawProject.details ?? "No details provided."}
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/search?tag=${tag.name}`}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 transition hover:bg-gray-200"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <section id="comments-slot" className="border-t border-gray-200 pt-8">
            <CommentThread projectId={projectIdValue} />
          </section>
        </div>

        {/* ════════════════════════════════════════ */}
        {/* RIGHT COLUMN — Sidebar (1/3)            */}
        {/* ════════════════════════════════════════ */}
        <div className="space-y-6">
          <section id="donation-progress-slot">
            <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 shadow-card">
              <DonationProgress 
                current={currentAmount} 
                target={totalTarget} 
                percentage={fundedPct} 
              />
            </div>
          </section>

          <section id="donate-widget-slot">
            <DonateWidget projectId={projectIdValue} />
          </section>

          <section id="star-rating-slot">
            <div className="flex items-center gap-4 py-6 border-y border-outline-variant/10">
              <span className="text-sm font-bold text-secondary uppercase tracking-widest">
                Rate this project:
              </span>
              <StarRating 
                projectId={projectIdValue} 
                initialRating={toNumber(rawProject.avg_rating || rawProject.average_rating)} 
              />
            </div>
          </section>

          {/* Campaign dates */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
              Campaign Period
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Start</span>
                <span className="font-medium text-gray-900">
                  {startDate ? new Date(startDate).toLocaleDateString() : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">End</span>
                <span className="font-medium text-gray-900">
                  {endDate ? new Date(endDate).toLocaleDateString() : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`font-medium ${
                    isRunning
                      ? "text-green-600"
                      : isCancelled
                        ? "text-red-600"
                        : "text-gray-600"
                  }`}
                >
                  {isCancelled ? "Cancelled" : isRunning ? "Running" : "Ended"}
                </span>
              </div>
            </div>
          </div>

          <section id="report-button-slot">
            <div className="flex justify-center">
              <ReportButton targetId={projectIdValue} type="project" />
            </div>
          </section>

          {/* Cancel button — owner only, funded < 25% */}
          <CancelProjectBtn
            projectId={projectIdValue}
            fundedPct={fundedPct}
            isOwner={isOwner}
            isCancelled={isCancelled}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* Similar Projects — full width bottom    */}
      {/* ═══════════════════════════════════════ */}
      <SimilarProjects projectId={projectIdValue} />
    </PageWrapper>
  );
};

export default ProjectDetailPage;
