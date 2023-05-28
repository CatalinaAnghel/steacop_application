import { FunctionalityGroupInterface, FunctionalityState, HistoryGroupInterface, StatusInterface, TypeInterface } from "./types";

export default {
    functionalities(state: FunctionalityState): FunctionalityGroupInterface[] {
        state.functionalityGroups = state.functionalityGroups.sort((elem1, elem2) => {
            if (elem1.status.orderNumber > elem2.status.orderNumber) {
                return 1;
            }

            if (elem1.status.orderNumber < elem2.status.orderNumber) {
                return -1;
            }

            return 0;
        });
        return state.functionalityGroups;
    },
    statuses(state: FunctionalityState): StatusInterface[] {
        return state.statuses;
    },
    types(state: FunctionalityState): TypeInterface[] {
        return state.types;
    },
    history(state: FunctionalityState): HistoryGroupInterface[] {
        return state.history;
    }
};