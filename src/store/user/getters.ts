import { UserData } from "@/modules/user";
import { UserState } from "./types";

export default {
    user(state: UserState): UserData | null {
        return state.user;
    }
}