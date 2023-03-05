import { SupervisorInterface } from "@/modules/supervisor";
import { initialize } from ".";
import { SupervisorState } from "./types";

export default {
    _storeSupervisors(state: SupervisorState, supervisors: SupervisorInterface[]): void {
        state.supervisors = supervisors;
    },
    _reset(state: SupervisorState): void{
        Object.assign(state, initialize());
    }
}