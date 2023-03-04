import { SupervisorInterface } from "@/modules/supervisor";
import { SupervisorState } from "./types";

export default {
    storeSupervisors(state: SupervisorState, supervisors: SupervisorInterface[]): void {
        state.supervisors = supervisors;
    },
}