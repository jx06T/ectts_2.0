import React, { createContext, useState, useContext, useCallback, ReactNode, useRef } from 'react';

interface NotifyContextType {
  notify: string;
  popNotify: (content: string) => void;
}

const NotifyContext = createContext<NotifyContextType | undefined>(undefined);

export const NotifyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [notify, setNotify] = useState<string>("");

  const popNotify = useCallback((content: string): void => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setNotify(content);
    timerRef.current = setTimeout(() => {
      setNotify("");
    }, 2000);
  }, []);

  return (
    <NotifyContext.Provider value={{ notify, popNotify }}>
      {children}
    </NotifyContext.Provider>
  );
};

export const useNotify = (): NotifyContextType => {
  const context = useContext(NotifyContext);
  if (context === undefined) {
    throw new Error('useNotify must be used within a NotifyProvider');
  }
  return context;
};