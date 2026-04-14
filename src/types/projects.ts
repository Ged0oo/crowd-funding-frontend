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
}

export interface ProjectCard {
  id: number
  title: string
  image: string | null
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
  category: Category
  tags: Tag[]
  images: ProjectImage[]
  start_date: string
  end_date: string
  is_featured: boolean
  is_cancelled: boolean
}
