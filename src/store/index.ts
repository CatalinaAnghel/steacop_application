import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { StudentState } from './students/types';
import studentModule, { studentNamespace } from '@/store/students/index'
import { PlanState } from './plans/types';
import planModule, { planNamespace } from '@/store/plans/index'
import userModule, { userNamespace } from '@/store/user/index'
import weightModule, { weightNamespace } from '@/store/weights/index'
import { WeightState } from './weights/types';
import StoreService from './store-service';
import supervisorModule, { supervisorNamespace } from './supervisors';
import { SupervisorState } from './supervisors/types';

Vue.use(Vuex);

const modules: { [id: string]: object } = {};
modules[studentNamespace] = studentModule;
modules[supervisorNamespace] = supervisorModule;
modules[planNamespace] = planModule;
modules[userNamespace] = userModule;
modules[weightNamespace] = weightModule;

export interface State {
  students: Array<StudentState>,
  supervisors: Array<SupervisorState>,
  plans: Array<PlanState>,
  weights: Array<WeightState>
}

const store: StoreOptions<State> = {
  modules
}

const instance = new Vuex.Store<State>(store);
export const storeService: StoreService = StoreService.getInstance(instance);

export default instance;