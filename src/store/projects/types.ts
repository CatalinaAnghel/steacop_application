import { SupervisorState } from "../supervisors/types"

export interface ProjectState {
    title: string,
    description: string;
    id: number,
    supervisor: SupervisorState
}
