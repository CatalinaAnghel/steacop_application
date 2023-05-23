import axios from '@/plugins/axios';
import ErrorHandler from '@/services/error-handler-service';
import { AxiosResponse } from 'axios';
import { CreateFunctionalityPayloadInterface, FunctionalityGroupInterface, FunctionalityInterface, FunctionalityPayloadInterface, FunctionalityState, OrderedCollectionInterface, OrderingPayloadInterface, StatusInterface, TypeInterface } from './types';
import { Commit } from 'vuex';
import { CommitStateInterface } from '../common/types';
import { ResponseDto } from '@/modules/common';

export default {
    async loadFunctionalities({ commit, state }: CommitStateInterface<FunctionalityState>, payload: FunctionalityPayloadInterface | null = null): Promise<void> {
        if (state.functionalityGroups.length === 0) {
            let requestStatus = {
                success: true,
                error: '',
                code: null as number | null
            };
            const params = {
                "pagination": false,
                "project.id": payload.projectId,
                "functionalityStatus.id": payload.status.id
            };

            const response = await axios.get('/functionalities', {
                params
            })
                .catch(error => {
                    requestStatus = ErrorHandler.handleError(error);
                });

            if (requestStatus.success) {
                // the request has been successfully performed
                const functionalities: FunctionalityInterface[] = (response as AxiosResponse).data;
                commit('_storeFunctionalities', {
                    status: payload.status,
                    functionalities: functionalities,
                } as FunctionalityGroupInterface);
            }
        }
    },
    async loadStatuses({ commit, state }: CommitStateInterface<FunctionalityState>): Promise<void> {
        if (state.statuses.length === 0) {
            let requestStatus = {
                success: true,
                error: '',
                code: null as number | null
            };
            const response = await axios.get('/functionality-statuses')
                .catch(error => {
                    requestStatus = ErrorHandler.handleError(error);
                });

            if (requestStatus.success) {
                // the request has been successfully performed
                const statuses: StatusInterface[] = (response as AxiosResponse).data;
                statuses.sort((elem1, elem2) => {
                    if (elem1.orderNumber > elem2.orderNumber) {
                        return 1;
                    }

                    if (elem1.orderNumber < elem2.orderNumber) {
                        return -1;
                    }

                    return 0;
                });
                commit('_storeStatuses', statuses);
            }
        }
    },
    async loadTypes({ commit, state }: CommitStateInterface<FunctionalityState>): Promise<void> {
        if (state.types.length === 0) {
            let requestStatus = {
                success: true,
                error: '',
                code: null as number | null
            };
            const response = await axios.get('/functionality-types')
                .catch(error => {
                    requestStatus = ErrorHandler.handleError(error);
                });

            if (requestStatus.success) {
                // the request has been successfully performed
                const types: TypeInterface[] = (response as AxiosResponse).data;
                types.sort((elem1, elem2) => {
                    if (elem1.id > elem2.id) {
                        return 1;
                    }

                    if (elem1.id < elem2.id) {
                        return -1;
                    }

                    return 0;
                });
                commit('_storeTypes', types);
            }
        }
    },
    async create({ commit }: { commit: Commit }, payload: CreateFunctionalityPayloadInterface): Promise<FunctionalityInterface|null> {
        let requestStatus = {
            success: true,
            error: '',
            code: null as number | null
        };

        const response = await axios.post('/functionalities', payload)
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        let addedFunctionality: FunctionalityInterface|null = null;
        if (requestStatus.success) {
            addedFunctionality = (response as AxiosResponse).data;
            commit('_addNewFunctionality', addedFunctionality);
        }

        return addedFunctionality;
    },
    reset({ commit }: { commit: Commit }): void {
        commit('_reset');
    },
    async save({ state }: CommitStateInterface<FunctionalityState>, payload: FunctionalityGroupInterface[]): Promise<ResponseDto> {
        let requestStatus = {
            success: true,
            error: '',
            code: null as number | null
        };
        const orderingCollections = {
            orderingCollections: [] as OrderedCollectionInterface[]
        } as OrderingPayloadInterface;
        payload.forEach((value) => {
            const orderedFunctionalities = [] as number[];
            value.functionalities.forEach((functionality) => {
                orderedFunctionalities.push(functionality.id);
            })
            orderingCollections.orderingCollections.push({
                statusId: value.status.id,
                functionalities: orderedFunctionalities
            } as OrderedCollectionInterface);
        });

        await axios.post('/functionalities-orderings', orderingCollections)
            .then(() => {
                state.functionalityGroups = [];
            })
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    },
    async uploadAttachment(_: CommitStateInterface<FunctionalityState>, formData: FormData): Promise<ResponseDto> {
        const requestStatus = {
            success: true,
            error: '',
            data: '',
            code: null as number | null
        };

        const response = await axios.post('/functionality-attachments', formData)
            .catch(error => {
                const requestStatusTemp = ErrorHandler.handleError(error);
                requestStatus.success = requestStatusTemp.success;
                requestStatus.error = requestStatusTemp.error;
            });

        if (requestStatus.success) {
            console.log(response);
        }

        return requestStatus;
    }
}