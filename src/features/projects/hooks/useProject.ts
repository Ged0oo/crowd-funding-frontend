import { useQuery } from "@tanstack/react-query";
import { getProject, getProjects, getSimilarProjects } from "../api/projectsApi";
import type {
    Project,
    ProjectListParams,
    ProjectListResponse,
    SimilarProjectResponse,
} from "../../../types/projects";


export const useProject = (id: number) => {
    return useQuery<Project, Error>({
        queryKey: ["project", id],
        queryFn: () => getProject(id),
        enabled: id > 0,
    });
}

export const useProjects = (params?: ProjectListParams) => {
    return useQuery<ProjectListResponse, Error>({
        queryKey: ["projects", params],
        queryFn: () => getProjects(params),
    });
}

export const useSimilarProjects = (id: number) => {
    return useQuery<SimilarProjectResponse, Error>({
        queryKey: ["similar-projects", id],
        queryFn: () => getSimilarProjects(id),
        enabled: id > 0,
    });
}