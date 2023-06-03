import { PayloadInterface } from "../common/types";

export interface FunctionalityInterface {
    id: number;
    orderNumber: number;
    code: string;
    title: string;
    description: string;
    dueDate: string;
    status: StatusInterface;
    type: TypeInterface;
    parent: FunctionalityInterface | null;
    createdAt: string;
    updatedAt: string;
    projectId: number;
}

export interface FunctionalityGroupInterface {
    status: StatusInterface,
    functionalities: Array<FunctionalityInterface>
}

export interface FunctionalityCharacteristicInterface {
    id: number;
    name: string;
}

export interface StatusInterface extends FunctionalityCharacteristicInterface {
    orderNumber: number | null;
}

export interface TypeInterface extends FunctionalityCharacteristicInterface {
    possibleChildTypes: number[];
}

export interface FunctionalityState {
    functionalityGroups: Array<FunctionalityGroupInterface>,
    epics: Array<FunctionalityInterface>,
    statuses: Array<StatusInterface>,
    types: Array<TypeInterface>,
    history: Array<HistoryGroupInterface>,
    dirtyFunctionalities: boolean,
    dirtyHistory: boolean
}


export interface FunctionalityPayloadInterface extends PayloadInterface {
    projectId: number;
    status: StatusInterface;
    includeEpics: boolean|null;
}

export interface CreateFunctionalityPayloadInterface extends PayloadInterface {
    projectId: number;
    parentFunctionalityId: number | null;
    type: number;
    title: string;
    description: string | null;
    dueDate: string | null;
}

export interface OrderingPayloadInterface extends PayloadInterface {
    orderingCollections: Array<OrderedCollectionInterface>;
}

export interface OrderedCollectionInterface {
    statusId: number;
    functionalities: Array<number>;
}

export interface HistoryInterface {
    statusId: number;
    createdAt: Date;
    numberOfFunctionalities: number;
}

export interface HistoryGroupInterface {
    status: StatusInterface;
    logs: Array<HistoryInterface>;
}

export interface HistoryPayloadInterface {
    projectId: number;
    reload: boolean;
    status: StatusInterface | null;
}

export interface FunctionalityStatusHistory {
    id: number;
    oldStatus: StatusInterface;
    newStatus: StatusInterface;
    createdAt: string;
}

export interface UpdateFunctionalityPayloadInterface extends PayloadInterface {
    id: number;
    title: string | null;
    description: string | null;
    dueDate: string | null;
    status: number|null;
}