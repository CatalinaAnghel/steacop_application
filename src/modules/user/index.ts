export interface UserData {
    roles: Array<string>,
    username: string,
    exp: number,
    id: number,
    code: string,
    fullName: string,
    projects: ProjectData[],
    milestoneMeetingsMax: number|null;
};

export interface ProjectData{
    id: number;
    milestoneMeetingsCounter: number;
}