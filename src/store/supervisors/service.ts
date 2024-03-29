import { Store } from 'vuex';
import { AbstractStoreService, HeaderInterface, LoadableInterface } from '../common/types';
import { supervisorNamespace } from '.';
import { SupervisorInterface } from '@/modules/supervisor'
import { State } from '..';
import { DataTableHeadersInterface } from '@/modules/common';

export default class extends AbstractStoreService implements LoadableInterface, HeaderInterface {
    constructor(store: Store<State>) {
        super(store);
    }

    protected appendNamespace(method: string): string {
        return `${supervisorNamespace}/${method}`;
    }

    public load(): Promise<void> {
        return this.store.dispatch(this.appendNamespace('loadSupervisors'));
    }

    public getHeaders(): DataTableHeadersInterface[] {
        return [
            {
                text: "First name",
                align: "start",
                value: "firstName"
            },
            {
                text: "Last name",
                value: "lastName"
            },
            {
                text: "Email",
                value: "user.email"
            },
            {
                text: "Phone number",
                value: "phoneNumber"
            },
            {
                text: "Department",
                value: "department.name"
            }
        ] as DataTableHeadersInterface[];
    }

    public getSupervisors(): SupervisorInterface[] {
        return this.store.getters[this.appendNamespace('supervisors')];
    }
}