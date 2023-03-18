import { DataTableItemInterface } from "../common";
import { ProjectInterface } from "../project";

export interface StudentInterface extends DataTableItemInterface {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    project: ProjectInterface|null;
    specialization: number;
    expanded: string;
}
