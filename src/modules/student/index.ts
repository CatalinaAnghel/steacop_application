import { ProjectState } from "@/store/projects/types";
import { DataTableItemInterface } from "../common";

export interface StudentInterface extends DataTableItemInterface {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    project: ProjectState|null;
    specialization: number;
    expanded: string;
}
