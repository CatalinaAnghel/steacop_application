import { ResponseDto } from "@/modules/common";
import { CustomSupervisoryPlanInterface } from "@/modules/supervisory-plan";
import axios from '@/plugins/axios';
import { AxiosResponse } from "axios";
import ErrorHandler from "./error-handler-service";

export default class PlanService {
    public static async getProjectPlan(projectId: number): Promise<CustomSupervisoryPlanInterface | null> {
        let requestStatus = {
            error: '',
            success: true,
            code: null as number|null
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

    public static async updateProjectPlan(projectId: number, plan: CustomSupervisoryPlanInterface): Promise<ResponseDto> {
        let requestStatus = {
            success: true,
            error: '',
            code: null as number|null
        };

        await axios.patch(`/project-supervisory-plan/${projectId}`, {
            numberOfAssignments: Number(plan.numberOfAssignments),
            numberOfGuidanceMeetings: Number(plan.numberOfGuidanceMeetings)
        })
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }

    public static async createProjectPlan(projectId: number, plan: CustomSupervisoryPlanInterface): Promise<ResponseDto> {
        let requestStatus = {
            success: true,
            error: '',
            code: null as number|null
        };

        await axios.post(`/project-supervisory-plans`, {
            projectId: Number(projectId),
            numberOfAssignments: Number(plan.numberOfAssignments),
            numberOfGuidanceMeetings: Number(plan.numberOfGuidanceMeetings)
        })
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }
}