import { ResponseDto } from "@/modules/common";

export interface ServiceInterface {
    load(): Promise<void>;
    update(context: any, payload: PayloadInterface): Promise<ResponseDto>;
}

export interface PayloadInterface {

}