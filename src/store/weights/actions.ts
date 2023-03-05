import axios from '@/plugins/axios';
import ErrorHandler from '@/services/error-handler-service';
import { AxiosResponse } from 'axios';
import { WeightInterface, PatchWeightInterface, WeightState } from './types';
import { ResponseDto } from '@/modules/common';
import { ActionContext, Commit } from 'vuex';
import { State } from '..';

export default {
    async loadWeights({ commit }: { commit: Commit }): Promise<void> {
        let requestStatus = {
            success: true,
            error: ''
        };
        const response = await axios.get('/score-weights')
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        if (requestStatus.success) {
            // the request has been successfully performed
            const weights: WeightInterface[] = (response as AxiosResponse).data;
            commit('_storeWeights', weights);
        }
    },
    async update(context: ActionContext<State, WeightState>, payload: PatchWeightInterface): Promise<ResponseDto> {
        let requestStatus = {
            success: true,
            error: ''
        };

        const response = await axios.post(`/score-weights/update-multiple`, payload)
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        if (requestStatus.success) {
            // the request has been successfully performed
            const updatedWeight: WeightInterface = (response as AxiosResponse).data;
            context.commit('_updateWeights', updatedWeight);
        }

        return requestStatus;
    },
    reset({commit}: {commit: Commit}): void{
        commit('_reset');
    }
}