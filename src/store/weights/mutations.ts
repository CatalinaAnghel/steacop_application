import { initialize } from ".";
import { WeightInterface, WeightState } from "./types";

export default {
    _storeWeights(state: WeightState, weights: WeightInterface[]): void {
        state.weights = weights;
    },
    _updateWeights(state: WeightState, weightScore: WeightInterface): void {
        state.weights.forEach((element: WeightInterface) => {
            if(element.id === weightScore.id){
                element.weight = weightScore.weight;
            }
        });
    },
    _reset(state: WeightState): void{
        Object.assign(state, initialize());
    }
}