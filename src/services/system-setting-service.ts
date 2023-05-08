import { ResponseDto } from "@/modules/common";
import axios from '@/plugins/axios';
import { AxiosResponse } from "axios";
import ErrorHandler from "./error-handler-service";
import { SystemSettingInterface, SystemSettingPayloadInterface } from "@/modules/setting";

export default class SystemSettingService {
    public static async getSettings(name: string|null = null): Promise<SystemSettingInterface[] | null> {
        let requestStatus = {
            error: '',
            success: true,
            code: null as number|null
        }
        let url = `/system-settings?pagination=false`;
        if(null !== name){
            url = url + `&name=${name}`;
        }
        const response = await axios.get(url).catch(error => {
            requestStatus = ErrorHandler.handleError(error);
        });

        if (requestStatus.success) {
            // the request has been successfully performed
            const settings: SystemSettingInterface[] = (response as AxiosResponse).data;
            return settings;
        }

        return null;
    }

    public static async updateSettings(settings: SystemSettingPayloadInterface): Promise<ResponseDto> {
        let requestStatus = {
            success: true,
            error: '',
            code: null as number|null
        };

        await axios.post(`/system-settings`, {
            milestoneMeetingsLimit: Number(settings.milestoneMeetingsLimit),
            assignmentPenalization: Number(settings.assignmentsPenalization)
        })
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }
}