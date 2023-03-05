import { Store } from 'vuex';
import { ResponseDto } from '@/modules/common';
import { AbstractStoreService, ServiceInterface } from '../common/types';
import { planNamespace } from '.';
import { PatchPlanInterface, PlanInterface } from './types';
import { State } from '..';

export default class extends AbstractStoreService implements ServiceInterface  {
    constructor(store: Store<State>){
        super(store);
    }
    protected appendNamespace(method: string): string {
        return `${planNamespace}/${method}`;
    }

    public load(): Promise<void> {
        return this.store.dispatch(this.appendNamespace('loadSupervisoryPlans'));
    }

    public update(payload: PatchPlanInterface): Promise<ResponseDto> {
        return this.store.dispatch(this.appendNamespace('update'), payload);
    }

    public getPlans(): PlanInterface[]{
        return this.store.getters[this.appendNamespace('plans')];
    }
    
}