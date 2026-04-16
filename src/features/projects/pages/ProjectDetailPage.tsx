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

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const { data: project, isLoading, isError, error } = useProject(projectId);
  const user = useAuthStore((state) => state.user);

  // ── Loading state ─────────────────────────

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner />
        </div>
      </PageWrapper>
    );
  }

  // ── Error state ───────────────────────────

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

  const isOwner = user?.id === project.creator.id;

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ════════════════════════════════════════ */}
        {/* LEFT COLUMN — Project Content (2/3)     */}
        {/* ════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image slider */}
          <ImageSlider images={project.images} />

          {/* Title + status badges */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {project.category && (
                <Link to={`/categories/${project.category.slug}`}>
                  <Badge>{project.category.name}</Badge>
                </Link>
              )}
              {project.is_featured && <Badge>⭐ Featured</Badge>}
              {project.is_cancelled && <Badge>Cancelled</Badge>}
              {!project.is_cancelled && project.is_running && (
                <Badge>Running</Badge>
              )}
              {!project.is_cancelled && !project.is_running && (
                <Badge>Ended</Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              {project.title}
            </h1>
          </div>

          {/* Creator info */}
          <div className="flex items-center gap-3">
            {project.creator.profile_picture ? (
              <img
                src={project.creator.profile_picture}
                alt={project.creator.first_name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                {project.creator.first_name[0]}
                {project.creator.last_name[0]}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {project.creator.first_name} {project.creator.last_name}
              </p>
              <p className="text-xs text-gray-500">
                Created {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              About This Project
            </h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {project.details}
            </div>
          </div>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
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
          {/* SLOT: Comment Thread (Dev 3)        */}
          {/* Dev 3 mounts <CommentThread />      */}
          {/* ═══════════════════════════════════ */}
          <section id="comments-slot" className="border-t border-gray-200 pt-8">
            {/* <CommentThread projectId={project.id} /> */}
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-gray-400">
              💬 Comment Thread — Dev 3 mounts here
            </div>
          </section>
        </div>

        {/* ════════════════════════════════════════ */}
        {/* RIGHT COLUMN — Sidebar (1/3)            */}
        {/* ════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* ═══════════════════════════════════ */}
          {/* SLOT: Donation Progress (Dev 3)     */}
          {/* Dev 3 mounts <DonationProgress />   */}
          {/* ═══════════════════════════════════ */}
          <section id="donation-progress-slot">
            {/* <DonationProgress
                  currentAmount={project.current_amount}
                  totalTarget={project.total_target}
                  fundedPct={project.funded_pct}
                /> */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">
                  {project.current_amount.toLocaleString()} EGP
                </p>
                <p className="text-sm text-gray-500">
                  raised of {project.total_target.toLocaleString()} EGP goal
                </p>
              </div>
              <div className="mb-2 h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{ width: `${Math.min(project.funded_pct, 100)}%` }}
                />
              </div>
              <p className="mb-4 text-sm text-gray-600">
                {project.funded_pct.toFixed(1)}% funded
              </p>
              {/* Placeholder — Dev 3 replaces with full DonationProgress */}
            </div>
          </section>

          {/* ═══════════════════════════════════ */}
          {/* SLOT: Donate Widget (Dev 3)         */}
          {/* Dev 3 mounts <DonateWidget />       */}
          {/* ═══════════════════════════════════ */}
          <section id="donate-widget-slot">
            {/* <DonateWidget projectId={project.id} isRunning={project.is_running} /> */}
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center text-gray-400">
              💰 Donate Widget — Dev 3 mounts here
            </div>
          </section>

          {/* ═══════════════════════════════════ */}
          {/* SLOT: Star Rating (Dev 3)           */}
          {/* Dev 3 mounts <StarRating />         */}
          {/* ═══════════════════════════════════ */}
          <section id="star-rating-slot">
            {/* <StarRating projectId={project.id} avgRating={project.avg_rating} ratingCount={project.rating_count} /> */}
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center text-gray-400">
              ⭐ Star Rating — Dev 3 mounts here
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
                  {new Date(project.start_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">End</span>
                <span className="font-medium text-gray-900">
                  {new Date(project.end_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`font-medium ${
                    project.is_running
                      ? "text-green-600"
                      : project.is_cancelled
                        ? "text-red-600"
                        : "text-gray-600"
                  }`}
                >
                  {project.is_cancelled
                    ? "Cancelled"
                    : project.is_running
                      ? "Running"
                      : "Ended"}
                </span>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════ */}
          {/* SLOT: Report Button (Dev 3)         */}
          {/* Dev 3 mounts <ReportButton />       */}
          {/* ═══════════════════════════════════ */}
          <section id="report-button-slot">
            {/* <ReportButton targetType="project" targetId={project.id} /> */}
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-gray-400">
              🚩 Report Button — Dev 3 mounts here
            </div>
          </section>

          {/* Cancel button — owner only, funded < 25% */}
          <CancelProjectBtn
            projectId={project.id}
            fundedPct={project.funded_pct}
            isOwner={isOwner}
            isCancelled={project.is_cancelled}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* Similar Projects — full width bottom    */}
      {/* ═══════════════════════════════════════ */}
      <SimilarProjects projectId={project.id} />
    </PageWrapper>
  );
};

export default ProjectDetailPage;
