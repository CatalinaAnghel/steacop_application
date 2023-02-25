import { PayloadInterface } from "../common/types";

export interface WeightInterface{
    id: number;
    name: string;
    weight: number;
};

export interface PatchWeightInterface extends PayloadInterface{
    supportWeight: number;
    structureWeight: number;
    ratingWeight: number;
    structurePenalty: number;
};

export interface WeightState {
    weights: Array<WeightInterface>;
};