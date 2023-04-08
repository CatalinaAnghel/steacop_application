import { CalendarRangeInterface, EVENT_TYPE_MILESTONE_MEETING } from "@/modules/calendar";
import { CreateMeetingPayloadInterface, MeetingInterface, MilestoneMeetingInterface } from "@/modules/meeting";
import axios from '@/plugins/axios';
import { AxiosResponse } from "axios";
import ErrorHandler from "./error-handler-service";
import { ResponseDto } from "@/modules/common";

export default class MeetingService {
    public static async getGuidanceMeetings(projectsIds: number[], range: CalendarRangeInterface|null = null): Promise<MeetingInterface[] | null> {
        let requestStatus = {
            error: '',
            success: true
        }

        let params = {
            "pagination": false,
            "project.id": projectsIds,
            "isCanceled": false
        };

        if(null !== range){
            const paramsTemp = {
                "scheduledAt": {
                    "strictly_before": range.end.date,
                    "after": range.start.date
                } 
            };
            params = {...paramsTemp, ...params};
        }
        const response = await axios.get(`/guidance-meetings`, {
            params
        }).catch(error => {
            requestStatus = ErrorHandler.handleError(error);
        });

        if (requestStatus.success) {
            // the request has been successfully performed
            const meetings: MeetingInterface[] = (response as AxiosResponse).data;
            return meetings as MeetingInterface[];
        }

        return null;
    }

    public static async getMilestoneMeetings(projectsIds: number[], range: CalendarRangeInterface|null = null): Promise<MilestoneMeetingInterface[] | null> {
        let requestStatus = {
            error: '',
            success: true
        }
        let params = {
            "pagination": false,
            "project.id": projectsIds,
            "isCanceled": false
        };

        if(null !== range){
            const paramsTemp = {
                "scheduledAt":{
                    "strictly_before": range.end.date,
                    "after": range.start.date
                } 
            };
            params = {...paramsTemp, ...params};
        }
        const response = await axios.get(`/milestone-meetings`, {
            params
        }).catch(error => {
            requestStatus = ErrorHandler.handleError(error);
        });

        if (requestStatus.success) {
            // the request has been successfully performed
            const meetings: MilestoneMeetingInterface[] = (response as AxiosResponse).data;
            return meetings as MilestoneMeetingInterface[];
        }

        return null;
    }

    public static async updateGuidanceMeeting(meetingId: number, meeting: MeetingInterface): Promise<ResponseDto>{
        let requestStatus = {
            success: true,
            error: ''
        };

        await axios.patch(`/guidance-meetings/${meetingId}`, {
            scheduledAt: meeting.scheduledAt,
            isCompleted: meeting.isCompleted,
            isCanceled: meeting.isCanceled,
            canceledAt: meeting.canceledAt,
            description: meeting.description,
            link: meeting.link
        })
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }

    public static async updateMilestoneMeeting(meetingId: number, meeting: MilestoneMeetingInterface): Promise<ResponseDto>{
        let requestStatus = {
            success: true,
            error: ''
        };

        await axios.patch(`/milestone-meetings/${meetingId}`, {
            scheduledAt: meeting.scheduledAt,
            isCompleted: meeting.isCompleted,
            isCanceled: meeting.isCanceled,
            canceledAt: meeting.canceledAt,
            description: meeting.description,
            link: meeting.link,
            grade: meeting.grade
        })
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }

    public static async createMeeting(payload: CreateMeetingPayloadInterface, type: string): Promise<ResponseDto>{
        let requestStatus = {
            success: true,
            error: ''
        };

        let endpoint = '/guidance-meetings';
        if(type === EVENT_TYPE_MILESTONE_MEETING){
            endpoint = '/milestone-meetings';
        }

        await axios.post(endpoint, {
            projectId: payload.projectId,
            scheduledAt: payload.scheduledAt,
            description: payload.description,
            link: payload.link
        })
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }
}