import actions from '@/store/plans/actions'
import mutations from '@/store/user/mutations'
import getters from '@/store/user/getters'
import { UserData } from '@/modules/user';

export const userNamespace = "user";

function initialize(): UserData {
    return {
        roles: [],
        username: "",
        exp: 0,
        id: 0,
        code: ""
    }
}

const state: UserData = initialize();

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
}