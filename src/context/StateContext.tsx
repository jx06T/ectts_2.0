import React, { createContext, useState, useContext, useCallback, ReactNode, useRef, useEffect } from 'react';

interface StateContextType {
  state: StateFormat,
  setState: Function
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StateFormat>({ showE: true, showC: true, onlyPlayUnDone: false, selection: 0, lock: false, rand: false, init: true });

  useEffect(() => {
    if (state.init) {
      const state0 = localStorage.getItem("ectts-state");
      if (state0) {
        setState({ ...JSON.parse(state0), deleting: false, init: false });
      } else {
        setState({ ...state, init: false });
      }
      return
    }
    localStorage.setItem("ectts-state", JSON.stringify(state))
  }, [state])

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