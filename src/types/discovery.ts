import type { Category, ProjectCardProps } from './projects'

export interface PaginatedResult<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface HomepageData {
    top5_rated: ProjectCardProps[]
    latest5: ProjectCardProps[]
    featured5: ProjectCardProps[]
    categories: Category[]
}

export type SearchResult = PaginatedResult<ProjectCardProps>

export interface CategoryWithProjects {
    category: Category
    projects: ProjectCardProps[]
}
