import React, { useEffect, useRef, useState } from 'react'

import { Params, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { TablerCircleArrowUpFilled, TablerEyeClosed, IcRoundAccountCircle, IcRoundMenuOpenL, IcRoundMenuOpenR, MdiCardsOutline, MaterialChecklistRtl, CarbonSelectWindow, MdiDice5, Fa6SolidFileImport, MaterialDeleteRounded, MaterialLock, MaterialLockOpen, MaterialFileMove, Fa6SolidFileExport, PhSelectionBold, PhSelectionDuotone, PhSelectionInverseDuotone, BxBxsHide, BxBxsShow, MaterialSymbolsEditRounded } from '../utils/Icons'
import { getRandId, copyToClipboard } from '../utils/tool';

import { useNotify } from '../context/NotifyContext'
import { useStateContext } from '../context/StateContext';
import createConfirmDialog from './ConfirmDialog';

import WordItem from './WordItem'
import PlayArea from './PlayArea'
import CardArea from './CardArea'
// import SmallCard from './SmallCard';

/*
function FunctionMenu() {
    const { state, setState } = useStateContext()
    const { notify, popNotify } = useNotify();

    return (
        <div>
            <a className='cursor-pointer w-10 h-10' onClick={() => {
                // popNotify(!state.cards ? "Cards mode" : "Normal mode")
                // setRandomTable(getRandomTable(words, state.rand, state))
                // if (randomTable.length === 0) {
                //     return
                // }
                // setplayIndex(0)
                // setState({ ...state, cards: !state.cards })
            }}>
                <MdiCardsOutline className={` text-2xl ${state.cards ? " text-purple-700" : ""}`} />
            </a>
            <a className='cursor-pointer w-10 h-10' onClick={() => {
                popNotify('Click the right box to delete')
                setState({ ...state, deleting: !state.deleting })
            }}>
                <MaterialSymbolsEditRounded className={` text-2xl ${state.deleting ? "text-red-800" : ""}`} />
            </a>
            <a className='cursor-pointer w-10 h-10' onClick={handleImport}>
                <Fa6SolidFileImport className=' text-xl mt-[2px]  text-red-800' />
            </a>

            <a className='w-10 h-10 pt-[2px]' onClick={handleExport}>
                <Fa6SolidFileExport className='text-xl' />
            </a>

            <a className='cursor-pointer w-10' onClick={() => {
                    popNotify(state.editing ? "Select mode" : "Normal mode")
                    setState((pre: State1) => {
                        const newState = { ...pre, editing: !pre.editing }
                        return newState
                    })
                }}>
                    {state.editing ? <MaterialChecklistRtl className='text-2xl' /> : <CarbonSelectWindow className='text-2xl' />}
                </a>
        </div>

    )
}
*/

function MainBlock() {
    const { setId, mode } = useParams<Params>();
    const [cardsMode, setCardsMode] = useState<boolean>(mode === "cards")

    const navigate = useNavigate();
    const { state, setState } = useStateContext()
    const [currentTitle, setCurrentTitle] = useState<string>("");
    const [words, setWords] = useState<Word[]>([]);

    const [focusIndex, setFocusIndex] = useState<number>(0);
    const [playIndex, setPlayIndex] = useState<number>(0);
    const [topIndex, setTopIndex] = useState<number>(0);
    const [randomTable, setRandomTable] = useState<number[]>([])

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputBoxRef = useRef<HTMLTextAreaElement>(null);
    const { notify, popNotify } = useNotify();

    const observerRef = useRef<IntersectionObserver | null>(null);

    const onIdle = (cb: IdleRequestCallback) =>
        (window.requestIdleCallback || ((cb) => setTimeout(cb, 1)))(cb);


    const init = () => {
        if (!scrollRef.current) {
            return
        }
        const setCurrentLink = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            for (const { isIntersecting, target } of entries) {
                // @ts-ignore
                if (!isIntersecting || !target.dataset.index) {
                    return
                }
                // @ts-ignore
                console.log(parseInt(target.dataset.index))
                // @ts-ignore
                setTopIndex(parseInt(target.dataset.index))
            }
        }

        const toObserve = scrollRef.current.querySelectorAll('.a-word');
        observerRef.current = new IntersectionObserver(setCurrentLink, { rootMargin: getRootMargin() });

        if (!observerRef.current) {
            return
        }

        if (toObserve.length === 0) {
            setTimeout(() => {
                init()
            }, 500);
        }
        toObserve.forEach((h) => observerRef.current!.observe(h));

        return () => {
            observerRef.current!.disconnect();
            observerRef.current = null
        };
    };

    const getRootMargin = () => {
        const top = 115;
        const bottom = top + 60;
        const height = document.documentElement.clientHeight;
        return `-${top}px 0% ${bottom - height}px`;
    };

    useEffect(() => {
        const handleResize = () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                setTimeout(() => {
                    onIdle(init);
                }, 500);
            }
        };

        init();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        updataRandomTable()

        if (setId === "" || !setId) {
            setWords([])
            return
        }

        const Words0 = localStorage.getItem(`set-${setId}`);
        if (Words0) {
            setWords(JSON.parse(Words0 as string));
        } else {
            navigate('/');
        };

        const AllSet0 = localStorage.getItem("all-set");
        if (AllSet0) {
            const AllSet = JSON.parse(AllSet0)
            if (AllSet.length > 0 && AllSet.find((e: Aset) => e.id === setId)) {
                setCurrentTitle(AllSet.find((e: Aset) => e.id === setId).title)
            } else {
                navigate('/');
            }
        } else {
            navigate('/');
        }

    }, [setId])

    useEffect(() => {
        init()
    }, [randomTable])

    useEffect(() => {
        console.log(setId, words)
        if (words.length === 0) {
            return
        }
        updataRandomTable()
        localStorage.setItem(`set-${setId!}`, JSON.stringify(words))
    }, [words])

    const scrollToTop = (index: number): void => {
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                // top: index * 52 - 300 + (0.5 * (900 - window.innerHeight)),
                top: index * 52 - (0.5 * (900 - window.innerHeight)) + 90,
                behavior: 'smooth'
            });
        }, 100);
    }

    const handleWordChange = (index: number, field: 'english' | 'chinese', value: string) => {
        setWords(prev => prev.map((word, i) =>
            i === index ? { ...word, [field]: value } : word
        ));
    };

    const handleReverseSelection = () => {
        popNotify('Inverse selected')
        setState({ ...state, selection: 0 })
        setWords(prev => prev.map((word, i) => ({ ...word, selected: state.editing ? !word.selected : word.selected, done: state.editing ? word.done : !word.done })));
    };

    const handleSelectAll = () => {
        const t = state.selection !== 1
        popNotify(t ? 'All selected' : 'None selected')
        setState({ ...state, selection: state.selection === 1 ? -1 : 1 })
        setWords(prev => prev.map((word, i) => ({ ...word, selected: state.editing ? t : word.selected, done: state.editing ? word.done : t })));
    };

    const handleImport = () => {
        if (inputBoxRef.current) {
            if (inputBoxRef.current.value === "") {
                popNotify("Please fill the textarea below first")
                return
            }
            createConfirmDialog(
                "Are you sure you want to import these words? \nThis action will replace your current word list. \nIf you want to keep the current word list, you can import words into a new set.",
                () => {
                    const lines = inputBoxRef.current!.value.split("\n");
                    const result = [];

                    for (let i = 0; i < lines.length; i += 2) {
                        if (i + 1 < lines.length) {
                            result.push({
                                id: getRandId(16),
                                english: lines[i].trim(),
                                chinese: lines[i + 1].trim()
                            });
                        }
                    }

                    setWords(result);
                    popNotify("Words imported successfully!");
                },
                () => {
                    popNotify("Import canceled.");
                }
            );
        }
    };

    const handleExport = () => {
        const WordsToExport = words.map(e => state.editing && !e.selected ? "$^#*&" : (e.english + "\n" + e.chinese)).filter(e => e !== "$^#*&")
        const ExportText = WordsToExport.join("\n")

        if (inputBoxRef.current) {
            inputBoxRef.current.value = ExportText
        }
        popNotify(WordsToExport.length + " words copied & exported")
        copyToClipboard(ExportText)
    };

    const handleDoneToggle = (index: number) => {
        // if (state.cards) {

        //     setWords(prev => {
        //         const newWords = prev.map((word, i) => i === index ? { ...word, done: !word.done } : word)
        //         popNotify(`${newWords.filter(word => word.done).length}／${words.length} words selected`)
        //         return newWords
        //     });

        //     return
        // }

        // if (state.deleting) {
        //     setWords(prev => prev.filter((e, i) => i !== index))
        //     updataRandomTable()
        //     return
        // }

        // setState({ ...state, selection: 0 })

        // if (!state.editing) {
        //     const newWords = words.map((word, i) => i === index ? { ...word, done: !word.done } : word)
        //     setWords(newWords)
        //     popNotify(`${newWords.filter(word => word.done).length}／${newWords.length} words done`)
        //     if (randomTable[playIndex] > index) {
        //         setPlayIndex(playIndex + (newWords[index].done ? -1 : 1))
        //     }

        // } else {
        //     const newWords = words.map((word, i) => i === index ? { ...word, selected: !word.selected } : word)
        //     setWords(newWords)
        //     popNotify(`${newWords.filter(word => word.selected).length}／${newWords.length} words selected`)
        //     if (randomTable[playIndex] > index) {
        //         setPlayIndex(playIndex + (newWords[index].selected ? 1 : -1))
        //     }
        // }
    };

    const addNewWord = () => {
        setWords(prev => [...prev, { id: getRandId(16), chinese: "", english: "", done: false, selected: false }]);
        setFocusIndex(words.length);
        scrollToTop(words.length)
        updataRandomTable()
    };

    const handlePlayThisWord = (index: number) => {
        setTimeout(() => {
            console.log("怎麼撥放")
        }, 100);
    }
    const getRandomTable = (len: number): number[] => {
        const arr: number[] = new Array(len).fill(0).map((i, index) => index)
        for (let _ = 0; _ < len; _++) {
            const i = Math.floor(Math.random() * len);
            const j = Math.floor(Math.random() * len);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr
    }

    const updataRandomTable = () => {
        if (!state.rand) {
            resetRandomTable()
            return
        }
        if (randomTable.length === words.length) {
            return
        }
        if (randomTable.length === words.length - 1) {
            setRandomTable([...randomTable, words.length - 1])
            return
        }
        const arr: number[] = getRandomTable(words.length)
        setRandomTable(arr)
    }

    const resetRandomTable = () => {
        const arr: number[] = new Array(words.length).fill(0).map((i, index) => index)
        console.log(arr)
        setRandomTable(arr)
    }

    return (
        <div className=' main bg-slate-25 w-full sm:h-full px-1  py-2 flex flex-col relative'>

            <div className='flex justify-between'>
                <Link to="/" className=' cursor-pointer ml-11 m-1 mt-[3px] min-w-[70px]'>ECTTS 2.0</Link>
                <div className='  hover:bg-slate-200 w-[2.15rem] h-[2.15rem] rounded-full p-[2px]'>
                    <IcRoundAccountCircle className=' w-full h-full text-center text-3xl' />
                </div>
            </div>

            <div className='tool-icon-div flex justify-start xs:justify-center space-x-4 ml-3'>

                <a className='cursor-pointer w-[39px] h-10 pt-[1px]' onClick={() => {
                    popNotify(state.showE ? "Hide English" : "Show English")
                    setState({ ...state, showE: !state.showE })
                }}>
                    {!state.showE ? <TablerEyeClosed className='text-2xl' /> : <BxBxsShow className='text-2xl' />}
                </a>

                <a className='cursor-pointer w-10 pt-[1px]' onClick={() => {
                    popNotify(state.showC ? "Hide Chinese" : "Show Chinese")
                    setState({ ...state, showC: !state.showC })
                }}>
                    {!state.showC ? <TablerEyeClosed className='text-2xl' /> : <BxBxsShow className='text-2xl' />}
                </a>

                <a className='cursor-pointer w-10' onClick={() => {
                    popNotify(state.lock ? "Unlocked" : "locked")
                    setState({ ...state, lock: !state.lock })
                }}>
                    {!state.lock ? <MaterialLockOpen className='text-2xl' /> : <MaterialLock className='text-2xl' />}
                </a>

                <a className='cursor-pointer w-10' onClick={handleSelectAll}>
                    {state.selection === 1 ? <PhSelectionBold className='text-2xl' /> : <PhSelectionDuotone className='text-2xl' />}
                </a>

                <a className='cursor-pointer w-10' onClick={() => {
                    popNotify(!state.rand ? "Random mode" : "Normal mode")
                    setState({ ...state, rand: !state.rand })
                    console.log("隨機?")
                }}>
                    <MdiDice5 className={` text-2xl ${state.rand ? " text-green-700" : ""}`} />
                </a>

            </div>

            <div className=' relative flex justify-center h-full w-full overflow-y-auto px-1'>

                <div ref={scrollRef}
                    style={{
                        scrollSnapType: 'y mandatory',
                        scrollPadding: '0px 0px',
                    }}
                    className='jx-5 h-full px-1 sm:px-2 max-w-full sm:max-w-[28rem] sm:min-w-[22rem] space-y-3 overflow-x-hidden '>
                    {randomTable.map((index, i) => {
                        const word = words[index]
                        return (<WordItem
                            key={word.id}
                            word={word}
                            index={index}
                            indexP={i}
                            state={state}
                            isFocused={i === focusIndex}
                            isTop={i === topIndex}
                            isPlaying={index === randomTable[playIndex]}
                            onPlay={handlePlayThisWord}
                            onChange={handleWordChange}
                            onDoneToggle={handleDoneToggle}
                            onNext={() => {
                                if (i + 2 > words.length) {
                                    setFocusIndex(i + 1)
                                    addNewWord()
                                }
                            }}
                        />)
                    })
                    }

                    < div className='h-[90%] relative'>
                        <button className=' absolute right-2 bottom-20' ><TablerCircleArrowUpFilled className='text-4xl' /></button>
                    </div>
                </div>
            </div>

            {cardsMode && <CardArea state={state} handleDoneToggle={handleDoneToggle} randomTable={randomTable} progress={{ currentProgress: playIndex, setCurrentProgress: setPlayIndex }} words={words} />}

            <PlayArea randomTable={randomTable} progress={{ currentProgress: playIndex, setCurrentProgress: setPlayIndex }} currentTitle={currentTitle} words={words} />
        </div >
    )
}

export default MainBlock
