import axios from '@/plugins/axios';
import ErrorHandler from '@/services/error-handler-service';
import { AxiosResponse } from 'axios';
import { PlanInterface, PatchPlanInterface, PlanState } from './types';
import { ResponseDto } from '@/modules/common';
import { ActionContext, Commit } from 'vuex';
import { State } from '..';

export default {
    async loadSupervisoryPlans({ commit }: { commit: Commit }): Promise<void> {
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
            commit('_storePlans', plans);
        }

    },
    async update(context: ActionContext<State, PlanState>, payload: PatchPlanInterface): Promise<ResponseDto> {
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
            context.commit('_updatePlan', updatedPlan);
        }

        return requestStatus;
    },
    reset({commit}: {commit: Commit}): void{
        commit('_reset');
    }
}