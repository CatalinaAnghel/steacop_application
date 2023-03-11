import { StudentInterface } from "@/modules/student";
import { PayloadInterface } from "../common/types";

export interface StudentState {
    students: Array<StudentInterface>
}

export interface GetSuperviseesPayload extends PayloadInterface {
    
}