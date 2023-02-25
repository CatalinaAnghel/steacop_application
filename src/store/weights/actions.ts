/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from '@/plugins/axios';
import ErrorHandler from '@/services/error-handler-service';
import { AxiosResponse } from 'axios';
import { WeightInterface, PatchWeightInterface } from './types';
import { ResponseDto } from '@/modules/common';

export default {
    async loadWeights(context: any): Promise<void> {
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
            context.commit('storeWeights', weights);
        }
    },
    async update(context: any, payload: PatchWeightInterface): Promise<ResponseDto> {
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
            context.commit('updateWeights', updatedWeight);
        }

        return requestStatus;
    }
}