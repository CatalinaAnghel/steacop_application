/* eslint-disable  @typescript-eslint/no-explicit-any */
import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { StudentState } from './students/types';
import studentModule, { studentNamespace } from '@/store/students/index'

Vue.use(Vuex);

const modules: { [id: string]: any } = {}
modules[studentNamespace] = studentModule;

export interface State {
  students: Array<StudentState>
}

const store: StoreOptions<State> = {
  modules
}

export default new Vuex.Store<State>(store)