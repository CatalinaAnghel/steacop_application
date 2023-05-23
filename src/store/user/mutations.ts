import { UserData } from "@/modules/user";
import { UserState } from "./types";
import { initialize } from ".";

export default {
    _storeUser(state: UserState, user: UserData): void {
        if(null === state.user){
            state.user = user;
        }
    },
    _reset(state: UserState): void{
        Object.assign(state, initialize());
    }
}