import actions from '@/store/plans/actions'
import mutations from '@/store/plans/mutations'
import getters from '@/store/plans/getters'
import { PlanState } from './types';

export const planNamespace = "plan";

function initialize(): PlanState {
    return {
        plans: []
    }
}

const state: PlanState = initialize();

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
}