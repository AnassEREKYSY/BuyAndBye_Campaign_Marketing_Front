import { createContext, useContext } from 'react';
import {
  User,
  RegisterDTO,
  LoginDTO,
  UpdateUserProfileDTO,
  UpdateSellerProfileDTO,
  BecomeSellerDTO,
} from '@buyandbye/core';

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (data: RegisterDTO) => Promise<void>;
  login: (data: LoginDTO) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUserProfile: (data: UpdateUserProfileDTO) => Promise<void>;
  updateSellerProfile: (data: UpdateSellerProfileDTO) => Promise<void>;
  becomeSeller: (payload: BecomeSellerDTO) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
