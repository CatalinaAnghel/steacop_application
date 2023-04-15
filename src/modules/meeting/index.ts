export interface MeetingInterface{
    id: number;
    isCompleted: boolean;
    description: string;
    duration: number;
    link: string|null;
    scheduledAt: string;
    isCanceled: boolean;
    canceledAt: Date|null;
}

export interface MilestoneMeetingInterface extends MeetingInterface{
    grade: number|null;
}

export interface CreateMeetingPayloadInterface {
    projectId: number;
    duration: number;
    description: string;
    link: string|null;
    scheduledAt: string;
}

export interface UpdateMeetingInterface {
    description: string;
    link: string|null;
    date: string;
    time: string;
    duration: number;
    isCompleted: boolean;
    grade: number|null;
}

export interface UpdateMeetingPayloadInterface {
    description: string;
    link: string|null;
    scheduledAt: string;
    isCompleted: boolean;
    grade: number|null;
}

export interface MeetingTypeInterface{
    id: string;
    name: string;
}

export interface RatingInterface{
    id: number;
    value: number;
    meetingId: number;
}