import axios from '@/plugins/axios';
import ErrorHandler from '@/services/error-handler-service';
import { AxiosResponse } from 'axios';
import { StudentInterface } from '@/modules/student';
import { CommitStateInterface } from '../common/types';
import { StudentState } from './types';

export default {
    async loadStudents({ commit, state }: CommitStateInterface<StudentState>): Promise<void> {
        if (state.students.length === 0) {
            let requestStatus = {
                success: true,
                error: ''
            };
            const response = await axios.get('/students', {
                params: {
                    pagination: false
                }
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
                commit('storeStudents', students);
            }
        }
    }
}