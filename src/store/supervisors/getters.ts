import { SupervisorInterface } from "@/modules/supervisor";
import { SupervisorState } from "./types";

export default {
    supervisors(state: SupervisorState): SupervisorInterface[] {
        return state.supervisors;
    }
}