/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from '@/plugins/axios';
import ErrorHandler from '@/services/error-handler-service';
import { AxiosResponse } from 'axios';
import { SupervisorInterface } from '@/modules/supervisor';

export default {
    async loadSupervisors(context: any): Promise<void> {
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
            // supervisors.forEach((student: StudentInterface, index:number) => {
            //     supervisors[index].expanded = student.project !== null? student.project?.description: '';
            // });
            context.commit('storeSupervisors', supervisors);
        }
    }
}