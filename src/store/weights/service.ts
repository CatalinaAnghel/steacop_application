import { Store } from 'vuex';
import { ResponseDto } from '@/modules/common';
import { AbstractStoreService, ServiceInterface } from '../common/types';
import { weightNamespace } from './index';
import { State } from '..';
import { PatchWeightInterface, WeightInterface } from './types';

export default class extends AbstractStoreService implements ServiceInterface {
    constructor(store: Store<State>){
        super(store);
    }

    protected appendNamespace(method: string): string {
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