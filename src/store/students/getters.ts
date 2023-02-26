import { StudentInterface } from "@/modules/student";
import { StudentState } from "./types";

export default {
    students(state: StudentState): StudentInterface[] {
        return state.students;
    }
}