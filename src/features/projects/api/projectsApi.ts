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

export const getProjects = async (
    params?: ProjectListParams
): Promise<ProjectListResponse> => {
    const { data } = await axios.get<ProjectListResponse>("/projects/", {
        params,
    });
    return data;
};

export const getProject = async (id: number): Promise<Project> => {
    const { data } = await axios.get(`/projects/${id}/`);
    return data;
};

export const createProject = async (
    payload: ProjectFormData
): Promise<Project> => {
    const { data } = await axios.post("/projects/", payload);
    return data;
};

export const updateProject = async (
    id: number,
    payload: Partial<ProjectFormData>
): Promise<Project> => {
    const { data } = await axios.patch(`/projects/${id}/`, payload);
    return data;
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
    const { data } = await axios.get(`/projects/${id}/similar/`);
    return data;
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
    const { data } = await axios.get<Category[]>("/categories/");
    return data;
};