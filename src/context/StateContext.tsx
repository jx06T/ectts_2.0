import React, { createContext, useState, useContext, useCallback, ReactNode, useRef, useEffect } from 'react';
import { useParams, Params } from 'react-router-dom';

interface StateContextType {
  state: StateFormat,
  setState: Function,
  allSet: Aset[],
  setAllSet: Function,
  allSetMap: GroupsIndexMap,
  setAllSetMap: Function,
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StateFormat>({ showE: true, showC: true, onlyPlayUnDone: false, selection: 0, lock: false, rand: false, init: true });
  const [allSet, setAllSet] = useState<Aset[]>([])
  const [allSetMap, setAllSetMap] = useState<GroupsIndexMap>({})
  const { setId } = useParams<Params>();

  const generateAllSetMap = (): GroupsIndexMap => {

    const newAllSetMap: GroupsIndexMap = {}
    if (!allSet) {
      return {}
    }
    allSet.forEach((aSet, i) => {
      if (!aSet.tags) {
        return
      }
      aSet.tags.forEach(tag => {
        if (!newAllSetMap[tag]) {
          newAllSetMap[tag] = []
        }
        newAllSetMap[tag].push(aSet.id)

      })
    })
    return newAllSetMap
  }

  useEffect(() => {
    const initialAllSet = localStorage.getItem('all-set');
    if (initialAllSet) {
      const parsedSets = JSON.parse(initialAllSet);
      setAllSet(parsedSets);
      const setLocation = parsedSets.findIndex((e: Aset) => e.id === setId)
      if (setLocation !== -1 && setLocation !== 0) {
        const thisSet = parsedSets.find((e: Aset) => e.id === setId)
        setAllSet([thisSet, ...parsedSets.filter((e: Aset) => e.id !== setId)]);
      }
    } else {
      localStorage.setItem('all-set', JSON.stringify([]))
    }
  }, [setId])

  useEffect(() => {
    if (allSet.length === 0) {
      return
    }
    console.log(allSet)
    localStorage.setItem('all-set', JSON.stringify(allSet))
    setAllSetMap(generateAllSetMap())
  }, [allSet])

  useEffect(() => {
    localStorage.setItem('all-set-map', JSON.stringify(allSetMap))
  }, [allSetMap])
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
    <StateContext.Provider value={{ state, setState, allSet, setAllSet, setAllSetMap, allSetMap }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = (): StateContextType => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('StateContext must be used within a StateProvider');
  }
  return context;
};