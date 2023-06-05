import { UserData } from "@/modules/user";

export interface UserState {
    user: UserData;
}

export interface ProjectCounterPayloadInterface{
    projectId: number;
    counter: number;
}