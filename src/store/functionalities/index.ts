import actions from '@/store/functionalities/actions'
import mutations from '@/store/functionalities/mutations'
import getters from '@/store/functionalities/getters'
import { FunctionalityState } from './types';

export const functionalityNamespace = "functionality";

export function initialize(): FunctionalityState {
    return {
        functionalityGroups: [],
        types: [],
        statuses: []
    }
}

const state: FunctionalityState = initialize();

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
}