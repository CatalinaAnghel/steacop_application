import { SupervisorState } from '@/store/supervisors/types'
import actions from '@/store/supervisors/actions'
import mutations from '@/store/supervisors/mutations'
import getters from '@/store/supervisors/getters'

export const supervisorNamespace = "supervisor";

function initialize(): SupervisorState {
    return {
        supervisors: []
    }
}

const state: SupervisorState = initialize();

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
}