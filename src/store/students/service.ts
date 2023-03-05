import { Store } from 'vuex';
import { AbstractStoreService, HeaderInterface, LoadableInterface } from '../common/types';
import { studentNamespace } from '.';
import { StudentInterface } from '@/modules/student'
import { State } from '..';
import { DataTableHeadersInterface } from '@/modules/common';

export default class extends AbstractStoreService implements LoadableInterface, HeaderInterface {
    constructor(store: Store<State>) {
        super(store);
    }

    protected appendNamespace(method: string): string {
        return `${studentNamespace}/${method}`;
    }

    public load(): Promise<void> {
        return this.store.dispatch(this.appendNamespace('loadStudents'));
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
            },{
                text: "Email",
                value: "user.email"
            },{
                text: "Phone number",
                value: "phoneNumber"
            },{
                text: "Project",
                value: "project.title"
            },
            {
                text: "Specialization",
                value: "specialization.name"
            },
            {
                text: "Department",
                value: "specialization.department.name"
            }
        ] as DataTableHeadersInterface[];
    }

    public getStudents(): StudentInterface[] {
        return this.store.getters[this.appendNamespace('students')];
    }

    public getSupervisees(): StudentInterface[] {
        return this.store.getters[this.appendNamespace('supervisees')];
    }

    public reset(): void{
        this.store.dispatch(this.appendNamespace('reset'));
    }
}