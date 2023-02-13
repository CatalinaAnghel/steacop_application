/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from '@/plugins/axios';
import ErrorHandler from '@/services/error-handler-service';
import { AxiosResponse } from 'axios';
import { PlanInterface, PatchPlanInterface } from './types';
import ResponseDto from '@/modules/Response';

export default {
    async loadSupervisoryPlans(context: any): Promise<void> {
        let requestStatus = {
            success: true,
            error: ''
        };
        const response = await axios.get('/supervisory-plans')
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        if (requestStatus.success) {
            // the request has been successfully performed
            const plans: PlanInterface[] = (response as AxiosResponse).data;
            context.commit('storePlans', plans);
        }
    },
    async update(context: any, payload: PatchPlanInterface): Promise<ResponseDto> {
        let requestStatus = {
            success: true,
            error: ''
        };

        const response = await axios.patch(`/supervisory-plans/${payload.id}`, {
            numberOfAssignments: Number(payload.numberOfAssignments),
            numberOfGuidanceMeetings: Number(payload.numberOfGuidanceMeetings)
        })
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        if (requestStatus.success) {
            // the request has been successfully performed
            const updatedPlan: PlanInterface = (response as AxiosResponse).data;
            context.commit('updatePlan', updatedPlan);
        }

        return requestStatus;
    }
}