import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';

interface NotifyContextType {
  notify: string;
  popNotify: (content: string) => void;
}

const NotifyContext = createContext<NotifyContextType | undefined>(undefined);

export const NotifyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notify, setNotify] = useState<string>("");

  const popNotify = useCallback((content: string): void => {
    setNotify(content);
    setTimeout(() => {
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