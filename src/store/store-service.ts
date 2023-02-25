import PlanStoreService from '@/store/plans/service';
import WeightStoreService from '@/store/weights/service';
import { Store } from 'vuex';
import { State } from '.';


export default class StoreService {
    private static instance: StoreService|null = null;
    private store: Store<State>;
    private plansStoreService: PlanStoreService;
    private weightsStoreService: WeightStoreService;

    private constructor(store: Store<State>){
        this.store = store;
        this.plansStoreService = new PlanStoreService(this.store);
        this.weightsStoreService = new WeightStoreService(this.store);
    }

    public static getInstance(store: Store<State>): StoreService {
        if(StoreService.instance == null){
            StoreService.instance = new StoreService(store);
        }
        return StoreService.instance;
    }

    public get plans(): PlanStoreService {
        return this.plansStoreService;
    }

    public get weights(): WeightStoreService {
        return this.weightsStoreService;
    }
}