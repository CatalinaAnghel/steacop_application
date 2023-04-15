import { RatingInterface } from "@/modules/meeting";
import axios from '@/plugins/axios';
import { AxiosResponse } from "axios";
import ErrorHandler from "./error-handler-service";
import { ResponseDto } from "@/modules/common";

export default class RatingService {
    public static async getRating(meetingId: number): Promise<RatingInterface | false | null> {
        let requestStatus = {
            error: '',
            success: true,
            code: null as number|null
        }

        const response = await axios.get(`/ratings/${meetingId}`).catch(error => {
            requestStatus = ErrorHandler.handleError(error);
        });

        if (requestStatus.success) {
            // the request has been successfully performed
            const rating: RatingInterface = (response as AxiosResponse).data;
            return rating as RatingInterface;
        } else if (requestStatus.code === 404){
            return null;
        }

        return false;
    }

    public static async createRating(payload: RatingInterface): Promise<ResponseDto>{
        let requestStatus = {
            success: true,
            error: '',
            code: null as number|null
        };

        await axios.post(`/ratings`, {
            guidanceMeetingId: payload.meetingId,
            value: Number(payload.value)
        })
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }

    public static async updateRating(id: number, value: number): Promise<ResponseDto>{
        let requestStatus = {
            success: true,
            error: '',
            code: null as number|null
        };

        await axios.patch(`/ratings/${id}`, {
            value: value
        })
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }
}