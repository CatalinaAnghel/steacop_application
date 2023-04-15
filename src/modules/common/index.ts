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
    code: number|null
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