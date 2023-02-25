import { Store } from 'vuex';
import { ResponseDto } from '@/modules/common';
import { ServiceInterface } from '../common/types';
import { weightNamespace } from './index';
import { State } from '..';
import { PatchWeightInterface, WeightInterface } from './types';

export default class implements ServiceInterface {
    private store: Store<State>;
    constructor(store: Store<State>){
        this.store = store;
    }

    private appendNamespace(method: string): string {
        return `${weightNamespace}/${method}`;
    }

    public load(): Promise<void> {
        return this.store.dispatch(this.appendNamespace('loadWeights'));
    }

    public update(payload: PatchWeightInterface): Promise<ResponseDto> {
        return this.store.dispatch(this.appendNamespace('update'), payload);
    }

    public getWeights(): WeightInterface[]{
        return this.store.getters[this.appendNamespace('weights')];
    }
}