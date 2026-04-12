export interface Donation {
  id: number
  amount: number
  project: number
  project_title?: string
  created_at: string
}

export interface Comment {
  id: number
  content: string
  user: number
  project: number
  created_at: string
}

export interface Reply {
  id: number
  content: string
  user: number
  comment: number
  created_at: string
}

export interface Rating {
  score: number
  avg_rating: number
  total_ratings: number
}

export interface Report {
  id: number
  reason: string
  created_at: string
}
