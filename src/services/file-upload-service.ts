import { FileUploadResponseInterface, ResponseDto } from "@/modules/common";
import axios from '@/plugins/axios';
import ErrorHandler from './error-handler-service';
import { DocumentInterface } from "@/modules/assignment";
import { AxiosResponse } from "axios";

export default class FileUploadService {
    static async uploadStudentsImportFile(formData: FormData): Promise<ResponseDto> {
        const requestStatus = {
            success: true,
            error: '',
            data: '',
            code: null as number | null
        };

        await axios.post('/student-import-files', formData)
            .then(response => {
                requestStatus.data = (response.data as FileUploadResponseInterface).contentUrl;
            })
            .catch(error => {
                const requestStatusTemp = ErrorHandler.handleError(error);
                requestStatus.success = requestStatusTemp.success;
                requestStatus.error = requestStatusTemp.error;
            });

        return requestStatus;
    }

    static async uploadSupervisorsImportFile(formData: FormData): Promise<ResponseDto> {
        const requestStatus = {
            success: true,
            error: '',
            data: '',
            code: null as number | null
        };

        await axios.post('/supervisor-import-files', formData)
            .then(response => {
                requestStatus.data = (response.data as FileUploadResponseInterface).contentUrl;
            })
            .catch(error => {
                const requestStatusTemp = ErrorHandler.handleError(error);
                requestStatus.success = requestStatusTemp.success;
                requestStatus.error = requestStatusTemp.error;
            });

        return requestStatus;
    }

    static async uploadAssignmentFile(formData: FormData): Promise<DocumentInterface | null> {
        const requestStatus = {
            success: true,
            error: '',
            data: '',
            code: null as number | null
        };

        const response = await axios.post('/documents', formData)
            .catch(error => {
                const requestStatusTemp = ErrorHandler.handleError(error);
                requestStatus.success = requestStatusTemp.success;
                requestStatus.error = requestStatusTemp.error;
            });

        if (requestStatus.success) {
            // the request has been successfully performed
            const document: DocumentInterface = (response as AxiosResponse).data;
            return document as DocumentInterface;
        }

        return null;
    }
}