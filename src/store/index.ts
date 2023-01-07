/* eslint-disable  @typescript-eslint/no-explicit-any */
import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import userModule, {namespace as userNamespace} from '@/store/user/index'
import { UserState } from '@/store/user/types'

Vue.use(Vuex);

const modules: { [id: string]: any } = {}
modules[userNamespace] = userModule;

export interface State {
  user: UserState
}

const store: StoreOptions<State> = {
  modules
}

export default new Vuex.Store<State>(store)