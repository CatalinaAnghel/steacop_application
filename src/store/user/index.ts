import actions from '@/store/user/actions'
import mutations from '@/store/user/mutations'
import getters from '@/store/user/getters'
import { UserData } from '@/modules/user';
import { UserState } from './types';

export const userNamespace = "user";

export function initialize(): UserState {
    return {
        user: null as UserData | null
    }
}

const state: UserState = initialize();

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
}