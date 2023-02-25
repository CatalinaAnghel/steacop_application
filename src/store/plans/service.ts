import { Store } from 'vuex';
import { ResponseDto } from '@/modules/common';
import { ServiceInterface } from '../common/types';
import { planNamespace } from './index';
import { PatchPlanInterface, PlanInterface } from './types';
import { State } from '..';

export default class implements ServiceInterface {
    private store: Store<State>;
    constructor(store: Store<State>){
        this.store = store;
    }

    private appendNamespace(method: string): string {
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