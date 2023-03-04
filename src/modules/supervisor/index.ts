import { DataTableItemInterface } from "../common";

export interface SupervisorInterface extends DataTableItemInterface {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    department: number;
    expanded: string;
}
