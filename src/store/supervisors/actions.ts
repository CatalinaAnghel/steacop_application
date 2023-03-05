import axios from '@/plugins/axios';
import ErrorHandler from '@/services/error-handler-service';
import { AxiosResponse } from 'axios';
import { SupervisorInterface } from '@/modules/supervisor';
import { CommitStateInterface } from '../common/types';
import { SupervisorState } from './types';
import { Commit } from 'vuex';

export default {
    async loadSupervisors({ commit, state }: CommitStateInterface<SupervisorState>): Promise<void> {
        if (state.supervisors.length === 0) {
            let requestStatus = {
                success: true,
                error: ''
            };
            const response = await axios.get('/supervisors', {
                params: {
                    pagination: false
                }
            })
                .catch(error => {
                    requestStatus = ErrorHandler.handleError(error);
                });

            if (requestStatus.success) {
                // the request has been successfully performed
                const supervisors: SupervisorInterface[] = (response as AxiosResponse).data;
                commit('_storeSupervisors', supervisors);
            }
        }
    },
    reset({commit}: {commit: Commit}): void{
        commit('_reset');
    }
}