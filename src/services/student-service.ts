import axios from '@/plugins/axios';
import { AxiosResponse } from "axios";
import ErrorHandler from "./error-handler-service";
import { GradesCollectionInterface } from '@/modules/project';

export default class StudentService {
    public static async getGrades(): Promise<GradesCollectionInterface | null> {
        let requestStatus = {
            error: '',
            success: true,
            code: null as number|null
        }

        const response = await axios.get("/student-grades").catch(error => {
            requestStatus = ErrorHandler.handleError(error);
        });

        if (requestStatus.success) {
            // the request has been successfully performed
            const grades: GradesCollectionInterface = (response as AxiosResponse).data;
            return grades as GradesCollectionInterface;
        } 

        return null;
    }
}