import { ResponseDto } from "@/modules/common";
import axios from '@/plugins/axios';
import { AxiosResponse } from "axios";
import ErrorHandler from "./error-handler-service";
import { AssignmentInterface, CreateAssignmentPayloadInterface } from "@/modules/assignment";
import { CalendarRangeInterface } from "@/modules/calendar";

export default class AssignmentService {
    public static async createAssignment(payload: CreateAssignmentPayloadInterface): Promise<ResponseDto>{
        let requestStatus = {
            success: true,
            error: '',
            code: null as number|null
        };

        await axios.post('/assignments', payload)
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }

    public static async getAssignments(projectsIds: number[], range: CalendarRangeInterface|null = null): Promise<AssignmentInterface[] | null> {
        let requestStatus = {
            error: '',
            success: true,
            code: null as number|null
        }

        let params = {
            "pagination": false,
            "project.id": projectsIds
        };

        if(null !== range){
            const paramsTemp = {
                "dueDate": {
                    "strictly_before": range.end.date,
                    "after": range.start.date
                } 
            };
            params = {...paramsTemp, ...params};
        }
        const response = await axios.get(`/assignments`, {
            params
        }).catch(error => {
            requestStatus = ErrorHandler.handleError(error);
        });

        if (requestStatus.success) {
            // the request has been successfully performed
            const meetings: AssignmentInterface[] = (response as AxiosResponse).data;
            return meetings as AssignmentInterface[];
        }

        return null;
    }

    public static async getAssignment(assignmentId: number): Promise<AssignmentInterface | null> {
        let requestStatus = {
            error: '',
            success: true,
            code: null as number|null
        }

        const response = await axios.get(`/assignments/${assignmentId}`).catch(error => {
            requestStatus = ErrorHandler.handleError(error);
        });

        if (requestStatus.success) {
            // the request has been successfully performed
            const meetings: AssignmentInterface = (response as AxiosResponse).data;
            return meetings as AssignmentInterface;
        }

        return null;
    }

}