import React, { createContext, useState, useContext, useCallback, ReactNode, useRef } from 'react';

interface StateContextType {
  state: State1,
  setState: Function
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<State1>({ showE: true, showC: true, editing: false, selection: 0, lock: false, rand: false, cards: false, deleting: false, init: true });

  return (
    <StateContext.Provider value={{ state, setState }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = (): StateContextType => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useNotify must be used within a StateProvider');
  }
  return context;
};