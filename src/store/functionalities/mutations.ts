import { initialize } from ".";
import { FunctionalityGroupInterface, FunctionalityInterface, FunctionalityState, StatusInterface, TypeInterface } from "./types";

export default {
    _storeFunctionalities(state: FunctionalityState, functionalities: FunctionalityGroupInterface): void {
        state.functionalityGroups.splice(functionalities.status.orderNumber - 1, 0, functionalities);
        state.functionalityGroups.sort((group1, group2) => {
            if (group1.status.orderNumber > group2.status.orderNumber) {
                return 1;
            }

            if (group1.status.orderNumber < group2.status.orderNumber) {
                return -1;
            }

            return 0;
        });
    },
    _storeStatuses(state: FunctionalityState, statuses: StatusInterface[]): void {
        state.statuses = statuses;
    },
    _storeTypes(state: FunctionalityState, types: TypeInterface[]): void {
        state.types = types;
    },
    _reset(state: FunctionalityState): void{
        Object.assign(state, initialize());
    },
    _addNewFunctionality(state: FunctionalityState, newFunctionality: FunctionalityInterface): void {
        state.functionalityGroups.forEach((functionalityGroup, index) => {
            if (functionalityGroup.status.id === newFunctionality.status.id){
                state.functionalityGroups[index].functionalities.push(newFunctionality);
            }
        });
    }
}