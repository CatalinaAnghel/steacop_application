export interface DataTableHeadersInterface {
    text: string;
    align: string;
    filterable: boolean;
    value: string;
}

export interface DataTableItemInterface {
    id: number | string;
}

export interface ResponseDto {
    error: string,
    success: boolean,
    data?: string,
    code: number | null
};

export interface FileUploadResponseInterface {
    contentUrl: string;
}
export interface ToPropInterface {
    name: string;
}
export interface TabInterface {
    to: ToPropInterface,
    name: string;
}

export interface DashboardDataInterface {
    to: {
        name: string;
        params:{
            id: number;
        }|null
    };
    name: string;
    dueDate: string;
}

export interface DashboardElementInterface {
    key: string;
    cardTitle: string;
    color: string | null;
    loading: boolean;
    icon: string|null;
    cardAction: boolean;
    data: DashboardDataInterface[]
}
