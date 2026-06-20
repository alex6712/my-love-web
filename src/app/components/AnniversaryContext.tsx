/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';

interface AnniversaryContextType {
  isAnniversaryToday: boolean;
  setIsAnniversaryToday: (value: boolean) => void;
}

const AnniversaryContext = createContext<AnniversaryContextType>({
  isAnniversaryToday: false,
  setIsAnniversaryToday: () => {},
});

export function AnniversaryProvider({ children }: { children: ReactNode }) {
  const [isAnniversaryToday, setIsAnniversaryToday] = useState(false);
  return (
    <AnniversaryContext.Provider value={{ isAnniversaryToday, setIsAnniversaryToday }}>
      {children}
    </AnniversaryContext.Provider>
  );
}

export function useAnniversary() {
  return useContext(AnniversaryContext);
}
