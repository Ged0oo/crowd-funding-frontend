import type { HomepageData, PaginatedResult, SearchResult } from "../../../types/discovery";
import type { ProjectCard } from "../../../types/projects";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export async function getHomepage(): Promise<HomepageData> {
  const res = await fetch(`${BASE}/homepage/`);
  if (!res.ok) throw new Error("Failed to load homepage");
  return res.json();
}

export async function searchProjects(query: string): Promise<SearchResult> {
  const res = await fetch(`${BASE}/search/?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function getCategoryProjects(slug: string): Promise<PaginatedResult<ProjectCard>> {
  const res = await fetch(`${BASE}/categories/${slug}/projects/`);
  if (!res.ok) throw new Error("Failed to load category projects");
  return res.json();
}
