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
}

export interface ProjectDetailsInterface extends ProjectInterface {
    milestoneMeetingInformation: MeetingInformationInterface;
    guidanceMeetingInformation: MeetingInformationInterface;
    assignmentInformation: InformationInterface;
    repositoryUrl: string;
    grade: number|null;
}

export interface FunctionalityLineChartOptionsInterface {
    options: {
        chart: {
            id: string;
            type: string;
            curve: string;
        },
        colors: Array<string>|null;
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
            y: number;
        }[]
    }>
};

export interface UpdateProjectInterface{
    title: string;
    description: string;
    repositoryUrl: string|null;
}