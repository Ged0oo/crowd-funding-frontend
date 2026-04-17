import axios from "../../../services/axios";

import type {
    Project,
    ProjectFormData,
    ProjectListParams,
    ProjectListResponse,
    SimilarProjectResponse,
    TagAutoCompleteResponse,
    Category,
    CancelResponse,
    ImageUploadResponse
} from "../../../types/projects";

type RawProject = Partial<Project> & {
    total_target?: number | string | null;
    current_amount?: number | string | null;
    current_donations?: number | string | null;
    avg_rating?: number | string | null;
    average_rating?: number | string | null;
    rating_count?: number | string | null;
    total_ratings?: number | string | null;
    funded_pct?: number | string | null;
    funded_percentage?: number | string | null;
    creator?: Project["creator"] | null;
    owner?: {
        id?: string | number;
        first_name?: string;
        last_name?: string;
        email?: string;
        profile_picture?: string | null;
    } | null;
    images?: Project["images"] | null;
    media?: Array<{
        id?: number;
        image?: string;
        created_at?: string;
        is_cover?: boolean;
        order?: number;
    }> | null;
    cover_image?: string | null;
    start_date?: string;
    end_date?: string;
    start_time?: string;
    end_time?: string;
    status?: string;
};

const toNumber = (value: unknown): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeStatus = (status: unknown): Project["status"] => {
    if (status === "cancelled") return "cancelled";
    if (status === "completed") return "completed";
    return "active";
};

const resolveMediaUrl = (url: string | null | undefined): string => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;

    const base = import.meta.env.VITE_API_BASE_URL as string | undefined;
    if (!base) return url;

    const apiOrigin = new URL(base).origin;
    return `${apiOrigin}${url.startsWith("/") ? "" : "/"}${url}`;
};

const normalizeProject = (raw: RawProject): Project => {
    const totalTarget = toNumber(raw.total_target);
    const currentAmount = raw.current_donations !== undefined && raw.current_donations !== null
        ? toNumber(raw.current_donations)
        : toNumber(raw.current_amount);
    const fundedPct = raw.funded_percentage !== undefined && raw.funded_percentage !== null
        ? toNumber(raw.funded_percentage)
        : raw.funded_pct !== undefined && raw.funded_pct !== null
            ? toNumber(raw.funded_pct)
            : totalTarget > 0
                ? (currentAmount / totalTarget) * 100
                : 0;
    const avgRating = raw.average_rating !== undefined && raw.average_rating !== null
        ? toNumber(raw.average_rating)
        : toNumber(raw.avg_rating);
    const ratingCount = raw.total_ratings !== undefined && raw.total_ratings !== null
        ? toNumber(raw.total_ratings)
        : toNumber(raw.rating_count);

    const creator = raw.creator ?? raw.owner;
    const media = Array.isArray(raw.media)
        ? [...raw.media].sort((a, b) => {
            if (Boolean(a.is_cover) !== Boolean(b.is_cover)) {
                return a.is_cover ? -1 : 1;
            }
            const orderA = toNumber(a.order);
            const orderB = toNumber(b.order);
            if (orderA !== orderB) return orderA - orderB;
            return toNumber(a.id) - toNumber(b.id);
        })
        : [];
    const imagesFromRaw = Array.isArray(raw.images)
        ? raw.images.map((item) => ({
            ...item,
            image: resolveMediaUrl(item.image),
        }))
        : [];
    const imagesFromMedia = media.map((item) => ({
        id: toNumber(item.id),
        image: resolveMediaUrl(item.image),
        created_at: item.created_at ?? raw.created_at ?? new Date().toISOString(),
    }));
    const coverImage = resolveMediaUrl(raw.cover_image);
    const coverAsImage = coverImage
        ? [{
            id: 0,
            image: coverImage,
            created_at: raw.created_at ?? new Date().toISOString(),
        }]
        : [];
    const images = imagesFromRaw.length > 0
        ? imagesFromRaw
        : imagesFromMedia.length > 0
            ? imagesFromMedia
            : coverAsImage;

    const category = raw.category ?? {
        id: 0,
        name: "Uncategorized",
        slug: "uncategorized",
    };

    return {
        id: toNumber(raw.id),
        title: raw.title ?? "Untitled Project",
        details: raw.details ?? "",
        total_target: totalTarget,
        current_amount: currentAmount,
        funded_pct: fundedPct,
        avg_rating: avgRating,
        rating_count: ratingCount,
        creator: {
            id: creator?.id as Project["creator"]["id"],
            first_name: creator?.first_name ?? "Unknown",
            last_name: creator?.last_name ?? "Creator",
            email: creator?.email ?? "",
            profile_picture: creator?.profile_picture ?? null,
        },
        category,
        tags: Array.isArray(raw.tags) ? raw.tags : [],
        images,
        start_date: raw.start_date ?? raw.start_time ?? "",
        end_date: raw.end_date ?? raw.end_time ?? "",
        created_at: raw.created_at ?? new Date().toISOString(),
        updated_at: raw.updated_at ?? raw.created_at ?? new Date().toISOString(),
        status: normalizeStatus(raw.status),
        is_featured: Boolean(raw.is_featured),
        is_cancelled: Boolean(raw.is_cancelled),
        is_running: Boolean(raw.is_running),
    };
};

export const getProjects = async (
    params?: ProjectListParams
): Promise<ProjectListResponse> => {
    const { data } = await axios.get<{ count?: number; next?: string | null; previous?: string | null; results?: RawProject[] }>("/projects/", {
        params,
    });
    return {
        count: data.count ?? 0,
        next: data.next ?? null,
        previous: data.previous ?? null,
        results: Array.isArray(data.results) ? data.results.map(normalizeProject) : [],
    };
};

export const getProject = async (id: number): Promise<Project> => {
    const { data } = await axios.get<RawProject>(`/projects/${id}/`);
    return normalizeProject(data);
};

export const createProject = async (
    payload: ProjectFormData
): Promise<Project> => {
    const { data } = await axios.post<RawProject>("/projects/", payload);
    return normalizeProject(data);
};

export const updateProject = async (
    id: number,
    payload: Partial<ProjectFormData>
): Promise<Project> => {
    const { data } = await axios.patch<RawProject>(`/projects/${id}/`, payload);
    return normalizeProject(data);
};

export const deleteProject = async (id: number): Promise<void> => {
    await axios.delete(`/projects/${id}/`);
};

export const cancelProject = async (id: number): Promise<CancelResponse> => {
    const { data } = await axios.post(`/projects/${id}/cancel/`);
    return data;
}

export const getSimilarProjects = async (
    id: number
): Promise<SimilarProjectResponse> => {
    const { data } = await axios.get<{ results?: RawProject[] }>(`/projects/${id}/similar/`);
    return {
        results: Array.isArray(data.results) ? data.results.map(normalizeProject) : [],
    };
};

export const uploadProjectImages = async (
    projectId: number,
    images: File[],
    onProgress?: (percent: number) => void
): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));
    const { data } = await axios.post<ImageUploadResponse>(`/projects/${projectId}/images/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
                const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                onProgress(percent);
            }
        }
    });
    return data;
};

export const searchTags = async (query: string): Promise<TagAutoCompleteResponse> => {
    const { data } = await axios.get<TagAutoCompleteResponse>("/tags/autocomplete/", {
        params: { q: query },
    });
    return data;
};

export const getCategories = async (): Promise<Category[]> => {
    const { data } = await axios.get<Category[]>("/projects/categories/");
    return data;
};