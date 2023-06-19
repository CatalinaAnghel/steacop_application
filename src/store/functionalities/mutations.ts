import { initialize } from ".";
import { FunctionalityGroupInterface, FunctionalityInterface, FunctionalityState, HistoryGroupInterface, StatusInterface, TypeInterface } from "./types";

export default {
    _storeFunctionalities(state: FunctionalityState, functionalities: FunctionalityGroupInterface): void {
        if (!state.functionalityGroups.some((element) => element.status.name === functionalities.status.name)) {
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
            state.dirtyFunctionalities = false;
        }
    },
    _storeEpics(state: FunctionalityState, epics: FunctionalityInterface[]): void {
        epics.forEach(element => {
            if (!state.epics.some((epic) => element.id === epic.id)) {
            state.epics.push(element);
            }
        })
    },
    _storeStatuses(state: FunctionalityState, statuses: StatusInterface[]): void {
        state.statuses = statuses;
    },
    _storeTypes(state: FunctionalityState, types: TypeInterface[]): void {
        state.types = types;
    },
    _reset(state: FunctionalityState): void {
        Object.assign(state, initialize());
    },
    _addNewFunctionality(state: FunctionalityState, newFunctionality: FunctionalityInterface): void {
        if (newFunctionality.type.name === 'Epic') {
            state.epics.push(newFunctionality);
        } else {
            state.functionalityGroups.forEach((functionalityGroup, index) => {
                if (functionalityGroup.status.id === newFunctionality.status.id) {
                    state.functionalityGroups[index].functionalities.push(newFunctionality);
                }
            });
        }

        state.dirtyHistory = true;
        state.dirtyFunctionalities = false;
    },
    _storeHistory(state: FunctionalityState, history: HistoryGroupInterface): void {
        state.history.splice(history.status.orderNumber - 1, 0, history);
        state.history.sort((group1, group2) => {
            if (group1.status.orderNumber > group2.status.orderNumber) {
                return 1;
            }

            if (group1.status.orderNumber < group2.status.orderNumber) {
                return -1;
            }

            return 0;
        });
        state.dirtyHistory = false;
    },
    _markAsDirty(state: FunctionalityState): void {
        state.dirtyFunctionalities = true;
        state.dirtyHistory = true;
    },
    _resetFunctionalities(state: FunctionalityState): void {
        state.functionalityGroups = [];
        state.epics = [];
    },
    _resetHistory(state: FunctionalityState): void {
        state.history = [];
    }
}