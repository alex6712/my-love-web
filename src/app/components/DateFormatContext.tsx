import { createContext, useContext, useState, type ReactNode } from 'react';
import type { DurationFormat } from '../utils/date';

interface DateFormatContextType {
  format: DurationFormat;
  setFormat: (format: DurationFormat) => void;
}

const DateFormatContext = createContext<DateFormatContextType>({
  format: 'days',
  setFormat: () => {},
});

export function DateFormatProvider({ children }: { children: ReactNode }) {
  const [format, setFormat] = useState<DurationFormat>('days');
  return (
    <DateFormatContext.Provider value={{ format, setFormat }}>
      {children}
    </DateFormatContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDateFormat() {
  return useContext(DateFormatContext);
}
