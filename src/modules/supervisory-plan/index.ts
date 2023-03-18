export default interface SupervisoryPlanInterface {
    id: number;
    name: string;   
}

export interface CustomSupervisoryPlanInterface {
    numberOfAssignments: number;
    numberOfGuidanceMeetings: number;
    suggested: boolean;
}