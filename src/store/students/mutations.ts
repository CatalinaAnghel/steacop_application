import { StudentInterface } from "@/modules/student";
import { initialize } from ".";
import { StudentState } from "./types";

export default {
    _storeStudents(state: StudentState, students: StudentInterface[]): void {
        state.students = students;
    },
    _reset(state: StudentState): void{
        Object.assign(state, initialize());
    }
}