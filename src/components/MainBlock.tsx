import React, { useCallback, useEffect, useRef, useState } from 'react'
import WordItem from './WordItem'
import { IcRoundMenuOpenL, IcRoundMenuOpenR, MdiCardsOutline, MaterialChecklistRtl, CarbonSelectWindow, MdiDice5, Fa6SolidFileImport, MaterialDeleteRounded, MaterialLock, MaterialLockOpen, MaterialFileMove, Fa6SolidFileExport, PhSelectionBold, PhSelectionDuotone, PhSelectionInverseDuotone, BxBxsHide, BxBxsShow, MaterialSymbolsEditRounded } from '../utils/Icons'
import PlayArea from './PlayArea'
import { useNotify } from './NotifyContext'
import createConfirmDialog from './ConfirmDialog';
import CardArea from './CardArea'

function getRandId(length = 16) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = chars.length;
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


function copyToClipboard(text: string): Promise<void> {
    // 檢查是否支持新的異步剪貼板 API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).then(() => {
            console.log('Text copied to clipboard using Clipboard API');
        }).catch(err => {
            console.warn('Failed to copy text: ', err);
            return fallbackCopyTextToClipboard(text);
        });
    } else {
        return fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;

        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                console.log('Fallback: Copying text command was successful');
                resolve();
            } else {
                console.error('Fallback: Unable to copy');
                reject(new Error('Fallback: Unable to copy'));
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            reject(err);
        }

        document.body.removeChild(textArea);
    });
}

function MainBlock() {
    const currentPath = window.location.pathname.slice(1);
    const setId = "set-" + currentPath

    const [currentTitle, setCurrentTitle] = useState<string>("");
    const [words, setWords] = useState<Word[]>([]);
    const [state, setState] = useState<State1>({ showE: true, showC: true, editing: false, selection: 0, lock: false, rand: false, cards: false, deleting: false, init: true });
    const [focusIndex, setFocusIndex] = useState<number>(0);
    const [playPosition, setPlayPosition] = useState<number>(0);
    const [showRight, setShowRight] = useState<boolean>(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputBoxRef = useRef<HTMLTextAreaElement>(null);
    const { notify, popNotify } = useNotify();

    // const [randomTable, setRandomTable] = useState<number[] | null>(null)
    const [randomTable, setRandomTable] = useState<number[]>([])

    useEffect(() => {
        const Words0 = localStorage.getItem(setId);
        if (Words0) {
            setWords(JSON.parse(Words0));
        }

        const AllSet0 = localStorage.getItem("all-set");
        if (AllSet0) {
            const AllSet = JSON.parse(AllSet0)
            if (currentPath !== "") {
                if (AllSet.length > 0) {
                    if (!Words0) {
                        window.location.href = "/" + AllSet[0].id
                    } else {
                        setCurrentTitle(AllSet.find((e: Aset) => e.id === currentPath).title)
                    }
                } else {
                    window.location.href = "/"
                }
            }
        } else {
            window.location.href = "/"
        }

    }, [])

    useEffect(() => {
        if (words.length == 0) {
            return
        }
        localStorage.setItem(setId, JSON.stringify(words))
    }, [words])

    useEffect(() => {
        const state0 = localStorage.getItem("ectts-state");
        if (state0) {
            setState({ ...JSON.parse(state0), deleting: false });
        } else {
            setState({ ...state, init: false });
        }

    }, [])

    useEffect(() => {
        if (state.init) {
            return
        }
        localStorage.setItem("ectts-state", JSON.stringify(state))
    }, [state])


    const getRandomTable = (words: Word[], r: boolean): number[] => {

        const arr: number[] = words.map((word, i) => (state.editing ? word.selected : !word.done) ? i : -1).filter(e => e !== -1)
        if (!r) {
            return arr
        }

        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
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

    const handleMove = () => {

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
                                id: getRandId(),
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

    const handleDoneToggle = (index: number, newValue: boolean | null = null) => {
        if (state.cards) {
            setWords(prev => {
                const newEords = prev.map((word, i) => i === index ? { ...word, done: newValue as boolean } : word)
                popNotify(`${newEords.filter(word => word.done).length}／${words.length} words selected`)
                if (playPosition > index) {
                    setPlayPosition(playPosition + (newEords[index].done ? 1 : -1))
                }
                return newEords
            });

            return
        }

        if (state.deleting) {
            setWords(prev => prev.filter((e, i) => i !== index))
            return
        }
        setState({ ...state, selection: 0 })
        if (!state.editing) {
            setWords(prev => {
                const newEords = prev.map((word, i) => i === index ? { ...word, done: !word.done } : word)
                popNotify(`${newEords.filter(word => word.done).length}／${words.length} words done`)
                if (playPosition > index) {
                    setPlayPosition(playPosition + (newEords[index].done ? -1 : 1))
                }
                return newEords
            });
        } else {
            setWords(prev => {
                const newEords = prev.map((word, i) => i === index ? { ...word, selected: !word.selected } : word)
                popNotify(`${newEords.filter(word => word.selected).length}／${words.length} words selected`)
                if (playPosition > index) {
                    setPlayPosition(playPosition + (newEords[index].selected ? 1 : -1))
                }
                return newEords
            });
        }
    };

    const addNewWord = () => {
        setWords(prev => [...prev, { id: getRandId(), chinese: "", english: "" }]);
        setFocusIndex(words.length);
        scrollToCenter(words.length)
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
        setRandomTable(getRandomTable(words, state.rand))
    }, [words])

    return (
        <div className=' main bg-slate-25 w-full sm:h-full px-1 sm:px-3 py-2 flex flex-col '>
            <div className='flex'>
                <h1 className='ml-9 m-1 mt-[3px] min-w-[70px] -mr-6'>ECTTS 2.0</h1>
                <div className='flex flex-grow justify-center fixed right-[5%] mdlg:right-[12%] lg:right-[24%] z-40' >
                    <h1 className={` ${notify === "" ? " opacity-0" : " opacity-100"} bg-stone-700 rounded-full px-4 text-white max-w-80 w-full ml-9 m-1 mt-[3px] transition-opacity duration-300 z-10`}>{notify}</h1>
                </div>
            </div>
            <div className=' flex justify-center -mb-2 sm:-mb-1 mt-1'>
                <div className=' flex justify-between w-80'>
                    {!showRight && <div className='flex justify-center'>
                        <a className='cursor-pointer w-[39px] h-10 pt-[1px]' onClick={() => {
                            popNotify(state.showE ? "Hide English" : "Show English")
                            setState({ ...state, showE: !state.showE })
                        }}>
                            {!state.showE ? <BxBxsHide className='text-2xl' /> : <BxBxsShow className='text-2xl' />}
                        </a>
                        <a className='cursor-pointer w-10 h-10 pt-[1px]' onClick={() => {
                            popNotify(state.showC ? "Hide Chinese" : "Show Chinese")
                            setState({ ...state, showC: !state.showC })
                        }}>
                            {!state.showC ? <BxBxsHide className='text-2xl' /> : <BxBxsShow className='text-2xl' />}
                        </a>
                        <a className='cursor-pointer w-10 h-10' onClick={() => {
                            popNotify(state.lock ? "Unlocked" : "locked")
                            setState({ ...state, lock: !state.lock })
                        }}>
                            {!state.lock ? <MaterialLockOpen className='text-2xl' /> : <MaterialLock className='text-2xl' />}
                        </a>
                        <a className='cursor-pointer w-10 h-10' onClick={() => {
                            popNotify(state.editing ? "Select mode" : "Normal mode")
                            setState({ ...state, editing: !state.editing })
                        }}>
                            {state.editing ? <MaterialChecklistRtl className='text-2xl' /> : <CarbonSelectWindow className='text-2xl' />}
                        </a>
                        <a className='cursor-pointer w-10 h-10' onClick={() => {
                            popNotify(!state.rand ? "Random mode" : "Normal mode")
                            setRandomTable(getRandomTable(words, !state.rand))
                            setState({ ...state, rand: !state.rand })
                        }}>
                            <MdiDice5 className={` text-2xl ${state.rand ? " text-green-700" : ""}`} />
                        </a>
                        <a className='cursor-pointer w-10 h-10' onClick={() => {
                            popNotify(!state.cards ? "Cards mode" : "Normal mode")
                            setPlayPosition(0)
                            setState({ ...state, cards: !state.cards })
                        }}>
                            <MdiCardsOutline className={` text-2xl ${state.cards ? " text-purple-700" : ""}`} />
                        </a>
                    </div>}
                    {showRight && <div className='flex justify-center'>
                        <a className='cursor-pointer w-10 h-10' onClick={() => {
                            popNotify('Click the right box to delete')
                            setState({ ...state, deleting: !state.deleting })
                        }}>
                            <MaterialSymbolsEditRounded className={` text-2xl ${state.deleting ? "text-red-800" : ""}`} />
                        </a>
                        <a className='cursor-pointer w-10 h-10' onClick={handleReverseSelection}>
                            <PhSelectionInverseDuotone className='text-2xl' />
                        </a>
                        <a className='cursor-pointer w-10 h-10' onClick={handleSelectAll}>
                            {state.selection == 1 ? <PhSelectionBold className='text-2xl' /> : <PhSelectionDuotone className='text-2xl' />}
                        </a>

                        <a className='cursor-pointer w-10 h-10' onClick={handleImport}>
                            <Fa6SolidFileImport className=' text-xl mt-[2px]  text-red-800' />
                        </a>
                        <a className='w-10 h-10 pt-[2px]' onClick={handleExport}>
                            <Fa6SolidFileExport className='text-xl' />
                        </a>
                    </div>}
                    <a className='cursor-pointer w-10 h-10' onClick={() => {
                        setShowRight(!showRight)
                    }}>
                        {showRight ?
                            <IcRoundMenuOpenL className={` text-2xl`} />
                            :
                            <IcRoundMenuOpenR className={` text-2xl`} />
                        }
                    </a>
                </div>
            </div>

            <div className=' relative flex justify-center h-full w-full overflow-y-auto'>
                <div ref={scrollRef} className='jx-5 h-full max-w-[22rem] sm:max-w-[64rem] min-w-[20rem] space-y-2 overflow-x-hidden pl-1'>
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
                    ))}
                    <div className='h-[50%]'>
                        <textarea placeholder='Export and Import area' ref={inputBoxRef} className='h-full outline-none w-96 p-2 mt-8'></textarea>
                    </div>
                </div>
                {state.cards && <CardArea handleDoneToggle={handleDoneToggle} randomTable={randomTable} progress={{ currentProgress: playPosition, setCurrentProgress: setPlayPosition }} words={words} />}
            </div>
            <PlayArea randomTable={randomTable} scrollToCenter={scrollToCenter} progress={{ currentProgress: playPosition, setCurrentProgress: setPlayPosition }} currentTitle={currentTitle} words={words} />
        </div >
    )
}

export default MainBlock