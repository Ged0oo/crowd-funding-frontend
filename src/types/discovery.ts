import type { Category, ProjectCard } from './projects'

export interface HomepageData {
  top5_rated: ProjectCard[]
  latest5: ProjectCard[]
  featured5: ProjectCard[]
  categories: Category[]
}

export interface SearchResult {
  count: number
  results: ProjectCard[]
}

export interface CategoryWithProjects {
  category: Category
  projects: ProjectCard[]
}
