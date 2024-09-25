import React, { useCallback, useEffect, useRef, useState } from 'react'
import WordItem from './WordItem'
import { IcRoundMenuOpenL, IcRoundMenuOpenR, MdiCardsOutline, MaterialChecklistRtl, CarbonSelectWindow, MdiDice5, Fa6SolidFileImport, MaterialDeleteRounded, MaterialLock, MaterialLockOpen, MaterialFileMove, Fa6SolidFileExport, PhSelectionBold, PhSelectionDuotone, PhSelectionInverseDuotone, BxBxsHide, BxBxsShow, MaterialSymbolsEditRounded } from '../utils/Icons'
import PlayArea from './PlayArea'
import { useNotify } from './NotifyContext'
import createConfirmDialog from './ConfirmDialog';
import CardArea from './CardArea'
import { Params, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    const { setId } = useParams<Params>();

    const [currentTitle, setCurrentTitle] = useState<string>("");
    const [words, setWords] = useState<Word[]>([]);
    const [state, setState] = useState<State1>({ showE: true, showC: true, editing: false, selection: 0, lock: false, rand: false, cards: false, deleting: false, init: true, page0: true });
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
        if (words.length == 0) {
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
            setWords(prev => {
                const newWords = prev.map((word, i) => i === index ? { ...word, done: !word.done } : word)
                popNotify(`${newWords.filter(word => word.done).length}／${words.length} words done`)
                if (randomTable[playPosition] > index) {
                    setPlayPosition(playPosition + (newWords[index].done ? -1 : 1))
                }
                return newWords
            });
        } else {
            setWords(prev => {
                const newWords = prev.map((word, i) => i === index ? { ...word, selected: !word.selected } : word)
                popNotify(`${newWords.filter(word => word.selected).length}／${words.length} words selected`)
                if (randomTable[playPosition] > index) {
                    setPlayPosition(playPosition + (newWords[index].selected ? 1 : -1))
                }
                return newWords
            });
        }
    };

    const addNewWord = () => {
        setWords(prev => [...prev, { id: getRandId(), chinese: "", english: "", done: false, selected: false }]);
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
            <div className='flex'>
                <h1 onClick={() => navigate('/')} className=' cursor-pointer ml-11 m-1 mt-[3px] min-w-[70px]'>ECTTS 2.0</h1>
                <div className='flex flex-grow justify-center fixed right-[5%] mdlg:right-[12%] lg:right-[24%] z-40' >
                    <h1 className={` ${notify === "" ? " opacity-0" : " opacity-100"} bg-stone-700 rounded-full px-4 text-white max-w-80 w-full ml-9 m-1 mt-[3px] transition-opacity duration-300 z-10`}>{notify}</h1>
                </div>
            </div>
            <div className=' flex justify-center -mb-2 sm:-mb-1 mt-1'>
                <div className=' flex justify-between w-80'>
                    {state.page0 && <div className='flex justify-center space-x-1'>
                        <a className='cursor-pointer w-10 h-10' onClick={handleReverseSelection}>
                            <PhSelectionInverseDuotone className='text-2xl' />
                        </a>

                        <a className='cursor-pointer w-10 h-10' onClick={handleSelectAll}>
                            {state.selection == 1 ? <PhSelectionBold className='text-2xl' /> : <PhSelectionDuotone className='text-2xl' />}
                        </a>

                        <a className='cursor-pointer w-10 h-10' onClick={() => {
                            popNotify(state.editing ? "Select mode" : "Normal mode")
                            setState((pre: State1) => {
                                const newState = { ...pre, editing: !pre.editing }
                                // setRandomTable(getRandomTable(words, newState.rand, newState))
                                return newState
                            })
                        }}>
                            {state.editing ? <MaterialChecklistRtl className='text-2xl' /> : <CarbonSelectWindow className='text-2xl' />}
                        </a>

                        <a className='cursor-pointer w-10 h-10' onClick={() => {
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

                        <a className='cursor-pointer w-10 h-10' onClick={() => {
                            popNotify(!state.cards ? "Cards mode" : "Normal mode")
                            setRandomTable(getRandomTable(words, state.rand, state))
                            if (randomTable.length === 0) {
                                return
                            }
                            setPlayPosition(0)
                            setState({ ...state, cards: !state.cards })
                        }}>
                            <MdiCardsOutline className={` text-2xl ${state.cards ? " text-purple-700" : ""}`} />
                        </a>
                    </div>}

                    {!state.page0 && <div className='flex justify-center space-x-1'>
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
                    </div>}
                    <a className='flex cursor-pointer w-10 h-10 -mt-[1.5px]' onClick={() => {
                        setState({ ...state, page0: !state.page0 })
                    }}><label className=' mr-3 select-none '>|</label>
                        {state.page0 ?
                            <IcRoundMenuOpenL className={` -mt-[1px] text-3xl`} />
                            :
                            <IcRoundMenuOpenR className={` -mt-[1px] text-3xl`} />
                        }
                    </a>
                </div>
            </div>

            <div className=' relative flex justify-center h-full w-full overflow-y-auto'>
                {/* <div ref={scrollRef} className='jx-5 h-full max-w-[22rem] sm:max-w-[32rem] sm:min-w-[28rem] min-w-[20rem] space-y-2 overflow-x-hidden pl-1'> */}
                <div ref={scrollRef} className='jx-5 h-full max-w-[22rem] min-w-[20rem] min-w-[20rem] sm:max-w-[28rem] sm:min-w-[22rem] space-y-2 overflow-x-hidden pl-1'>
                    {setId ?
                        <>
                            {
                                words.map((word, index) => (
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
                            < div className='h-[50%]'>
                                <textarea placeholder='Export and Import area' ref={inputBoxRef} className='h-full outline-none w-96 p-2 mt-8'></textarea>
                            </div>
                        </> :
                        <Home />
                    }
                </div>
            </div>
            {state.cards && <CardArea state={state} handleDoneToggle={handleDoneToggle} randomTable={randomTable} progress={{ currentProgress: playPosition, setCurrentProgress: setPlayPosition }} words={words} />}
            <PlayArea state={state} randomTable={randomTable} scrollToCenter={scrollToCenter} progress={{ currentProgress: playPosition, setCurrentProgress: setPlayPosition }} currentTitle={currentTitle} words={words} />
        </div >
    )
}

export default MainBlock

function Home() {
    const navigate = useNavigate();
    const { notify, popNotify } = useNotify();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExportAll = () => {
        let allSet: [Aset] | [] = []

        const allSet0 = localStorage.getItem(`all-set`);
        if (allSet0) {
            allSet = JSON.parse(allSet0 as string);
        } else {
            popNotify("Word list is empty")
            return
        };

        const dataOrigin: [any?] = []
        allSet.forEach(aSet => {
            const aSetData0 = localStorage.getItem(`set-${aSet.id}`);
            let setData = {}

            if (aSetData0) {
                setData = { ...aSet, words: JSON.parse(aSetData0 as string) };
            } else {
                return
            };

            dataOrigin.push(setData)
        })

        const dataStr = JSON.stringify(dataOrigin, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'ectts-all-words.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    const handleImportAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        if (!file) {
            popNotify("error")
            return
        }

        let allSet: [Aset?] = []

        const allSet0 = localStorage.getItem(`all-set`);
        if (allSet0) {
            allSet = JSON.parse(allSet0 as string);
        };

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                const jsonData = JSON.parse(e.target!.result as string);
                jsonData.forEach((aSet: Aset & { words: Word[] }) => {
                    if (!allSet.find((e): e is Aset => e !== undefined && e.id === aSet.id)) {
                        allSet.push({ id: aSet.id, title: aSet.title } as Aset)
                    }
                    localStorage.setItem(`set-${aSet.id}`, JSON.stringify(aSet.words));

                });

                localStorage.setItem(`all-set`, JSON.stringify(allSet));
                navigate(`/${allSet[0]?.id}`)
                popNotify("Imported successfully")

            } catch (error) {
                popNotify(`Error parsing JSON file`)
                console.error('Error parsing JSON file:', error);
            }
        };

        reader.onerror = (error) => {
            popNotify(`Error reading file`)
            console.error('Error reading file:', error);
        };
        reader.readAsText(file);


    }

    const handleImportBtnClick = () => {
        fileInputRef.current!.value = '';
        fileInputRef.current!.click();
    };


    return (
        <>
            <div className='home bg-blue-100 flex flex-col items-center  max-w-[26rem] p-3 rounded-2xl'>
                <pre className=' text-wrap text-center text-xl leading-10'>
                    {`歡迎使用這個工具\n首先請在左側側欄建立一個單字集\n接下來就可以在中間框框輸入單字\n上面的按鈕以及其他詳細進階用法\n請到 `}
                    <a href="https://github.com/jx06T/ectts_2.0" target="_blank" className=' underline'>github</a>
                    {` 查看`}
                </pre>

                <div className='flex flex-col sm:flex-row sm:space-x-6 sm:space-y-0 space-y-6 mt-6 mb-4'>
                    <button onClick={handleExportAll} className=' w-40 h-10 bg-green-200 rounded-lg'>匯出全部單字</button>
                    <button onClick={handleImportBtnClick} className=' w-40 h-10 bg-green-200 rounded-lg'>匯入全部單字</button>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImportAll}
                    className="hidden w-0"
                />
            </div>
            <div className=' h-20'>

            </div>
        </>
    )
}
