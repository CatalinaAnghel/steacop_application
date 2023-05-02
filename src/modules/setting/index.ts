export interface SystemSettingPayloadInterface{
    milestoneMeetingsLimit: number;
    assignmentsPenalization: number;
}

export interface SystemSettingInterface{
    name: string;
    value: number;
    id: number;
}