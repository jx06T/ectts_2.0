import React, { useCallback, useEffect, useRef, useState } from 'react'
import WordItem from './WordItem'
import { MdiDice5, Fa6SolidFileImport, MaterialDeleteRounded, MaterialLock, MaterialLockOpen, MaterialFileMove, Fa6SolidFileExport, PhSelectionBold, PhSelectionDuotone, PhSelectionInverseDuotone, BxBxsHide, BxBxsShow, MaterialSymbolsEditRounded } from '../utils/Icons'
import PlayArea from './PlayArea'
import { useNotify } from './NotifyContext'

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
    const [state, setState] = useState<State1>({ showE: true, showC: true, editing: false, selection: 0, lock: false, rand: false });
    const [focusIndex, setFocusIndex] = useState<number>(0);
    const [playPosition, setPlayPosition] = useState<number>(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputBoxRef = useRef<HTMLTextAreaElement>(null);
    const { notify, popNotify } = useNotify();

    const [randNext, setRandNext] = useState<number[] | null>(null)

    useEffect(() => {
        const Words0 = localStorage.getItem(setId);
        if (Words0) {
            setWords(JSON.parse(Words0));
        }

        const AllSet0 = localStorage.getItem("all-set");
        if (AllSet0) {
            const AllSet = JSON.parse(AllSet0)
            if (AllSet.length > 0) {
                if (!Words0) {
                    window.location.href = "/" + AllSet[0].id
                } else {
                    setCurrentTitle(AllSet.find((e: Aset) => e.id === currentPath).title)
                }
            }
        } else {
            window.location.href = ""
        }

    }, [])

    useEffect(() => {
        if (words.length == 0) {
            return
        }
        localStorage.setItem(setId, JSON.stringify(words))
    }, [words])


    const getRandomTable = (words: Word[], r: boolean): number[] | null => {
        if (!r) {
            return null
        }
        const arr: number[] = words.map((word, i) => (state.editing ? word.selected : !word.done) ? i : -1).filter(e => e !== -1)

        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr
    }


    const scrollToCenter = (index: number): void => {
        // alert(window.innerHeight)
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                // top: index * 52 - 220 + window.innerHeight / 2,
                top: index * 52 - 300 + (0.5 * (900 - window.innerHeight)),
                behavior: 'smooth'
            });
        }, 10);
    }

    const handleWordChange = (index: number, field: 'english' | 'chinese', value: string) => {
        setWords(prev => prev.map((word, i) =>
            i === index ? { ...word, [field]: value } : word
        ));
    };

    const handleMove = () => {

    };

    const handleDelete = () => {
        if (!state.editing) {
            popNotify('Select words first')
            return
        }
        const originalLength = words.length
        setWords(prev => {
            const newWords = prev.filter((word, i) => !word.selected)
            popNotify(`${originalLength - newWords.length} words deleted`)
            if (newWords.length === 0) {
                newWords.push({ id: getRandId(), chinese: "", english: "" })
            }
            return newWords
        });
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
                popNotify("Please fill in the word list below first")
                return
            }
            const lines = inputBoxRef.current.value.split("\n")
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

            setWords(result)
        }
    };

    const handleExport = () => {
        const WordsExport = words.map(e => state.editing && !e.selected ? "" : (e.english + "\n" + e.chinese)).join("\n")

        if (inputBoxRef.current) {
            inputBoxRef.current.value = WordsExport
        }
        popNotify("All word copied")
        copyToClipboard(WordsExport)
    };

    const handleDoneToggle = (index: number) => {
        setState({ ...state, selection: 0 })
        if (!state.editing) {
            setWords(prev => {
                const newEords = prev.map((word, i) => i === index ? { ...word, done: !word.done } : word)
                popNotify(newEords.filter(word => word.done).length + " words done")
                return newEords
            });
        } else {
            setWords(prev => {
                const newEords = prev.map((word, i) => i === index ? { ...word, selected: !word.selected } : word)
                popNotify(newEords.filter(word => word.selected).length + " words selected")
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
        setPlayPosition(index)
    }

    useEffect(() => {
        setRandNext(getRandomTable(words, state.rand))
    }, [words])

    return (
        <div className=' main bg-slate-25 w-full sm:h-full p-2 px-3 flex flex-col '>
            <div className='flex'>
                <h1 className='ml-9 m-1 mt-[3px] min-w-[70px] -mr-6'>ECTTS 2.0</h1>
                <div className='flex flex-grow justify-center fixed right-[5%] mdlg:right-[12%] lg:right-[24%] ' >
                    <h1 className={` ${notify === "" ? " opacity-0" : " opacity-100"} bg-stone-700 rounded-full px-4 text-white max-w-80 w-full ml-9 m-1 mt-[3px] transition-opacity duration-300 z-10`}>{notify}</h1>
                </div>
            </div>
            <div className=' flex justify-center -mb-1 pr-0 xs:pr-4 space-x-1 mt-2'>
                <a className='cursor-pointer w-10 h-10' onClick={() => {
                    popNotify(state.showE ? "Hide English" : "Show English")
                    setState({ ...state, showE: !state.showE })
                }}>
                    {!state.showE ? <BxBxsHide className='text-2xl' /> : <BxBxsShow className='text-2xl' />}
                </a>
                <a className='cursor-pointer w-10 h-10' onClick={() => {
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
                    popNotify(state.editing ? "Edit mode ends" : "Edit mode enabled")
                    setState({ ...state, editing: !state.editing })
                }}>
                    <MaterialSymbolsEditRounded className='text-2xl' />
                </a>
                {/* <a className='cursor-pointer w-10 h-10' onClick={handleMove}>
                    <MaterialFileMove className=' text-2xl ' />
                    </a> */}
                <a className='cursor-pointer w-10 h-10' onClick={handleDelete}>
                    <MaterialDeleteRounded className=' text-2xl text-red-800' />
                </a>
                <a className='cursor-pointer w-10 h-10' onClick={handleReverseSelection}>
                    <PhSelectionInverseDuotone className='text-2xl' />
                </a>
                <a className='cursor-pointer w-10 h-10' onClick={handleSelectAll}>
                    {state.selection == 1 ? <PhSelectionBold className='text-2xl' /> : <PhSelectionDuotone className='text-2xl' />}
                </a>
                <a className='cursor-pointer w-10 h-10' onClick={() => {
                    console.log("SS",getRandomTable(words, !state.rand))
                    setRandNext(getRandomTable(words, !state.rand))
                    setState({ ...state, rand: !state.rand })
                }}>
                    <MdiDice5 className={` text-2xl ${state.rand ? " text-green-700" : ""}`} />
                </a>
                <a className='cursor-pointer w-10 h-10' onClick={handleImport}>
                    <Fa6SolidFileImport className=' text-xl mt-[2px]  text-red-800' />
                </a>
                <a className='w-10 h-10 pt-[2px]' onClick={handleExport}>
                    <Fa6SolidFileExport className='text-xl' />
                </a>
            </div>

            <div ref={scrollRef} className='flex justify-center h-full w-full overflow-y-auto'>
                <div className='h-full max-w-[22rem] sm:max-w-[64rem] min-w-[20rem] space-y-2 overflow-x-hidden pl-1'>
                    {words.map((word, index) => (
                        <WordItem
                            key={word.id}
                            word={word}
                            index={index}
                            state={state}
                            isFocused={index === focusIndex}
                            isPlaying={index === playPosition}
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
                        <textarea ref={inputBoxRef} className='h-full outline-none w-96 p-2 mt-8'></textarea>
                    </div>
                </div>
            </div>

            <PlayArea rand={randNext} scrollToCenter={scrollToCenter} progress={{ currentProgress: playPosition, setCurrentProgress: setPlayPosition }} currentTitle={currentTitle} words={words.map(word => ({ ...word, needToPlay: (state.editing ? word.selected : !word.done) }))} />
        </div >
    )
}

export default MainBlock