/* eslint-disable  @typescript-eslint/no-explicit-any */
import ResponseDto from "@/modules/Response";

export default class ErrorHandler {
    public static handleError(error:  any): ResponseDto {
        const errorData = error.response.data;
        return {
            error: errorData.message,
            success: false
        } as ResponseDto;
    }
}