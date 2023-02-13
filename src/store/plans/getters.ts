import { PlanInterface, PlanState } from "./types";

export default {
    plans(state: PlanState): PlanInterface[] {
        return state.plans;
    } 
};