import api from "../../../services/axios"
import type { 
  Donation, 
  Comment, 
  Rating, 
  Report, 
  DonationHistoryItem 
} from "../../../types/social";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// --- Donations ---

export const donateToProject = async (projectId: number, amount: number) => {
  const { data } = await api.post<Donation>(`/projects/${projectId}/donate/`, { amount });
  return data;
};

export const getUserDonations = async () => {
  const { data } = await api.get<DonationHistoryItem[]>('/users/me/donations/');
  return data;
};

// --- Comments & Replies ---

export const getProjectComments = async (projectId: number, page: number = 1) => {
  const { data } = await api.get<PaginatedResponse<Comment>>(`/projects/${projectId}/comments/`, {
    params: { page }
  });
  return data;
};

export const postComment = async (projectId: number, content: string) => {
  const { data } = await api.post<Comment>(`/projects/${projectId}/comments/`, { content });
  return data;
};

export const postReply = async (commentId: number, content: string) => {
  const { data } = await api.post<Comment>(`/comments/${commentId}/replies/`, { content });
  return data;
};

export const deleteComment = async (commentId: number) => {
  await api.delete(`/comments/${commentId}/`);
};

// --- Ratings ---

export const rateProject = async (projectId: number, value: number) => {
  const { data } = await api.post<Rating>(`/projects/${projectId}/rate/`, { value });
  return data;
};

// --- Reports ---

export const reportProject = async (projectId: number, reason: string) => {
  const { data } = await api.post<Report>(`/projects/${projectId}/report/`, { reason });
  return data;
};

export const reportComment = async (commentId: number, reason: string) => {
  const { data } = await api.post<Report>(`/comments/${commentId}/report/`, { reason });
  return data;
};