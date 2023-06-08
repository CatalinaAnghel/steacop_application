export interface ProjectInterface {
    id: number;
    title: string;
    description: string;
}

export interface InformationInterface {
    total: number;
    completed: number;
}

export interface MeetingInformationInterface extends InformationInterface {
    missed: number;
    scheduled: number;
}

export interface ProjectDetailsInterface extends ProjectInterface {
    milestoneMeetingInformation: MeetingInformationInterface;
    guidanceMeetingInformation: MeetingInformationInterface;
    assignmentInformation: InformationInterface;
    repositoryUrl: string;
    grade: number | null;
}

export interface FunctionalityLineChartOptionsInterface {
    options: {
        chart: {
            id: string;
            type: string;
            curve: string;
        },
        colors: Array<string> | null;
        fill: {
            type: string;
            gradient: {
                shadeIntensity: number;
                inverseColors: boolean;
                opacityFrom: number;
                opacityTo: number;
                stops: number[]
            }
        },
        yaxis: {
            type: string | null;
            decimalsInFloat: number | null;
            title: {
                text: string;
            }
        },
        xaxis: {
            type: string;
        }
    },
    series: Array<{
        data: {
            x: Date;
            y: number | string;
        }[]
    }>
}

export interface UpdateProjectInterface {
    title: string;
    description: string;
    repositoryUrl: string | null;
}

export interface IconInterface {
    name: string;
    color: string;
}

export function getIcon(type: string): IconInterface {
    const icon = {
        name: '',
        color: 'secondary'
    };

    switch (type) {
        case 'Epic':
            icon.name = 'mdi-lightning-bolt';
            icon.color = icon.color + ' darken-3'
            break;
        case 'Story':
            icon.name = 'mdi-bookmark';
            icon.color = icon.color + ' darken-2';
            break;
        case 'Task':
            icon.name = 'mdi-check-bold';
            icon.color = icon.color + ' darken-1';
            break;
        case 'Subtask':
            icon.name = 'mdi-card-multiple';
            break;
        case 'Bug':
            icon.name = 'mdi-bug';
            icon.color = 'error';
            break;
        default:
            icon.name = 'mdi-help';
    }
    return icon;
}

export function getStatusIcon(status: string): IconInterface {
    const icon = {
        name: '',
        color: 'primary'
    };

    switch (status) {
        case 'Open':
            icon.name = 'mdi-lightbulb-on-10';
            icon.color = 'warning darken-3';
            break;
        case 'In progress':
            icon.name = 'mdi-lightbulb-on-40';
            icon.color = 'warning darken-2';
            break;
        case 'Testing':
            icon.name = 'mdi-lightbulb-on-80';
            icon.color = 'warning darken-1';
            break;
        case 'Done':
            icon.name = 'mdi-lightbulb-on';
            icon.color = 'warning';
            break;
        default:
            icon.name = 'mdi-help';
    }
    return icon;
}

export interface CollaborationInfoInterface {
    ratingScore: {
        totalScore: number;
    },
    supportScore: {
        totalScore: number;
    },
    structureScore: {
        assignmentsScore: number;
        milestoneMeetingsScore: number;
        totalScore: number;
    },
    score: number;
}

export interface StudentDataInterface {
    firstName: string;
    lastName: string;
}

export interface StudentGradesInterface {
    studentData: StudentDataInterface;
    milestoneMeetingsGrade: number;
    assignmentsGrade: number;
    totalGrade: number;
}

export interface GradesCollectionInterface {
    gradesCollection: StudentGradesInterface[];
}