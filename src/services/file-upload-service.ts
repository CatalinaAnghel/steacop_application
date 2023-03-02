import { FileUploadResponseInterface, ResponseDto } from "@/modules/common";
import axios from '@/plugins/axios';
import ErrorHandler from './error-handler-service';

export default class FileUploadService{
    static async uploadStudentsImportFile(formData: FormData): Promise<ResponseDto>{
        const requestStatus = {
            success: true,
            error: '',
            data: ''
        };

        await axios.post('/student-import-files', formData)
            .then(response => {
                
                console.log(response);
                requestStatus.data = (response.data as FileUploadResponseInterface).contentUrl;
            })
            .catch(error => {
                const requestStatusTemp = ErrorHandler.handleError(error);
                requestStatus.success = requestStatusTemp.success;
                requestStatus.error = requestStatusTemp.error;
            });

        return requestStatus;
    }
}