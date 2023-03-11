import { DataTableHeadersInterface, ResponseDto } from "@/modules/common";
import { Commit, Store } from "vuex";
import { State } from "..";

export interface LoadableInterface{
    load(payload: PayloadInterface|null): Promise<void>;
}

export interface HeaderInterface{
    getHeaders(): DataTableHeadersInterface[];
}

export abstract class AbstractStoreService {
    protected store: Store<State>;
    constructor(store: Store<State>){
        this.store = store;
    }

    public reset(): void{
        this.store.dispatch(this.appendNamespace('reset'));
    }

    protected abstract appendNamespace(method: string): string;
}

export interface ServiceInterface extends LoadableInterface {
    update(payload: PayloadInterface): Promise<ResponseDto>;
}

// eslint-disable-next-line
export interface PayloadInterface {

}

export interface CommitStateInterface<Type>{
    commit: Commit;
    state: Type
}
