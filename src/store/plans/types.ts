export interface PlanInterface {
    id: number;
    name: string;
    hasLowStructure: boolean;
    hasLowSupport: boolean;
    numberOfAssignments: number;
    numberOfGuidanceMeetings: number;
}

export interface PlanState {
    plans: Array<PlanInterface>
}

export interface PatchPlanInterface {
    id: number;
    numberOfAssignments: number;
    numberOfGuidanceMeetings: number;
}