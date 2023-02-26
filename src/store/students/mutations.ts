import { StudentInterface } from "@/modules/student";
import { StudentState } from "./types";

export default {
    storeStudents(state: StudentState, students: StudentInterface[]): void {
        state.students = students;
    },
}