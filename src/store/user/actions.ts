import { UserData } from '@/modules/user';
import MeetingService from '@/services/meeting-service';
import { Commit } from 'vuex';
import { ProjectCounterPayloadInterface, UserState } from './types';
import { CommitStateInterface } from '../common/types';
export default {
    load: function ({ commit }: { commit: Commit }, data: UserData): void {
        commit('_storeUser', data);
    },
    reset({commit}: {commit: Commit}): void{
        commit('_reset');
    },
    async loadProjectMeetingCounter({state, commit}: CommitStateInterface<UserState>, projectId: number): Promise<void>{
        const projectDetails = state.user.projects.find(element => element.id === projectId);

        if(typeof projectDetails !== 'undefined' && 
        (typeof projectDetails.milestoneMeetingsCounter === 'undefined' || projectDetails.milestoneMeetingsCounter === null)){
            const meetings = await MeetingService.getMilestoneMeetings([projectId]);
        
            commit('_saveMeetingsCounter', {
                projectId: projectId,
                counter: meetings.length
            } as ProjectCounterPayloadInterface);
        }
    },
    saveMeetingsCounter({state, commit}: CommitStateInterface<UserState>, data: ProjectCounterPayloadInterface): void{
        const projectDetails = state.user.projects.find(element => element.id === data.projectId);

        if(typeof projectDetails !== 'undefined'){
            commit('_saveMeetingsCounter', data);
        }
    }
}