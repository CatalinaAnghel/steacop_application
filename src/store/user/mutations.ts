import { UserData } from "@/modules/user";
import { ProjectCounterPayloadInterface, UserState } from "./types";
import { initialize } from ".";

export default {
    _storeUser(state: UserState, user: UserData): void {
        if(null === state.user){
            state.user = user;
        }
    },
    _saveMeetingsCounter(state: UserState, data: ProjectCounterPayloadInterface): void{
        const projectDetailsIndex = state.user.projects.findIndex(element=> element.id === data.projectId);

        state.user.projects[projectDetailsIndex].milestoneMeetingsCounter = data.counter;
    },
    _reset(state: UserState): void{
        Object.assign(state, initialize());
    }
}