export interface DataTableHeadersInterface {
    text: string;
    align: string;
    filterable: boolean;
    value: string;
};

export interface DataTableItemInterface{
    id: number;
}

export interface ResponseDto {
    error: string,
    success: boolean
};