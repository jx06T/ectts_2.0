import React, { useEffect, useRef, useState } from 'react'

import { Params, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { IcRoundAccountCircle, IcRoundMenuOpenL, IcRoundMenuOpenR, MdiCardsOutline, MaterialChecklistRtl, CarbonSelectWindow, MdiDice5, Fa6SolidFileImport, MaterialDeleteRounded, MaterialLock, MaterialLockOpen, MaterialFileMove, Fa6SolidFileExport, PhSelectionBold, PhSelectionDuotone, PhSelectionInverseDuotone, BxBxsHide, BxBxsShow, MaterialSymbolsEditRounded } from '../utils/Icons'
import { getRandId, copyToClipboard } from '../utils/tool';

import { useNotify } from '../context/NotifyContext'
import { useStateContext } from '../context/StateContext';
import createConfirmDialog from './ConfirmDialog';

import WordItem from './WordItem'
import PlayArea from './PlayArea'
import CardArea from './CardArea'

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
                // setPlayPosition(0)
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
        </div>

    )
}

function MainBlock() {
    const navigate = useNavigate();
    const { setId } = useParams<Params>();
    const { state, setState } = useStateContext()
    const [currentTitle, setCurrentTitle] = useState<string>("");
    const [words, setWords] = useState<Word[]>([]);
    const [focusIndex, setFocusIndex] = useState<number>(0);
    const [playPosition, setPlayPosition] = useState<number>(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputBoxRef = useRef<HTMLTextAreaElement>(null);
    const { notify, popNotify } = useNotify();


    const bigRandomTableRef = useRef<number[] | null>([]);
    const [randomTable, setRandomTable] = useState<number[]>([])

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
        console.log(setId, words)
        if (words.length === 0) {
            return
        }
        localStorage.setItem(`set-${setId!}`, JSON.stringify(words))
    }, [words])

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


    const getRandomTable = (words: Word[], r: boolean, state: State1): number[] => {
        const arr: number[] = r ? bigRandomTableRef.current!.filter(i => (state.editing ? words[i].selected : !words[i].done)) : words.map((word, i) => (state.editing ? word.selected : !word.done) ? i : -1).filter(e => e !== -1)
        if (arr.length === 0) {
            setState({ ...state, cards: false })
        }
        return arr
    }

    const scrollToCenter = (index: number): void => {
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                top: index * 52 - 300 + (0.5 * (900 - window.innerHeight)),
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
        if (state.cards) {

            setWords(prev => {
                const newWords = prev.map((word, i) => i === index ? { ...word, done: !word.done } : word)
                popNotify(`${newWords.filter(word => word.done).length}／${words.length} words selected`)
                return newWords
            });

            return
        }

        if (state.deleting) {
            setWords(prev => prev.filter((e, i) => i !== index))
            updataRandomTable()
            return
        }

        setState({ ...state, selection: 0 })

        if (!state.editing) {
            const newWords = words.map((word, i) => i === index ? { ...word, done: !word.done } : word)
            setWords(newWords)
            popNotify(`${newWords.filter(word => word.done).length}／${newWords.length} words done`)
            if (randomTable[playPosition] > index) {
                setPlayPosition(playPosition + (newWords[index].done ? -1 : 1))
            }

        } else {
            const newWords = words.map((word, i) => i === index ? { ...word, selected: !word.selected } : word)
            setWords(newWords)
            popNotify(`${newWords.filter(word => word.selected).length}／${newWords.length} words selected`)
            if (randomTable[playPosition] > index) {
                setPlayPosition(playPosition + (newWords[index].selected ? 1 : -1))
            }
        }
    };

    const addNewWord = () => {
        setWords(prev => [...prev, { id: getRandId(16), chinese: "", english: "", done: false, selected: false }]);
        setFocusIndex(words.length);
        scrollToCenter(words.length)
        updataRandomTable()
    };

    const handlePlayThisWord = (index: number) => {
        setTimeout(() => {
            setRandomTable(prev => {
                setPlayPosition(prev.indexOf(index))
                return prev
            })
        }, 100);
    }

    useEffect(() => {
        if (bigRandomTableRef.current!.length === 0 || bigRandomTableRef.current!.length !== words.length) {
            updataRandomTable()
        }

        setRandomTable(getRandomTable(words, state.rand, state))
    }, [words])

    const updataRandomTable = () => {
        const arr: number[] = words.map((word, i) => i)
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        bigRandomTableRef.current = arr

        setRandomTable(getRandomTable(words, state.rand, state))
    }

    return (
        <div className=' main bg-slate-25 w-full sm:h-full px-1  py-2 flex flex-col relative'>

            <div className='flex justify-between'>
                <Link to="/" className=' cursor-pointer ml-11 m-1 mt-[3px] min-w-[70px]'>ECTTS 2.0</Link>
                <div className='  hover:bg-slate-200 w-[2.15rem] h-[2.15rem] rounded-full p-[2px]'>
                    <IcRoundAccountCircle className=' w-full h-full text-center text-3xl' />
                </div>
            </div>

            <div className='tool-icon-div flex justify-center space-x-4'>

                <a className='cursor-pointer w-[39px] h-10 pt-[1px]' onClick={() => {
                    popNotify(state.showE ? "Hide English" : "Show English")
                    setState({ ...state, showE: !state.showE })
                }}>
                    {!state.showE ? <BxBxsHide className='text-2xl' /> : <BxBxsShow className='text-2xl' />}
                </a>

                <a className='cursor-pointer w-10 pt-[1px]' onClick={() => {
                    popNotify(state.showC ? "Hide Chinese" : "Show Chinese")
                    setState({ ...state, showC: !state.showC })
                }}>
                    {!state.showC ? <BxBxsHide className='text-2xl' /> : <BxBxsShow className='text-2xl' />}
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
                    popNotify(state.editing ? "Select mode" : "Normal mode")
                    setState((pre: State1) => {
                        const newState = { ...pre, editing: !pre.editing }
                        return newState
                    })
                }}>
                    {state.editing ? <MaterialChecklistRtl className='text-2xl' /> : <CarbonSelectWindow className='text-2xl' />}
                </a>

                <a className='cursor-pointer w-10' onClick={() => {
                    popNotify(!state.rand ? "Random mode" : "Normal mode")
                    setState((pre: State1) => {
                        const newState = { ...pre, rand: !pre.rand }
                        setRandomTable(getRandomTable(words, newState.rand, newState))
                        updataRandomTable()
                        return newState
                    })
                }}>
                    <MdiDice5 className={` text-2xl ${state.rand ? " text-green-700" : ""}`} />
                </a>

            </div>

            <div className=' relative flex justify-center h-full w-full overflow-y-auto'>
                <div ref={scrollRef} className='jx-5 h-full max-w-[22rem] min-w-[20rem] sm:max-w-[28rem] sm:min-w-[22rem] space-y-2 overflow-x-hidden pl-1'>
                    {words.map((word, index) => (
                        <WordItem
                            key={word.id}
                            word={word}
                            index={index}
                            state={state}
                            isFocused={index === focusIndex}
                            isPlaying={index === randomTable[playPosition]}
                            onPlay={handlePlayThisWord}
                            onChange={handleWordChange}
                            onDoneToggle={handleDoneToggle}
                            onNext={() => {
                                if (index + 2 > words.length) {
                                    addNewWord()
                                }
                                setFocusIndex(-1)
                                setTimeout(() => {
                                    setFocusIndex(index + 1)
                                }, 10);
                            }}
                        />
                    ))
                    }
                    < div className='h-[30%]'>
                        {/* <textarea placeholder='Export and Import area' ref={inputBoxRef} className='h-full outline-none w-96 p-2 mt-8'></textarea> */}
                    </div>

                </div>
            </div>

            {state.cards && <CardArea state={state} handleDoneToggle={handleDoneToggle} randomTable={randomTable} progress={{ currentProgress: playPosition, setCurrentProgress: setPlayPosition }} words={words} />}

            <PlayArea state={state} randomTable={randomTable} scrollToCenter={scrollToCenter} progress={{ currentProgress: playPosition, setCurrentProgress: setPlayPosition }} currentTitle={currentTitle} words={words} />
        </div >
    )
}

export default MainBlock
