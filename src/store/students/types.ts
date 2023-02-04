import { ProjectState } from "../projects/types";

export interface StudentInterface {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    project: ProjectState|null;
    specialization: number;
}

export interface StudentState {
    students: Array<StudentInterface>
}