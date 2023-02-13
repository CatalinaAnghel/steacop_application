import { PlanInterface, PlanState } from "./types";

export default {
    storePlans(state: PlanState, plans: PlanInterface[]): void {
        state.plans = plans;
    },
    updatePlan(state: PlanState, plan: PlanInterface): void {
        state.plans.forEach((element:PlanInterface) => {
            if(element.id === plan.id){
                element.numberOfAssignments = plan.numberOfAssignments;
                element.numberOfGuidanceMeetings = plan.numberOfGuidanceMeetings;
            }
        });
    }
}