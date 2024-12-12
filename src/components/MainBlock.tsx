import React, { useEffect, useRef, useState } from 'react'

import { Link, Params, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { MaterialSymbolsQuizRounded, AntDesignSettingFilled, TablerCircleArrowUpFilled, TablerEyeClosed, IcRoundAccountCircle, MdiCardsOutline, MaterialChecklistRtl, MdiDice5, Fa6SolidFileImport, MaterialLock, MaterialLockOpen, Fa6SolidFileExport, PhSelectionBold, PhSelectionDuotone, BxBxsShow } from '../utils/Icons'
import { getRandId, copyToClipboard } from '../utils/tool';

import { useNotify } from '../context/NotifyContext'
import { useStateContext } from '../context/StateContext';
import createConfirmDialog from './ConfirmDialog';

import WordItem from './WordItem'
import PlayArea from './PlayArea'
import CardArea from './CardArea'

import CustomSelect from './Select';
import Tag from './Tag';
// import SmallCard from './SmallCard';

function FunctionMenu() {
    const { popNotify } = useNotify();
    const { setId, mode } = useParams<Params>();
    const [cardsMode, setCardsMode] = useState<boolean>(mode === "cards")

    useEffect(() => {
        setCardsMode(mode === "cards")
    }, [mode])

    return (
        <div className=' flex flex-col w-full space-y-4 p-3 '>
            <Link to={"/profile"} className='cursor-pointer' >
                <div className=' flex overflow-hidden'>
                    <IcRoundAccountCircle className={` text-2xl`} />
                    <span className=' whitespace-nowrap ml-2'>Profile</span>
                </div>
            </Link>

            <Link to={"/set/" + setId! + "/settings"} className='cursor-pointer' >
                <div className=' flex overflow-hidden'>
                    <AntDesignSettingFilled className={` text-2xl`} />
                    <span className=' whitespace-nowrap ml-2'>Settings</span>
                </div>
            </Link>

            <Link to={"/set/" + setId! + (cardsMode ? "/" : "/cards")} className='cursor-pointer' onClick={() => {
                popNotify(!cardsMode ? "Cards mode" : "Normal mode")
            }}>
                <div className=' flex overflow-hidden'>
                    <MdiCardsOutline className={` text-2xl ${cardsMode ? " text-green-700" : ""}`} />
                    <span className=' whitespace-nowrap ml-2'>Card Mode</span>
                </div>
            </Link>

            <Link to={"/quiz/" + setId!} className='cursor-pointer' onClick={() => {
                popNotify("Start quiz")
            }}>
                <div className=' flex overflow-hidden'>
                    <MaterialSymbolsQuizRounded className={` text-xl`} style={{ fontSize: "22px" }} />
                    <span className=' whitespace-nowrap ml-2'>Start quiz</span>
                </div>
            </Link>

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

    const [showAddArea, setShowAddArea] = useState<boolean>(false);
    const [newWord, setNewWords] = useState({ chinese: "", english: "" });
    const newWordChIRef = useRef<HTMLInputElement>(null)
    const newWordEnIRef = useRef<HTMLInputElement>(null)

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

    const scrollTo = (index: number, immediately: boolean = false): void => {
        scrollRef.current?.scrollTo({
            top: index * 60,
            behavior: (immediately ? 'instant' : 'smooth') as ScrollBehavior
        });
    }

    const scrollToTop = (): void => {
        scrollRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const scrollToEnd = (): void => {
        inputBoxRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
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
                "Import these words ? \nThis action will replace your current word list. \nIf you want to keep the current word list, you can import words into a new set.",
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
                },
                "Import",
                "Cancel"
            );
        }
    };

    const handleExport = () => {
        const WordsToExport = words.map(e => !e.selected ? "$^#*&" : (e.english + "\n" + e.chinese)).filter(e => e !== "$^#*&")
        if (WordsToExport.length === 0) {
            popNotify("Select words first")
            return
        }
        const ExportText = WordsToExport.join("\n")

        if (inputBoxRef.current) {
            inputBoxRef.current.value = ExportText
        }
        popNotify(WordsToExport.length + " words copied & exported")
        scrollToEnd()
        copyToClipboard(ExportText)
    };

    const handleDelete = (index: number) => {
        createConfirmDialog(
            `delete "${words.find((word, i) => i === index)?.english}" ?`,
            () => {
                const newWords = words.filter((word, i) => i !== index)
                setWords(newWords)
                updataRandomTable()
                popNotify("Words deleted");
                setTimeout(() => {
                    scrollTo(index - 1, true)
                }, 400);
            },
            () => {
                popNotify("delete canceled.");
            },
            "delete"
        );


    }


    const handleDoneToggle = (index: number, type: string = "") => {
        if (cardsMode || type == "done") {
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
        setWords(prev => [...prev, { id: getRandId(16), chinese: newWord.chinese, english: newWord.english, done: false, selected: false }]);
        setNewWords({ chinese: "", english: "" })
        setTimeout(() => {
            scrollTo(words.length - 2)
        }, 100);
        // setFocusIndex(words.length - 1)
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

    const getRandomTableToPlay = () => {
        if (randomTable.length === 0 || words.length === 0 || words.length !== randomTable.length) {
            return []
        }
        return randomTable.map((e, i) => (words[e].selected && (!words[e].done || !state.onlyPlayUnDone)) ? i : -1).filter(e => e !== -1)
    }


    useEffect(() => {
        setTimeout(() => {
            // addNewWord()
        }, 5000);

    }, [])

    return (
        <div className=' main bg-slate-25 w-full sm:h-full px-1  py-2 flex flex-col relative'>

            <div className=' ml-11 mt-[0.25rem] flex justify-between relative'>
                <div className=' min-w-[70px] flex'>
                    <div className=' w-7 h-7 mr-1' style={{
                        backgroundImage: "url(../../icon.png)",
                        backgroundPosition: "center",
                        backgroundSize: "contain"
                    }}></div>
                    < Link to="/set" className=' cursor-pointer' >
                        <span>ECTTS 2.0</span>
                    </Link>
                </div>
                <div
                    style={{
                        width: showFunctionMenu ? "140px" : "40px",
                        transition: 'width 0.3s ease-in-out',
                    }}
                    className={`z-50 flex items-end flex-col absolute right-2 top-0 rounded-md pt-2 pr-2 ${showFunctionMenu ? " bg-blue-100" : " bg-transparent"}`}>
                    <div onClick={() => setShowFunctionMenu(!showFunctionMenu)} className='  hover:bg-blue-50 w-[2.15rem] h-[2.15rem] rounded-full p-[2px]'>
                        <IcRoundAccountCircle className=' w-full h-full text-center text-3xl' />
                    </div>
                    {showFunctionMenu &&
                        // <FunctionMenu handleExport={handleExport} handleImport={handleImport} />
                        <FunctionMenu />
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


            {mode !== "settings" ?
                <div className=' relative flex justify-center h-full w-full overflow-y-auto px-1'>
                    {randomTable.length === words.length ?
                        <div ref={scrollRef}
                            style={{
                                // scrollSnapType: 'y mandatory',
                                // scrollPadding: '0px 0px',
                            }}
                            className='no-y-scrollbar h-full px-1 sm:px-2 max-w-full sm:max-w-[28rem] sm:min-w-[22rem] space-y-3 overflow-x-hidden '>
                            {randomTable.map((index, i) => {
                                const word = words[index]
                                return (<WordItem
                                    key={word.id}
                                    word={word}
                                    index={index}
                                    indexP={i}
                                    state={state}
                                    isTop={i === topIndex}
                                    isPlaying={i === playIndex}
                                    onDelete={handleDelete}
                                    onPlay={handlePlayThisWord}
                                    onChange={handleWordChange}
                                    onDoneToggle={handleDoneToggle}
                                    onNext={() => {
                                        setShowAddArea(true)
                                    }}
                                />)
                            })
                            }
                            < div className=' h-[100%] relative pb-24'>
                                <textarea placeholder='Export and Import area' ref={inputBoxRef} className='h-full outline-none w-full p-2 mt-8 rounded-md '></textarea>
                                <button onClick={() => scrollToTop()} className=' absolute right-2 bottom-20 inline' ><TablerCircleArrowUpFilled className='text-5xl' /></button>
                                <div className=' space-x-4 flex h-24'>
                                    <a className='cursor-pointer inline rounded-md h-fit bg-blue-100 px-4 p-1 ' onClick={handleImport}>
                                        <div className=' flex overflow-hidden'>
                                            <Fa6SolidFileImport className=' text-xl mr-[0.2rem] mt-[0.1rem]  text-red-800' />
                                            <span className=' whitespace-nowrap ml-[0.6rem]'>Import</span>
                                        </div>
                                    </a>

                                    <a className='cursor-pointer inline rounded-md h-fit bg-blue-100 px-4 p-1' onClick={handleExport}>
                                        <div className=' flex overflow-hidden'>
                                            <Fa6SolidFileExport className='text-xl ml-[0.2rem] pt-[0.2rem]' />
                                            <span className=' whitespace-nowrap ml-2'>Export</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div> :
                        null
                    }
                </div> :
                <SettingArea />
            }
            {
                showAddArea && <div className=' fixed left-0 right-0 flex justify-center top-20 '>
                    <div className=' space-y-2 w-[min(90%,36rem)] flex flex-col justify-center px-3 py-4 rounded-md z-60 bg-purple-100 absolute'>
                        <input className='jx-1 bg-purple-50 w-full rounded-md' ref={newWordEnIRef} value={newWord.english} type="text"
                            onChange={(e) => {
                                setNewWords({ ...newWord, english: e.target.value })
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'Tab') {
                                    newWordChIRef.current?.focus()
                                }
                            }}></input>

                        <input className='jx-1 bg-purple-50 w-full rounded-md' ref={newWordChIRef} value={newWord.chinese} type="text"
                            onChange={(e) => {
                                setNewWords({ ...newWord, chinese: e.target.value })
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'Tab') {
                                    newWordEnIRef.current?.focus()
                                    popNotify(`'${newWord.english}' added`)
                                    addNewWord()
                                }
                            }}></input>
                        <div onClick={() => setShowAddArea(false)} className=' cursor-pointer w-6 h-6 bg-purple-400 absolute right-2 top-0 rounded-md text-center'>✕</div>
                    </div>
                </div>
            }

            {cardsMode && <CardArea state={state} handleDoneToggle={handleDoneToggle} randomTableToPlay={getRandomTableToPlay()} randomTable={randomTable} progress={{ playIndex: playIndex, setPlayIndex: setPlayIndex }} words={words} />}

            <PlayArea scrollTo={scrollTo} randomTableToPlay={getRandomTableToPlay()} randomTable={randomTable} progress={{ playIndex: playIndex, setPlayIndex: setPlayIndex }} currentTitle={currentTitle} words={words} />
        </div >
    )
}

export default MainBlock



function SettingArea() {
    const { setId } = useParams<Params>();
    const { popNotify } = useNotify();
    const [setData, setSetData] = useState<{ tags?: string[], title?: string, id?: string }>({})
    const { allSet, setAllSet, allSetMap, setAllSetMap } = useStateContext()

    useEffect(() => {
        const thisSet = allSet.find(e => e.id === setId)
        if (!thisSet && allSet.length > 0) {
            popNotify("Set not found")
        }
        setSetData(thisSet!)
    }, [allSet])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            popNotify("Update successful")
            setAllSet(allSet.map((e: Aset) => e.id !== setId ? e : { ...e, ...setData }))
        }
    };

    const handleAddTag = (tag: string) => {
        if ((setData.tags || []).includes(tag)) {
            return
        }
        setSetData((prev: any) => {
            const newData = { ...prev, tags: [...(prev.tags || []), tag] }
            popNotify("Update successful")
            setAllSet(allSet.map((e: Aset) => e.id !== setId ? e : { ...e, ...newData }))
            return newData
        })
    };

    const handleDelete = (tag: string) => {
        setSetData((prev: any) => {
            const newData = {
                ...prev, tags: (prev.tags || []).filter((e: String) => e !== tag)
            }
            popNotify("Update successful")
            setAllSet(allSet.map((e: Aset) => e.id !== setId ? e : { ...e, ...newData }))
            return newData
        })
    }

    if (!setData) {
        return null
    }

    return (
        <div className='flex flex-col items-center mt-1 space-y-4 max-h-[80vh] overflow-y-auto pb-36 '>
            <h1 className=' text-xl'>settings</h1>
            <hr className='black w-[80%]' />
            <div className=' flex space-x-2'>
                <p>title：</p>
                <input onBlur={() => setAllSet(allSet.map((e: Aset) => e.id !== setId ? e : { ...e, ...setData }))} onKeyDown={handleKeyDown} onChange={(e) => setSetData({ ...setData, title: e.target.value })} defaultValue={setData.title} type="text" className=' rounded-none bg-transparent border-b-[2px] outline-none border-blue-700' />
            </div>
            <div className=' flex space-x-2 max-w-[80%] !-mb-4'>
                <p className=' pt-3'>tags：</p>
                <div className=' w-full overflow-x-auto flex h-13 py-3 space-x-2'>
                    {setData.tags && setData.tags.length > 0 &&
                        setData.tags.map((e: string) => (
                            <Tag handleDelete={handleDelete} key={e + getRandId(2)}>{e}</Tag>
                        ))
                    }
                </div>
            </div>
            <CustomSelect
                options={Object.keys(allSetMap)}
                placeholder="Select a tag or type your own..."
                onChange={handleAddTag}
                initialValue=""
            />
            <Link className=' border-2 border-blue-700 rounded-full px-4 text-lg ' to={`/set/${setId}`}>Go back to words list</Link>
        </div>
    )
}
