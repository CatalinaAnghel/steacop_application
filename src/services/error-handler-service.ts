/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ResponseDto } from "@/modules/common";

export default class ErrorHandler {
    public static handleError(error: any): ResponseDto {
        const errorData = error.response.data;
        return {
            error: errorData.message,
            success: false,
            code: Number(error.request.status)
        } as ResponseDto;
    }
}