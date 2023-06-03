import { ResponseDto } from "@/modules/common";
import axios from '@/plugins/axios';
import ErrorHandler from "./error-handler-service";
import { DocumentInterface } from "@/modules/assignment";
import { AxiosResponse } from "axios";


export default class FunctionalityService {
    public static async getAttachments(functionalityId: number): Promise<DocumentInterface[]> {
        let requestStatus = {
            success: true,
            error: '',
            code: null as number | null
        };

        const response = await axios.get('/functionality-attachments', {
            params: {
                'functionality.id': functionalityId
            }
        })
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        let attachments = [] as DocumentInterface[];
        if(requestStatus.success){
            attachments = (response as AxiosResponse).data;
        }

        return attachments;
    }

    public static async deleteAttachment(documentId: number): Promise<ResponseDto> {
        let requestStatus = {
            success: true,
            error: '',
            code: null as number | null
        };

        await axios.delete(`/functionality-attachments/${documentId}`)
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }
}