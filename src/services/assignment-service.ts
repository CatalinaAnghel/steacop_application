import { ResponseDto } from "@/modules/common";
import axios from '@/plugins/axios';
import { AxiosResponse } from "axios";
import ErrorHandler from "./error-handler-service";
import { AssignmentInterface, AssignmentPayloadInterface } from "@/modules/assignment";
import { CalendarRangeInterface } from "@/modules/calendar";

export default class AssignmentService {
    public static async createAssignment(payload: AssignmentPayloadInterface): Promise<ResponseDto> {
        let requestStatus = {
            success: true,
            error: '',
            code: null as number | null
        };

        await axios.post('/assignments', payload)
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }

    public static async updateAssignment(assignmentId: number, payload: AssignmentPayloadInterface): Promise<ResponseDto> {
        let requestStatus = {
            success: true,
            error: '',
            code: null as number | null
        };

        await axios.patch(`/assignments/${assignmentId}`, payload)
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }

    public static async gradeAssignment(assignmentId: number, grade: number): Promise<ResponseDto> {
        let requestStatus = {
            success: true,
            error: '',
            code: null as number | null
        };

        await axios.patch(`/assignments/${assignmentId}`, {
            grade: Number(grade)
        })
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }

    public static async getAssignments(projectsIds: number[], range: CalendarRangeInterface | null = null): Promise<AssignmentInterface[] | null> {
        let requestStatus = {
            error: '',
            success: true,
            code: null as number | null
        }

        let params = {
            "pagination": false,
            "project.id": projectsIds
        };

        if (null !== range) {
            const paramsTemp = {
                "dueDate": {
                    "strictly_before": range.end.date,
                    "after": range.start.date
                }
            };
            params = { ...paramsTemp, ...params };
        }
        const response = await axios.get(`/assignments`, {
            params
        }).catch(error => {
            requestStatus = ErrorHandler.handleError(error);
        });

        if (requestStatus.success) {
            // the request has been successfully performed
            const assignments: AssignmentInterface[] = (response as AxiosResponse).data;
            return assignments as AssignmentInterface[];
        }

        return null;
    }

    public static async getAssignment(assignmentId: number): Promise<AssignmentInterface | null> {
        let requestStatus = {
            error: '',
            success: true,
            code: null as number | null
        }

        const response = await axios.get(`/assignments/${assignmentId}`).catch(error => {
            requestStatus = ErrorHandler.handleError(error);
        });

        if (requestStatus.success) {
            // the request has been successfully performed
            const assignment: AssignmentInterface = (response as AxiosResponse).data;
            return assignment as AssignmentInterface;
        }

        return null;
    }

    public static async setStatusAssignment(assignmentId: number, status: boolean): Promise<AssignmentInterface | null> {
        let requestStatus = {
            success: true,
            error: '',
            code: null as number | null
        };

        const response = await axios.patch(`/assignments/${assignmentId}`, {
            isTurnedIn: status
        })
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        if (requestStatus.success) {
            // the request has been successfully performed
            const assignment: AssignmentInterface = (response as AxiosResponse).data;
            return assignment as AssignmentInterface;
        }

        return null;
    }

    public static async deleteAssignment(assignmentId: number): Promise<ResponseDto> {
        let requestStatus = {
            success: true,
            error: '',
            code: null as number | null
        };

        await axios.delete(`/assignments/${assignmentId}`)
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }

    public static async deleteDocument(documentId: number): Promise<ResponseDto> {
        let requestStatus = {
            success: true,
            error: '',
            code: null as number | null
        };

        await axios.delete(`/documents/${documentId}`)
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }
}