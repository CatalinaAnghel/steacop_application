/* eslint-disable */
import { PayloadInterface } from "@/store/common/types";

export interface CalendarInterface {
    prev: () => void;
    next: () => void; 
    checkChange: () => void; 
    getFormatter: (format: any) => any;
    title: string;
}

export interface CalendarRangeInterface{
    start: {
        date: string;
        day: number;
        month: number;
        year: number;
        weekday: number;
    };
    end: {
        date: string;
        day: number;
        month: number;
        year: number;
        weekday: number;
    }
}

export interface EventInterface {
    id: number;
    duration: number;
    name: string;
    start: Date;
    end: Date;
    color: string;
    timed: boolean;
    details: string;
    isCompleted: boolean;
    type: string;
    link: string|null;
    grade: number|null;
}

export interface CalendarFormatInterface {
    day: string;
    month: string;
}

export interface CalendarRangePayloadInterface extends PayloadInterface{
    data: CalendarRangeInterface
}

export const EVENT_TYPE_MILESTONE_MEETING = 'event_milestone_meeting';
export const EVENT_TYPE_GUIDANCE_MEETING = 'event_guidance_meeting';
export const EVENT_TYPE_ASSIGNMENT = 'event_assignment';

export const EventTypes = {
    EVENT_TYPE_ASSIGNMENT: 'EVENT_ASSIGNMENT',
    EVENT_TYPE_MILESTONE_MEETING: 'EVENT_MILESTONE_MEETING',
    EVENT_TYPE_GUIDANCE_MEETING: 'EVENT_GUIDANCE_MEETING'
}

export const EventTypesDescriptions = {
    EVENT_TYPE_ASSIGNMENT: 'Assignment',
    EVENT_TYPE_MILESTONE_MEETING: 'Milestone meeting',
    EVENT_TYPE_GUIDANCE_MEETING: 'Guidance meeting'
}