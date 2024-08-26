import React, { useRef, useState } from 'react'
import WordItem from './WordItem'
import { MaterialDeleteRounded, MaterialLock, MaterialLockOpen, MaterialFileMove, Fa6SolidFileExport, PhSelectionBold, PhSelectionDuotone, PhSelectionInverseDuotone, BxBxsHide, BxBxsShow, MaterialSymbolsEditRounded } from '../utils/Icons'
import PlayArea from './PlayArea'
import { useNotify } from './NotifyContext'

const initialWords: Word[] = [
    { id: "affw434384wafws", chinese: "蘋果", english: "apple", done: true },
    { id: "bghj67890jklmn", chinese: "香蕉", english: "banana" },
    { id: "cvbn123456opqrs", chinese: "橘子", english: "orange" },
    { id: "dfgh456789rtyui", chinese: "葡萄", english: "grape" },
    { id: "ertyu098765vbnm", chinese: "西瓜", english: "watermelon" },
    { id: "yuiop456789asdf", chinese: "草莓", english: "strawberry" },
    { id: "ghjk098765rtyui", chinese: "桃子", english: "peach" },
    { id: "zxcvbnm456789qwe", chinese: "梨子", english: "pear" },
    { id: "asd123456tyuiop", chinese: "檸檬", english: "lemon" },
    { id: "qwe456789rtyuio", chinese: "櫻桃", english: "cherry" },
    { id: "hjkl098765ertyui", chinese: "電腦", english: "computer" },
    { id: "mnbv456789asdcxz", chinese: "手機", english: "phone" },
    { id: "rewq098765mnbvcx", chinese: "書籍", english: "book" },
    { id: "plmn456789qwerty", chinese: "桌子", english: "table" },
]

function getRandId() {
    return Math.random().toString(36).substring(2.9) + Math.random().toString(36).substring(2.9)
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
    const [words, setWords] = useState<Word[]>(initialWords);
    const [state, setState] = useState<State1>({ showE: true, showC: true, editing: false, selection: 0, lock: true });
    const [focusIndex, setFocusIndex] = useState<number>(0);
    // const [notify, setnotify] = useState<string>("");
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const { notify, popNotify } = useNotify();

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

    const handleExport = () => {
        const WordsExport = words.map(e => e.english + "\n" + e.chinese).join("\n")
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
    };

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
                <a className='cursor-pointer w-10 h-10' onClick={handleMove}>
                    <MaterialFileMove className=' text-2xl ' />
                </a>
                <a className='cursor-pointer w-10 h-10' onClick={handleDelete}>
                    <MaterialDeleteRounded className=' text-2xl ' />
                </a>
                <a className='cursor-pointer w-10 h-10' onClick={handleReverseSelection}>
                    <PhSelectionInverseDuotone className='text-2xl' />
                </a>
                <a className='cursor-pointer w-10 h-10' onClick={handleSelectAll}>
                    {state.selection == 1 ? <PhSelectionBold className='text-2xl' /> : <PhSelectionDuotone className='text-2xl' />}
                </a>
                <a className='w-10 h-10 pt-[2px]' onClick={handleExport}>
                    <Fa6SolidFileExport className='text-xl' />
                </a>
            </div>

            <div className='flex justify-center h-full w-full overflow-y-auto'>
                <div className='h-full max-w-[22rem] sm:max-w-[64rem] min-w-[20rem] space-y-2'>
                    {words.map((word, index) => (
                        <WordItem
                            key={word.id}
                            word={word}
                            index={index}
                            state={state}
                            isFocused={index === focusIndex}
                            onChange={handleWordChange}
                            onDoneToggle={handleDoneToggle}
                            onNext={() => {
                                if (index + 2 > words.length) {
                                    addNewWord()
                                }
                                setFocusIndex(index + 1)
                            }}
                        />
                    ))}
                </div>
            </div>

            <PlayArea />
        </div >
    )
}

export default MainBlock