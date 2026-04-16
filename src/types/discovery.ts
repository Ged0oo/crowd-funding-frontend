import type { Category, ProjectCardProps } from './projects'

export interface HomepageData {
    top5_rated: ProjectCardProps[]
    latest5: ProjectCardProps[]
    featured5: ProjectCardProps[]
    categories: Category[]
}

export interface SearchResult {
    count: number
    results: ProjectCardProps[]
}

export interface CategoryWithProjects {
    category: Category
    projects: ProjectCardProps[]
}
