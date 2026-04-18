import type { User } from "./auth"

export interface Donation {
  id: number
  amount: string
  project: number
  project_title?: string
  funded_pct?: number
  created_at: string
}

export interface Comment {
  id: number
  content: string
  user: Pick<User, 'id' | 'first_name' | 'last_name'>
  parent: number | null
  replies: Comment[]
  created_at: string
}

export interface Reply extends Omit<Comment, 'replies'> {
  parent: number
}

export interface Rating {
  id?: number
  project: number
  value: number
  user_rating?: number;
  new_project_average?: number
  created_at: string
}

export interface Report {
  id: number
  report_type: 'project' | 'comment'
  reason: string
  project?: number
  comment?: number
  created_at: string
}

export interface DonationHistoryItem {
  id: number
  project_title: string
  amount: string
  created_at: string
}