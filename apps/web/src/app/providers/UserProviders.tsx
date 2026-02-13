import { ReactNode, createContext, useContext } from 'react';
import { UserContainer, BecomeSellerUseCase, HttpClient } from '@buyandbye/core';
import { TokenStorage } from '@/shared/services/storage/TokenStorage';
import { env } from '@/shared/config/env';

const tokenStorage = new TokenStorage();
const httpClient = new HttpClient(env.API_BASE_URL, tokenStorage);
const userContainer = UserContainer.getInstance(httpClient);

interface UserContextValue {
  becomeSellerUseCase: BecomeSellerUseCase;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const useUserUseCases = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserUseCases must be used within UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const value: UserContextValue = {
    becomeSellerUseCase: userContainer.becomeSellerUseCase,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
