export interface ProjectInterface {
    id: number;
    title: string;
    description: string;
}

export interface ProjectDetailsInterface extends ProjectInterface {
    numberOfAssignments: number;
    numberOfFinishedAssignments: number;
    numberOfGuidanceMeetings: number;
    numberOfCompletedGuidanceMeetings: number;
    numberOfMilestoneMeetings: number;
    numberOfCompletedMilestoneMeetings: number;
    repositoryUrl: string;
}