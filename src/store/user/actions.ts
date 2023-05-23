import { UserData } from '@/modules/user';
import { Commit } from 'vuex';
export default {
    load: function ({ commit }: { commit: Commit }, data: UserData): void {
        commit('_storeUser', data);
    },
    reset({commit}: {commit: Commit}): void{
        commit('_reset');
    }
}