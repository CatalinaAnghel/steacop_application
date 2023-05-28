import { PayloadInterface } from "../common/types";

export interface FunctionalityInterface {
    id: number;
    orderNumber: number;
    code: string;
    title: string;
    description: string;
    dueDate: Date;
    status: StatusInterface;
    type: TypeInterface;
    parent: FunctionalityInterface | null;
    createdAt: Date;
    updatedAt: Date;
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
    statuses: Array<StatusInterface>,
    types: Array<TypeInterface>,
    history: Array<HistoryGroupInterface>
}


export interface FunctionalityPayloadInterface extends PayloadInterface {
    projectId: number;
    status: StatusInterface;
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
    status: StatusInterface|null;
}