import { Store } from 'vuex';
import { AbstractStoreService, LoadableInterface } from '../common/types';
import { userNamespace } from '.';
import { UserData } from '@/modules/user';
import { State } from '..';
import { ProjectCounterPayloadInterface } from './types';

export default class extends AbstractStoreService implements LoadableInterface {
    constructor(store: Store<State>) {
        super(store);
    }

    protected appendNamespace(method: string): string {
        return `${userNamespace}/${method}`;
    }

    public load(userData: UserData): Promise<void> {
        return this.store.dispatch(this.appendNamespace('load'), userData);
    }

    public getUser(): UserData | null {
        return this.store.getters[this.appendNamespace('user')];
    }

    public loadMilestoneMeetingsCounter(projectId: number): Promise<void>{
        return this.store.dispatch(this.appendNamespace('loadProjectMeetingCounter'), projectId);
    }

    public updateMilestoneMeetingsCounter(data: ProjectCounterPayloadInterface): Promise<void>{
        return this.store.dispatch(this.appendNamespace('saveMeetingsCounter'), data);
    }

}