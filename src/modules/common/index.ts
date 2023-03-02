export interface DataTableHeadersInterface {
    text: string;
    align: string;
    filterable: boolean;
    value: string;
};

export interface DataTableItemInterface{
    id: number|string;
}

export interface ResponseDto {
    error: string,
    success: boolean,
    data?: string
};

export interface FileUploadResponseInterface{
    contentUrl: string;
}