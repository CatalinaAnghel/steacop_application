import { WeightInterface, WeightState } from "./types";

export default {
    weights(state: WeightState): WeightInterface[] {
        return state.weights;
    } 
};