export interface Category {
    id: number
    name: string
    slug: string
}

export interface Tag {
    id: number
    name: string
}

export interface ProjectImage {
    id: number
    image: string
    created_at: string
}

export interface ProjectCreator {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture: string | null;
}

export interface ProjectCard {
    id: number
    title: string
    image: string
    funded_pct: number
    avg_rating: number
    category: string
}

export interface Project {
    id: number
    title: string
    details: string

    total_target: number
    current_amount: number
    funded_pct: number

    avg_rating: number
    rating_count: number

    creator: ProjectCreator
    category: Category
    tags: Tag[]
    images: ProjectImage[]

    start_date: string
    end_date: string

    created_at: string
    updated_at: string

    status: "active" | "cancelled" | "completed"
    is_featured: boolean
    is_cancelled: boolean
    is_running: boolean
}

export interface ProjectFormData {
    title: string
    details: string
    category_id: number
    total_target: number
    start_date: string
    end_date: string
    tag_ids: number[]
}

export interface ProjectListParams {
    page?: number
    category?: string
    tag?: string
    status?: "active" | "completed"
    creator?: "me"
    start_date_after?: string
    start_date_before?: string
}

export interface PaginationResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

export type ProjectListResponse = PaginationResponse<Project>

export interface SimilarProjectResponse {
    results: Project[]
}

export interface TagAutoCompleteResponse {
    results: Tag[]
}