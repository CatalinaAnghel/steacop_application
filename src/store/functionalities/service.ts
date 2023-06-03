import { Store } from 'vuex';
import { DataTableHeadersInterface, ResponseDto } from '@/modules/common';
import { AbstractStoreService, LoadableInterface, PayloadInterface } from '../common/types';
import { functionalityNamespace } from '.';
import { CreateFunctionalityPayloadInterface, FunctionalityGroupInterface, FunctionalityInterface, FunctionalityPayloadInterface, FunctionalityStatusHistory, HistoryGroupInterface, HistoryPayloadInterface, StatusInterface, TypeInterface, UpdateFunctionalityPayloadInterface } from './types';
import { State } from '..';

export default class extends AbstractStoreService implements LoadableInterface {
    constructor(store: Store<State>) {
        super(store);
    }
    update(payload: PayloadInterface): Promise<ResponseDto> {
        throw new Error('Method not implemented.' + payload);
    }
    protected appendNamespace(method: string): string {
        return `${functionalityNamespace}/${method}`;
    }

    public loadStatuses(): Promise<void> {
        return this.store.dispatch(this.appendNamespace('loadStatuses'));
    }

    public loadTypes(): Promise<void> {
        return this.store.dispatch(this.appendNamespace('loadTypes'));
    }

    public load(payload: FunctionalityPayloadInterface | null = null): Promise<void> {
        return this.store.dispatch(this.appendNamespace('loadFunctionalities'), payload);
    }

    public loadHistory(payload: HistoryPayloadInterface): Promise<void> {
        return this.store.dispatch(this.appendNamespace('loadHistory'), payload);
    }

    public getFunctionalities(): FunctionalityGroupInterface[] {
        return this.store.getters[this.appendNamespace('functionalities')];
    }

    public getEpics(): FunctionalityInterface[] {
        return this.store.getters[this.appendNamespace('epics')];
    }

    public getParentFunctionalities(type: TypeInterface | null = null): FunctionalityInterface[] {
        let functionalities = [] as FunctionalityInterface[];

        if (type.name === 'Epic') {
            functionalities = this.getEpics().filter(functionality => {
                return functionality.status.name !== 'Done';
            })
        } else {
            const groups = this.getFunctionalities().filter(group => {
                return group.status.name !== 'Done';
            });
            groups.forEach(group => {

                const foundFunctionalities = group.functionalities.filter(functionality => {
                    return functionality.type.id === type.id;
                });
                if (foundFunctionalities.length) {
                    functionalities = [...functionalities, ...foundFunctionalities];
                }
            });
        }

        return functionalities;
    }

    public getStatuses(): StatusInterface[] {
        return this.store.getters[this.appendNamespace('statuses')];
    }

    public getTypes(): TypeInterface[] {
        return this.store.getters[this.appendNamespace('types')];
    }

    public getHistory(): HistoryGroupInterface[] {
        return this.store.getters[this.appendNamespace('history')];
    }

    public async createFunctionality(payload: CreateFunctionalityPayloadInterface): Promise<FunctionalityInterface | null> {
        return this.store.dispatch(this.appendNamespace('create'), payload);
    }

    public async saveFunctionalitiesOrdering(payload: FunctionalityGroupInterface[]): Promise<ResponseDto> {
        return this.store.dispatch(this.appendNamespace('save'), payload);
    }

    public async uploadAttachment(payload: FormData): Promise<ResponseDto> {
        return this.store.dispatch(this.appendNamespace('uploadAttachment'), payload);
    }

    public async fetchFunctionality(functionalityId: number): Promise<FunctionalityInterface> {
        return this.store.dispatch(this.appendNamespace('fetchFunctionality'), functionalityId);
    }

    public async fetchFunctionalityStatusHistory(functionalityId: number): Promise<FunctionalityStatusHistory[]> {
        return this.store.dispatch(this.appendNamespace('fetchFunctionalityStatusHistory'), functionalityId);
    }

    public async updateFunctionality(payload: UpdateFunctionalityPayloadInterface): Promise<ResponseDto> {
        return this.store.dispatch(this.appendNamespace('updateFunctionality'), payload);
    }

    public getHeaders(): DataTableHeadersInterface[] {
        return [
            {
                text: "Title",
                align: "start",
                value: "title"
            },
            {
                text: "Status",
                value: "status.name"
            },
            {
                text: "Created at",
                value: "createdAt"
            },
            {
                text: "Updated at",
                value: "updatedAt"
            },
            {
                text: "Due date",
                value: "dueDate"
            },
            {
                text: "Actions",
                value: "actions",
                align: '',
                filterable: false
            }
        ] as DataTableHeadersInterface[];
    }

    public async deleteFunctionality(functionalityId: number): Promise<ResponseDto>{
        return this.store.dispatch(this.appendNamespace('deleteFunctionality'), functionalityId);
    }
}