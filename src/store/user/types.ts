import User from '@/models/User';
import Auth from '@/models/Auth';

export interface UserState {
    user: User|null,
    auth: Auth|null
};