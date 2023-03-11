import axios from '@/plugins/axios';
import ErrorHandler from '@/services/error-handler-service';
import { AxiosResponse } from 'axios';
import { StudentInterface } from '@/modules/student';
import { CommitStateInterface } from '../common/types';
import { GetSuperviseesPayload, StudentState } from './types';
import { Commit } from 'vuex';

export default {
    async loadStudents({ commit, state }: CommitStateInterface<StudentState>, payload: GetSuperviseesPayload|null = null): Promise<void> {
        if (state.students.length === 0) {
            let requestStatus = {
                success: true,
                error: ''
            };

            let params = {
                pagination: false
            }
            if(payload !== null){
                params = {...params, ...payload};
            }

            const response = await axios.get('/students', {
                params: params
            })
                .catch(error => {
                    requestStatus = ErrorHandler.handleError(error);
                });

            if (requestStatus.success) {
                // the request has been successfully performed
                const students: StudentInterface[] = (response as AxiosResponse).data;
                students.forEach((student: StudentInterface, index: number) => {
                    students[index].expanded = student.project !== null ? student.project?.description : '';
                });
                commit('_storeStudents', students);
            }
        }
    },
    reset({commit}: {commit: Commit}): void{
        commit('_reset');
    }
}