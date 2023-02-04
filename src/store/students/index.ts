import { StudentState } from '@/store/students/types'
import actions from '@/store/students/actions'
import mutations from '@/store/students/mutations'
import getters from '@/store/students/getters'

export const studentNamespace = "student";

function initialize(): StudentState {
    return {
        students: []
    }
}

const state: StudentState = initialize();

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
}