import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import {
    createProject,
    updateProject,
    deleteProject,
    cancelProject,
    uploadProjectImages,
} from "../api/projectsApi";

import type { Project, ProjectFormData, CancelResponse, UploadImageVars } from "../../../types/projects";

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation<Project, Error, ProjectFormData>({
        mutationFn: createProject,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            navigate(`/projects/${data.id}`);
        },
    });
};

export const useUpdateProject = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<Project, Error, Partial<ProjectFormData>>({
        mutationFn: (payload) => updateProject(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project", id] });
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation<void, Error, number>({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            navigate("/");
        },
    });
};

export const useCancelProject = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<CancelResponse, Error, void>({
        mutationFn: () => cancelProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project", id] });
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
};

export const useUploadImages = (projectId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ files, onProgress }: UploadImageVars) =>
            uploadProjectImages(projectId, files, onProgress),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
        },
    });
};