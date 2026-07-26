import {create} from 'zustand';
import EncryptedStorage from 'react-native-encrypted-storage';
import api from '../services/api';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  xp: number;
  level: number;
  streak: number;
  badges: {id: string; name: string; icon: string; earned: boolean}[];
  missionsCompleted: number;
  branchId?: string;
  branchName?: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isLoading: boolean;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => void;
  addXP: (xpAmount: number) => void;
  completeMission: (missionId: string) => void;
}

const API_URL = 'http://localhost:3000';

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isLoading: true,
  isHydrated: false,

  hydrate: async () => {
    try {
      const token = await EncryptedStorage.getItem('auth_token');
      const userString = await EncryptedStorage.getItem('user_data');
      if (token && userString) {
        const user = JSON.parse(userString);
        // Fetch fresh user data from backend
        try {
          const response = await api.get('/users/me', {
            headers: {Authorization: `Bearer ${token}`},
          });
          const freshUser = response.data;
          await EncryptedStorage.setItem('user_data', JSON.stringify(freshUser));
          set({token, user: freshUser, isLoading: false, isHydrated: true});
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (e) {
          // Fallback to stored user if API fails
          set({token, user, isLoading: false, isHydrated: true});
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } else {
        set({isLoading: false, isHydrated: true});
      }
    } catch (e) {
      set({isLoading: false, isHydrated: true});
    }
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', {email, password});
    const {accessToken, user} = response.data;

    await EncryptedStorage.setItem('auth_token', accessToken);
    await EncryptedStorage.setItem('user_data', JSON.stringify(user));

    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    set({token: accessToken, user});
  },

  logout: async () => {
    await EncryptedStorage.removeItem('auth_token');
    await EncryptedStorage.removeItem('user_data');
    delete api.defaults.headers.common['Authorization'];
    set({token: null, user: null});
  },

  updateUser: (updates) => {
    const {user} = get();
    if (!user) return;
    const updated = {...user, ...updates};
    set({user: updated});
    // Persist to secure storage asynchronously
    EncryptedStorage.setItem('user_data', JSON.stringify(updated));
  },

  addXP: (xpAmount) => {
    const {user} = get();
    if (!user) return;
    const newXP = user.xp + xpAmount;
    const newLevel = Math.floor(newXP / 100) + 1;
    const updated = {
      ...user,
      xp: newXP,
      level: newLevel,
    };
    set({user: updated});
    EncryptedStorage.setItem('user_data', JSON.stringify(updated));
  },

  completeMission: (missionId) => {
    const {user, addXP} = get();
    if (!user) return;
    const updated = {
      ...user,
      missionsCompleted: user.missionsCompleted + 1,
      streak: user.streak + 1,
    };
    set({user: updated});
    EncryptedStorage.setItem('user_data', JSON.stringify(updated));
  },
}));