import { SupervisorState } from "../supervisors/types"

export interface ProjectState {
    name: string,
    id: number,
    supervisor: SupervisorState
}
