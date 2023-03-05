import { DataTableHeadersInterface, ResponseDto } from "@/modules/common";
import { Commit } from "vuex";

export interface LoadableInterface{
    load(): Promise<void>;
}

export interface HeaderInterface{
    getHeaders(): DataTableHeadersInterface[];
}

export interface ServiceInterface extends LoadableInterface {
    
    update(context: any, payload: PayloadInterface): Promise<ResponseDto>;
}

export interface PayloadInterface {

}

export interface CommitStateInterface<Type>{
    commit: Commit;
    state: Type
}
