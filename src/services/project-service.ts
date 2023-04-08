import { ProjectDetailsInterface } from "@/modules/project";
import axios from '@/plugins/axios';
import { AxiosResponse } from "axios";
import ErrorHandler from "./error-handler-service";

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
}