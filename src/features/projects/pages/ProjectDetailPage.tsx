import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProject } from "../hooks/useProject";
import { useAuthStore } from "../../auth/stores/authStore";
import type { CampaignDatesCardProps } from "../../../types/projects";

import ImageSlider from "../components/ImageSlider";
import SimilarProjects from "../components/SimilarProjects";
import CancelProjectBtn from "../components/CancelProjectBtn";
import Badge from "../../../shared/components/ui/Badge";
import Spinner from "../../../shared/components/ui/Spinner";
import PageWrapper from "../../../shared/components/layout/PageWrapper";
import CommentThread from "../../social/components/CommentThread";
import DonationProgress from "../../social/components/DonationProgress";
import DonateWidget from "../../social/components/DonateWidget";
import StarRating from "../../social/components/StarRating";
import ReportButton from "../../social/components/ReportButton";

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const navigate = useNavigate();
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
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
          <svg
            className="mb-4 h-16 w-16 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Project Not Found
          </h2>
          <p className="mb-6 text-gray-600">
            {error?.message || "The project you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </PageWrapper>
    );
  }

  const creator = project.creator;
  const category = project.category;
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const images = Array.isArray(project.images) ? project.images : [];
  const now = new Date();
  const campaignStart = new Date(project.start_date);
  const campaignEnd = new Date(project.end_date);
  const isUpcoming = !project.is_cancelled && now < campaignStart;
  const isEnded =
    !project.is_cancelled && now >= campaignEnd && !project.is_running;
  const creatorFirstName = creator?.first_name ?? "Unknown";
  const creatorLastName = creator?.last_name ?? "Creator";
  const creatorInitials = `${creatorFirstName[0] ?? "U"}${creatorLastName[0] ?? "C"}`;

  const normalizedUserEmail = user?.email?.trim().toLowerCase();
  const normalizedCreatorEmail = creator?.email?.trim().toLowerCase();
  const isOwner = Boolean(
    creator &&
    user &&
    (String(user.id) === String(creator.id) ||
      (normalizedUserEmail && normalizedCreatorEmail
        ? normalizedUserEmail === normalizedCreatorEmail
        : false)),
  );
  const isAuthenticated = !!user;

  return (
    <PageWrapper>
      {/* ── Breadcrumb ───────────────────────── */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <span>/</span>
        {category && (
          <>
            <Link
              to={`/categories/${category.slug}`}
              className="hover:text-blue-600"
            >
              {category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900">{project.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ════════════════════════════════════════ */}
        {/* LEFT COLUMN — Project Content (2/3)     */}
        {/* ════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image slider */}
          <ImageSlider images={images} />

          {/* Title + status badges */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {category && (
                <Link to={`/categories/${category.slug}`}>
                  <Badge variant="neutral">{category.name}</Badge>
                </Link>
              )}
              {project.is_featured && (
                <Badge variant="primary">⭐ Featured</Badge>
              )}
              {project.is_cancelled && <Badge variant="error">Cancelled</Badge>}
              {isUpcoming && <Badge variant="neutral">Upcoming</Badge>}
              {!project.is_cancelled && project.is_running && (
                <Badge variant="success">Running</Badge>
              )}
              {isEnded && <Badge variant="neutral">Ended</Badge>}
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              {project.title}
            </h1>
          </div>

          {/* Creator info */}
          <div className="flex items-center gap-3">
            {creator?.profile_picture ? (
              <img
                src={creator.profile_picture}
                alt={creatorFirstName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div
                className="flex h-10 w-10 items-center justify-center 
                            rounded-full bg-blue-100 text-sm font-semibold text-blue-700"
              >
                {creatorInitials}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {creatorFirstName} {creatorLastName}
              </p>
              <p className="text-xs text-gray-500">
                Created{" "}
                {new Date(project.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            {isOwner && (
              <Badge variant="primary" className="ml-auto">
                Your Project
              </Badge>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              About This Project
            </h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
              {project.details}
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
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm 
                               text-gray-700 transition hover:bg-gray-200"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════ */}
          {/* STAR RATING — inline under content  */}
          {/* ═══════════════════════════════════ */}
          <section className="border-t border-gray-200 pt-6">
            <StarRating
              projectId={project.id}
              initialRating={project.avg_rating}
            />
          </section>

          {/* ═══════════════════════════════════ */}
          {/* COMMENT THREAD                      */}
          {/* ═══════════════════════════════════ */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Comments
            </h2>
            <CommentThread projectId={project.id} />
          </section>
        </div>

        {/* ════════════════════════════════════════ */}
        {/* RIGHT COLUMN — Sidebar (1/3)            */}
        {/* ════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Sticky sidebar on desktop */}
          <div className="lg:sticky lg:top-6 space-y-6">
            {/* ═══════════════════════════════════ */}
            {/* DONATION PROGRESS                   */}
            {/* ═══════════════════════════════════ */}
            <DonationProgress
              currentAmount={project.current_amount}
              totalTarget={project.total_target}
              fundedPct={project.funded_pct}
            />

            {/* ═══════════════════════════════════ */}
            {/* DONATE WIDGET                       */}
            {/* ═══════════════════════════════════ */}
            {!project.is_cancelled && <DonateWidget projectId={project.id} />}

            {/* Campaign dates */}
            <CampaignDatesCard
              startDate={project.start_date}
              endDate={project.end_date}
              isRunning={project.is_running}
              isCancelled={project.is_cancelled}
              createdAt={project.created_at}
            />

            {/* ═══════════════════════════════════ */}
            {/* REPORT BUTTON                       */}
            {/* ═══════════════════════════════════ */}
            {isAuthenticated && !isOwner && (
              <ReportButton type="project" targetId={project.id} />
            )}

            {/* Cancel button — owner only, funded < 25% */}
            <CancelProjectBtn
              projectId={project.id}
              fundedPct={project.funded_pct}
              isOwner={isOwner}
              isCancelled={project.is_cancelled}
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* Similar Projects — full width bottom    */}
      {/* ═══════════════════════════════════════ */}
      <SimilarProjects projectId={project.id} />
    </PageWrapper>
  );
};

const CampaignDatesCard: React.FC<CampaignDatesCardProps> = ({
  startDate,
  endDate,
  isRunning,
  isCancelled,
  createdAt,
}) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  const isUpcoming = !isCancelled && now < start;
  const isEnded = !isCancelled && now >= end && !isRunning;

  // Calculate days remaining
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.max(
    0,
    Math.ceil((end.getTime() - now.getTime()) / msPerDay),
  );
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / msPerDay);
  const daysElapsed = totalDays - daysRemaining;
  const timeProgressPct = totalDays > 0 ? (daysElapsed / totalDays) * 100 : 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Campaign Period
      </h3>

      {/* Time progress bar */}
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs text-gray-500">
          <span>{start.toLocaleDateString()}</span>
          <span>{end.toLocaleDateString()}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full transition-all ${
              isCancelled
                ? "bg-red-400"
                : isRunning
                  ? "bg-blue-500"
                  : "bg-gray-400"
            }`}
            style={{ width: `${Math.min(timeProgressPct, 100)}%` }}
          />
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <span
            className={`font-medium ${
              isCancelled
                ? "text-red-600"
                : isRunning
                  ? "text-green-600"
                  : isUpcoming
                    ? "text-amber-600"
                    : "text-gray-600"
            }`}
          >
            {isCancelled
              ? "Cancelled"
              : isRunning
                ? "Running"
                : isUpcoming
                  ? "Upcoming"
                  : isEnded
                    ? "Ended"
                    : "Active"}
          </span>
        </div>

        {(isRunning || isUpcoming) && (
          <div className="flex justify-between">
            <span className="text-gray-500">
              {isUpcoming ? "Starts In" : "Days Left"}
            </span>
            <span className="font-medium text-gray-900">
              {daysRemaining} {daysRemaining === 1 ? "day" : "days"}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-500">Start Date</span>
          <span className="font-medium text-gray-900">
            {start.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">End Date</span>
          <span className="font-medium text-gray-900">
            {end.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex justify-between border-t border-gray-100 pt-3">
          <span className="text-gray-500">Created</span>
          <span className="font-medium text-gray-900">
            {new Date(createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
