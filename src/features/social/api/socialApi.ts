import type { 
  Donation, 
  Comment, 
  Rating, 
  Report, 
  DonationHistoryItem 
} from "../../../types/social"

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"

/**
 * Helper for handling JSON requests to reduce boilerplate
 * TODO: consider global error handling/logging
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.detail || `API Error: ${res.status}`)
  }

  if (!res.body) return {} as T;

  return res.json()
}

// --- Donations ---

export const donateToProject = (projectId: number, amount: number) => 
  apiFetch<Donation>(`/projects/${projectId}/donate/`, {
    method: 'POST',
    body: JSON.stringify({ amount })
  })

export const getUserDonations = () => 
  apiFetch<DonationHistoryItem[]>('/users/me/donations/')

// --- Comments & Replies ---

export const getProjectComments = (projectId: number, page: number = 1) => 
  apiFetch<PaginatedResponse<Comment>>(`/projects/${projectId}/comments/?page=${page}`)

export const postComment = (projectId: number, content: string) => 
  apiFetch<Comment>(`/projects/${projectId}/comments/`, {
    method: 'POST',
    body: JSON.stringify({ content })
  })

export const postReply = (commentId: number, content: string) => 
  apiFetch<Comment>(`/comments/${commentId}/replies/`, {
    method: 'POST',
    body: JSON.stringify({ content })
  })

export const deleteComment = (commentId: number) => 
  apiFetch<void>(`/comments/${commentId}/`, { method: 'DELETE' })

// --- Ratings ---

export const rateProject = (projectId: number, value: number) => 
  apiFetch<Rating>(`/projects/${projectId}/rate/`, {
    method: 'POST',
    body: JSON.stringify({ value })
  })

// --- Reports ---

export const reportProject = (projectId: number, reason: string) => 
  apiFetch<Report>(`/projects/${projectId}/report/`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  })

export const reportComment = (commentId: number, reason: string) => 
  apiFetch<Report>(`/comments/${commentId}/report/`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  })