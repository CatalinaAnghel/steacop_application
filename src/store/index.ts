import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { StudentState } from './students/types';
import studentModule, { studentNamespace } from '@/store/students/index'
import { PlanState } from './plans/types';
import planModule, { planNamespace } from '@/store/plans/index'

Vue.use(Vuex);

const modules: { [id: string]: object } = {}
modules[studentNamespace] = studentModule;
modules[planNamespace] = planModule;

export interface State {
  students: Array<StudentState>,
  plans: Array<PlanState>
}

const store: StoreOptions<State> = {
  modules
}

export default new Vuex.Store<State>(store)