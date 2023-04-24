export interface AssignmentPayloadInterface {
    projectId: number|null;
    title: string;
    description: string;
    dueDate: string;
}

export interface AssignmentInterface {
    id: number;
    title: string;
    description: string;
    link: string | null;
    dueDate: string;
    turnedInDate: string | null;
    grade: number | null;
    documents: DocumentInterface[]|[];
}

export interface DocumentInterface{
    contentUrl: string;
    filePath: string;
    id: number;
    createdAt: string;
}

export interface AssignmentStatusInterface {
    message: string;
    color: string;
    status: string;
}

export function getStatus(dueDate: Date, turnedInDate: string | null): AssignmentStatusInterface {
    const currentDate = new Date();
    if (dueDate.getTime() < currentDate.getTime() &&
        typeof turnedInDate === 'undefined') {
        return { 
            message: AssignmentStatusMessage.NotTurnedIn,
            color: 'error',
            status: AssignmentStatus.NotTurnedIn
         };
    } else if (turnedInDate !== null &&
        new Date(turnedInDate).getTime() < dueDate.getTime()) {
        return { 
            message: AssignmentStatusMessage.TurnedIn, 
            color: 'success',
            status: AssignmentStatus.TurnedIn
         };
    } else if (turnedInDate !== null &&
        new Date(turnedInDate).getTime() >= dueDate.getTime()) {
        return { 
            message: AssignmentStatusMessage.TurnedInLate, 
            color: 'warning',
            status: AssignmentStatus.TurnedInLate
        };
    }
    return { 
        message: AssignmentStatusMessage.Assigned, 
        color: 'secondary',
        status: AssignmentStatus.Assigned
     };
}


export enum AssignmentStatus{
    TurnedIn = 'turned_in',
    TurnedInLate = 'turned_in_late',
    NotTurnedIn = 'not_turned_in',
    Assigned = 'assigned'
}

export enum AssignmentStatusMessage{
    TurnedIn = 'Turned in',
    TurnedInLate = 'Turned in late',
    NotTurnedIn = 'Missing',
    Assigned = 'Assigned'
}