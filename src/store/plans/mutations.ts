import { initialize } from ".";
import { PlanInterface, PlanState } from "./types";

export default {
    _storePlans(state: PlanState, plans: PlanInterface[]): void {
        state.plans = plans;
    },
    _updatePlan(state: PlanState, plan: PlanInterface): void {
        state.plans.forEach((element:PlanInterface) => {
            if(element.id === plan.id){
                element.numberOfAssignments = plan.numberOfAssignments;
                element.numberOfGuidanceMeetings = plan.numberOfGuidanceMeetings;
            }
        });
    },
    _reset(state: PlanState): void{
        Object.assign(state, initialize());
    }
}