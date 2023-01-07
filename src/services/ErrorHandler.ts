/* eslint-disable  @typescript-eslint/no-explicit-any */
import ResponseDto from "@/dtos/ResponseDto";

export default class ErrorHandler {
    public static handleError(error:  any): ResponseDto {
        const errorData = error.response.data;
        return {
            error: errorData.message,
            success: false
        } as ResponseDto;
    }
}