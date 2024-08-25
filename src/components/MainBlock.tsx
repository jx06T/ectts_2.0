import React, { useState } from 'react'
import WordItem from './WordItem'
import { MaterialFileMove, Fa6SolidFileExport, PhSelectionBold, PhSelectionDuotone, PhSelectionInverseDuotone, BxBxsHide, BxBxsShow, MaterialSymbolsEditRounded } from '../utils/Icons'

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

function MainBlock() {
    const [words, setWords] = useState<Word[]>(initialWords);
    const [state, setState] = useState<State1>({ showE: true, showC: true, Editing: false, selection: 0 });
    const [focusIndex, setFocusIndex] = useState(0);

    const handleWordChange = (index: number, field: 'english' | 'chinese', value: string) => {
        setWords(prev => prev.map((word, i) =>
            i === index ? { ...word, [field]: value } : word
        ));
    };

    const handleReverseSelection = () => {
        setState({ ...state, selection: 0 })
        setWords(prev => prev.map((word, i) => ({ ...word, done: !word.done })));
    };

    const handleSelectAll = () => {
        const t = state.selection !== 1
        setState({ ...state, selection: state.selection === 1 ? -1 : 1 })
        setWords(prev => prev.map((word, i) => ({ ...word, done: t })));
    };

    const handleMove = () => {
        
    };

    const handleExport = () => {
        
    };

    const handleDoneToggle = (index: number) => {
        setState({ ...state, selection: 0 })
        if (!state.Editing) {
            setWords(prev => prev.map((word, i) =>
                i === index ? { ...word, done: !word.done } : word
            ));
        } else {
            setWords(prev => prev.filter((word, i) =>
                i !== index
            ));
        }
    };

    const addNewWord = () => {
        setWords(prev => [...prev, { id: getRandId(), chinese: "", english: "" }]);
        setFocusIndex(words.length);
    };

    return (
        <div className='main bg-slate-25 w-full h-[calc(100vh-80px)] sm:h-full p-2 px-3 flex flex-col '>
            <h1 className='ml-9 m-1 mt-[3px]'>ECTTS 2.0</h1>
            <div className=' flex justify-center -mb-1'>
                <a className='cursor-pointer w-10 h-10' onClick={() => setState({ ...state, showE: !state.showE })}>
                    {state.showE ? <BxBxsHide className='text-2xl' /> : <BxBxsShow className='text-2xl' />}
                </a>
                <a className='cursor-pointer w-10 h-10' onClick={() => setState({ ...state, showC: !state.showC })}>
                    {state.showC ? <BxBxsHide className='text-2xl' /> : <BxBxsShow className='text-2xl' />}
                </a>
                <a className='cursor-pointer w-10 h-10' onClick={() => setState({ ...state, Editing: !state.Editing })}>
                    <MaterialSymbolsEditRounded className='text-2xl' />
                </a>
                <a className='cursor-pointer w-10 h-10' onClick={handleMove}>
                    <MaterialFileMove className=' text-2xl ' />
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
                <div className='h-full max-w-[22rem] sm:max-w-[64rem] min-w-[20rem]'>
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
        </div>
    )
}

export default MainBlock