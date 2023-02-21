import actions from '@/store/weights/actions'
import mutations from '@/store/weights/mutations'
import getters from '@/store/weights/getters'
import { WeightState } from './types';

export const weightNamespace = "weight";

function initialize(): WeightState {
    return {
        weights: []
    }
}

const state: WeightState = initialize();

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
}