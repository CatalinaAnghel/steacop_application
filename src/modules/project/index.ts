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
}

export interface FunctionalityLineChartOptionsInterface {
    options: {
        chart: {
            id: string;
            // group: string|null;
            type: string;
            curve: string;
            height: number;
            colors: Array<string>;
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