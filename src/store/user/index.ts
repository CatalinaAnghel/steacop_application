import { UserState } from '@/store/user/types'

export const namespace = 'user'

function initialize(): UserState {
    return {
       user: null,
       auth: null
    }
}

const state: UserState = initialize()

const mutations = {

}

const getters = {

}

const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}