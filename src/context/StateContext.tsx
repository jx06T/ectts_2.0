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
      localStorage.setItem('all-set', JSON.stringify([
        {
          "id": "test-samples",
          "title": "測試單字集",
          "tags": ["測試"]
        }
      ]))
      localStorage.setItem('set-test-samples', JSON.stringify([
          {
            "id": "dptba3zf7ukiwshp",
            "english": "quest",
            "chinese": "追求",
            "selected": true,
            "done": true
          },
          {
            "id": "jal32uktdo9mhk1s",
            "english": "carbon",
            "chinese": "碳",
            "selected": true,
            "done": true
          },
          {
            "id": "3x59v0u7xlwjami1",
            "english": "corporation",
            "chinese": "公司",
            "selected": true,
            "done": true
          },
          {
            "id": "guzo7ft8n8bjmx4s",
            "english": "contribute",
            "chinese": "做出貢獻，促成",
            "selected": true
          },
          {
            "id": "myyu6pcp7h84shpf",
            "english": "fundamentally",
            "chinese": "基本上的",
            "selected": true,
            "done": true
          },
          {
            "id": "3gf8x14xttntzv1i",
            "english": "abundant",
            "chinese": "豐富的",
            "selected": true
          },
          {
            "id": "trrw7r0igxbvggvf",
            "english": "widespread",
            "chinese": "普遍的",
            "selected": true,
            "done": true
          },
          {
            "id": "yqhp84bb3iw6hyqw",
            "english": "equipment",
            "chinese": "器材",
            "selected": true
          },
          {
            "id": "tnj3savva0zqjl8f",
            "english": "fossil",
            "chinese": "化石",
            "selected": true
          },
          {
            "id": "9k2ot9zrlc3p4ta6",
            "english": "fuel",
            "chinese": "燃料",
            "selected": true
          },
          {
            "id": "ihrian2nh93kuv0z",
            "english": "fertilizer",
            "chinese": "肥料",
            "selected": true
          },
          {
            "id": "rifu9yjvvjzzqlwp",
            "english": "contrast",
            "chinese": "對比",
            "selected": true
          },
          {
            "id": "m9bpgnl3qr7w42en",
            "english": "partly",
            "chinese": "部分地",
            "selected": true
          },
          {
            "id": "zqnxerymx3fi4uj6",
            "english": "acid",
            "chinese": "酸",
            "selected": true
          },
          {
            "id": "dpikhzfmlo6eu8bt",
            "english": "barrier",
            "chinese": "阻礙",
            "selected": true
          },
          {
            "id": "dqu9nlpv26efcwpt",
            "english": "impose",
            "chinese": "強制實施",
            "selected": true
          },
          {
            "id": "qlplflexgtwr4pei",
            "english": "reminder",
            "chinese": "提醒",
            "selected": true,
            "done": true
          },
          {
            "id": "89b0xt4uut36c3wm",
            "english": "informed",
            "chinese": "了解情況的",
            "selected": true,
            "done": true
          },
          {
            "id": "ggxylcc47xvcxz2i",
            "english": "puchase",
            "chinese": "購買東西",
            "selected": true,
            "done": true
          },
          {
            "id": "hipc7f53fsrf209a",
            "english": "consumer",
            "chinese": "消費者",
            "selected": true
          }
      ]))
    }
  }, [setId])

  useEffect(() => {
    if (allSet.length === 0) {
      return
    }
    // console.log(allSet)
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