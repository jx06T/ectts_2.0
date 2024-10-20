import React, { useEffect, useRef, useState } from 'react'

import { Link, Params, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AntDesignSettingFilled, TablerCircleArrowUpFilled, TablerEyeClosed, IcRoundAccountCircle, MdiCardsOutline, MaterialChecklistRtl, MdiDice5, Fa6SolidFileImport, MaterialLock, MaterialLockOpen, Fa6SolidFileExport, PhSelectionBold, PhSelectionDuotone, BxBxsShow } from '../utils/Icons'
import { getRandId, copyToClipboard } from '../utils/tool';

import { useNotify } from '../context/NotifyContext'
import { useStateContext } from '../context/StateContext';
import createConfirmDialog from './ConfirmDialog';

import WordItem from './WordItem'
import PlayArea from './PlayArea'
import CardArea from './CardArea'
// import SmallCard from './SmallCard';

function FunctionMenu({ handleImport, handleExport }: { handleExport: React.MouseEventHandler, handleImport: React.MouseEventHandler }) {
    const { popNotify } = useNotify();
    const { setId, mode } = useParams<Params>();
    const [cardsMode, setCardsMode] = useState<boolean>(mode === "cards")

    useEffect(() => {
        setCardsMode(mode === "cards")
    }, [mode])

    return (
        <div className=' flex flex-col w-full space-y-4 p-3 '>
            <Link to={"/" + setId! + "/settings"} className='cursor-pointer' onClick={() => {
                popNotify("Coming soon")
            }}>
                <div className=' flex overflow-hidden'>
                    <AntDesignSettingFilled className={` text-2xl`} />
                    <span className=' whitespace-nowrap ml-2'>Settings</span>
                </div>
            </Link>

            <Link to={"/" + setId! + (cardsMode ? "/" : "/cards")} className='cursor-pointer' onClick={() => {
                popNotify(!cardsMode ? "Cards mode" : "Normal mode")
            }}>
                <div className=' flex overflow-hidden'>
                    <MdiCardsOutline className={` text-2xl ${cardsMode ? " text-green-700" : ""}`} />
                    <span className=' whitespace-nowrap ml-2'>Card Mode</span>
                </div>
            </Link>

            <a className='cursor-pointer' onClick={handleImport}>
                <div className=' flex overflow-hidden'>
                    <Fa6SolidFileImport className=' text-xl mr-[0.2rem] mt-[0.1rem]  text-red-800' />
                    <span className=' whitespace-nowrap ml-[0.6rem]'>Import</span>
                </div>
            </a>

            <a className='cursor-pointer pt-[2px]' onClick={handleExport}>
                <div className=' flex overflow-hidden'>
                    <Fa6SolidFileExport className='text-xl ml-[0.2rem]' />
                    <span className=' whitespace-nowrap ml-2'>Export</span>
                </div>
            </a>

        </div>

    )
}

function MainBlock() {
    const { setId, mode } = useParams<Params>();
    const [cardsMode, setCardsMode] = useState<boolean>(mode === "cards")

    useEffect(() => {
        setCardsMode(mode === "cards")
        setShowFunctionMenu(false)
    }, [mode])

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
    const { popNotify } = useNotify();

    const [showFunctionMenu, setShowFunctionMenu] = useState<boolean>(false)

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
            return
        }

        toObserve.forEach((h) => observerRef.current!.observe(h));

        return () => {
            observerRef.current!.disconnect();
            observerRef.current = null
        };
    };

    const getRootMargin = () => {
        const top = 110;
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
                top: index * 52 - (0.5 * (900 - window.innerHeight)) + 120,
                behavior: 'smooth'
            });
        }, 100);
    }

    const handleWordChange = (index: number, field: 'english' | 'chinese', value: string) => {
        setWords(prev => prev.map((word, i) =>
            i === index ? { ...word, [field]: value } : word
        ));
    };

    const handleSelectAll = () => {
        const t = state.selection !== 1
        popNotify(t ? 'All selected' : 'None selected')
        setState({ ...state, selection: state.selection === 1 ? -1 : 1 })
        setWords(prev => prev.map((word, i) => ({ ...word, selected: t })));
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
        const WordsToExport = words.map(e => !e.selected ? "$^#*&" : (e.english + "\n" + e.chinese)).filter(e => e !== "$^#*&")
        const ExportText = WordsToExport.join("\n")

        if (inputBoxRef.current) {
            inputBoxRef.current.value = ExportText
        }
        popNotify(WordsToExport.length + " words copied & exported")
        copyToClipboard(ExportText)
    };

    const handleDelete = (index: number) => {
        const newWords = words.filter((word, i) => i !== index)
        setWords(newWords)
        updataRandomTable()
    }


    const handleDoneToggle = (index: number) => {
        if (cardsMode) {
            setWords(prev => {
                const newWords = prev.map((word, i) => i === index ? { ...word, done: !word.done } : word)
                popNotify(`${newWords.filter(word => word.done).length}／${words.length} words done`)
                return newWords
            });

            return
        }

        setState({ ...state, selection: 0 })

        const newWords = words.map((word, i) => i === index ? { ...word, selected: !word.selected } : word)
        setWords(newWords)
        popNotify(`${newWords.filter(word => word.selected).length}／${newWords.length} words selected`)
    };

    const addNewWord = () => {
        setWords(prev => [...prev, { id: getRandId(16), chinese: "", english: "", done: false, selected: false }]);
        setFocusIndex(words.length);
        scrollToTop(words.length)
        updataRandomTable()
    };

    const handlePlayThisWord = (index: number) => {
        setTimeout(() => {
            setPlayIndex(index)
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
        setRandomTable(arr)
    }

    return (
        <div className=' main bg-slate-25 w-full sm:h-full px-1  py-2 flex flex-col relative'>

            <div className='flex justify-between relative'>
                <Link to="/" className=' cursor-pointer ml-11 m-1 mt-[3px] min-w-[70px]'>ECTTS 2.0</Link>
                <div
                    style={{
                        width: showFunctionMenu ? "140px" : "40px",
                        transition: 'width 0.3s ease-in-out',
                    }}
                    className={`z-50 flex items-end flex-col absolute right-2 top-0 rounded-md pt-2 pr-2 ${showFunctionMenu ? " bg-purple-200" : " bg-transparent"}`}>
                    <div onClick={() => setShowFunctionMenu(!showFunctionMenu)} className='  hover:bg-purple-300 w-[2.15rem] h-[2.15rem] rounded-full p-[2px]'>
                        <IcRoundAccountCircle className=' w-full h-full text-center text-3xl' />
                    </div>
                    {showFunctionMenu &&
                        <FunctionMenu handleExport={handleExport} handleImport={handleImport} />
                    }
                </div>
            </div>

            <div className='tool-icon-div flex justify-start xs:justify-center space-x-3 ml-2'>

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
                    if (state.rand) {
                        resetRandomTable()
                    } else {
                        const arr: number[] = getRandomTable(words.length)
                        setRandomTable(arr)
                    }

                    setState({ ...state, rand: !state.rand })
                }}>
                    <MdiDice5 className={` text-2xl ${state.rand ? " text-green-700" : ""}`} />
                </a>

                <a className='cursor-pointer w-10' onClick={() => {
                    popNotify(!state.onlyPlayUnDone ? "Only play undone" : "Normal mode")
                    setState({ ...state, onlyPlayUnDone: !state.onlyPlayUnDone })
                }}>
                    <MaterialChecklistRtl className={` text-2xl ${state.onlyPlayUnDone ? " text-green-700" : ""}`} />
                </a>

            </div>

            <div className=' relative flex justify-center h-full w-full overflow-y-auto px-1'>
                {randomTable.length === words.length ?
                    <div ref={scrollRef}
                        style={{
                            // scrollSnapType: 'y mandatory',
                            // scrollPadding: '0px 0px',
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
                                isPlaying={i === playIndex}
                                onDelete={handleDelete}
                                onPlay={handlePlayThisWord}
                                onChange={handleWordChange}
                                onDoneToggle={handleDoneToggle}
                                onNext={() => {
                                    if (i + 2 > words.length) {
                                        addNewWord()
                                    }
                                    setFocusIndex(i + 1)
                                }}
                            />)
                        })
                        }

                        < div className='h-[90%] relative'>
                            <textarea placeholder='Export and Import area' ref={inputBoxRef} className='h-full outline-none w-full p-2 mt-8'></textarea>
                            <button onClick={() => scrollToTop(0)} className=' absolute right-2 bottom-20' ><TablerCircleArrowUpFilled className='text-5xl' /></button>
                        </div>
                    </div> :
                    null
                }
            </div>

            {cardsMode && <CardArea state={state} handleDoneToggle={handleDoneToggle} randomTable={randomTable} progress={{ playIndex: playIndex, setPlayIndex: setPlayIndex }} words={words} />}

            <PlayArea scrollToTop={scrollToTop} onlyPlayUnDone={state.onlyPlayUnDone} randomTable={randomTable} progress={{ playIndex: playIndex, setPlayIndex: setPlayIndex }} currentTitle={currentTitle} words={words} />
        </div >
    )
}

export default MainBlock
