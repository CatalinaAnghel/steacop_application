import { WeightInterface, WeightState } from "./types";

export default {
    storeWeights(state: WeightState, weights: WeightInterface[]): void {
        state.weights = weights;
    },
    updateWeights(state: WeightState, weightScore: WeightInterface): void {
        state.weights.forEach((element: WeightInterface) => {
            if(element.id === weightScore.id){
                element.weight = weightScore.weight;
            }
        });
    }
}