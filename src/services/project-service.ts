import { ProjectDetailsInterface, UpdateProjectInterface } from "@/modules/project";
import axios from '@/plugins/axios';
import { AxiosResponse } from "axios";
import ErrorHandler from "./error-handler-service";
import { ResponseDto } from "@/modules/common";

export default class ProjectService {
    public static async getProjectInfo(projectId: number): Promise<ProjectDetailsInterface | null> {
        let requestStatus = {
            error: '',
            success: true
        }
        const response = await axios.get(`/projects/${projectId}`).catch(error => {
            requestStatus = ErrorHandler.handleError(error);
        });

        if (requestStatus.success) {
            // the request has been successfully performed
            const project: ProjectDetailsInterface = (response as AxiosResponse).data;
            return project as ProjectDetailsInterface;
        }

        return null;
    }

    public static async grade(projectId: number, grade: number): Promise<ResponseDto>{
        let requestStatus = {
            success: true,
            error: '',
            code: null as number|null
        };

        await axios.patch(`/projects/${projectId}`, {
            grade
        })
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }

    public static async update(projectId: number, project: UpdateProjectInterface): Promise<ResponseDto>{
        let requestStatus = {
            success: true,
            error: '',
            code: null as number|null
        };

        await axios.patch(`/projects/${projectId}`, {
            title: project.title,
            description: project.description,
            repositoryUrl: project.repositoryUrl
        })
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }

}