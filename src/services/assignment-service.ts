import { ResponseDto } from "@/modules/common";
import { CustomSupervisoryPlanInterface } from "@/modules/supervisory-plan";
import axios from '@/plugins/axios';
import { AxiosResponse } from "axios";
import ErrorHandler from "./error-handler-service";

export default class AssignmentService {
    public static async getAssignments(projectId: number): Promise<CustomSupervisoryPlanInterface | null> {
        let requestStatus = {
            error: '',
            success: true
        }
        const response = await axios.get(`/project-supervisory-plan/${projectId}`).catch(error => {
            requestStatus = ErrorHandler.handleError(error);
        });

        if (requestStatus.success) {
            // the request has been successfully performed
            const plan: CustomSupervisoryPlanInterface = (response as AxiosResponse).data;
            return plan as CustomSupervisoryPlanInterface;
        }

        return null;
    }
}