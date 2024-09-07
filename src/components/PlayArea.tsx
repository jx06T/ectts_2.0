import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MingcuteSettings6Fill, FluentNextFrame24Filled, FluentPreviousFrame24Filled, FluentPause24Filled, FluentPlay24Filled } from "../utils/Icons";
import { useNotify } from './NotifyContext'

const initialSettings: Settings = {
    timeWW: 1000,
    timeEE: 1000,
    timeEL: 1000,
    timeLC: 1000,
    speed: 1,
    repeat: 3,
    letter: true,
    chinese: true,
    init: true
}

interface UI {
    type: "range" | "checkbox",
    min?: number,
    max?: number,
    step?: number,
    hint?: string,
}

const SettingsUI: Record<string, UI> = {
    timeWW: { type: "range", min: 0, max: 7000, step: 10, hint: "The interval between different words" },
    timeEE: { type: "range", min: 0, max: 7000, step: 10, hint: "The interval between repeated words" },
    timeEL: { type: "range", min: 0, max: 7000, step: 10, hint: "The interval between words and letters" },
    timeLC: { type: "range", min: 0, max: 7000, step: 10, hint: "The interval letters words and Chinese" },
    speed: { type: "range", min: 0.1, max: 3, step: 0.1, hint: "The speed of English words" },
    repeat: { type: "range", min: 1, max: 13, hint: "number of repetitions" },
    letter: { type: "checkbox", hint: "Say the letters ?" },
    chinese: { type: "checkbox", hint: "Say chinese ?" },
}


function PlayArea({ randomTable, progress, words, currentTitle, scrollToCenter }: { randomTable: number[], scrollToCenter: Function, progress: { currentProgress: number, setCurrentProgress: Function }, callback?: Function, words: Word[], currentTitle: string }) {
    const [showSetting, setShowSetting] = useState<boolean>(false)
    const { notify, popNotify } = useNotify();

    const [settings, setSettings] = useState<Settings>(initialSettings);
    const settingsRef = useRef<Settings>(settings)

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const isPlayingRef = useRef<boolean>(false)

    const { currentProgress, setCurrentProgress } = progress
    const currentProgressRef = useRef<number>(0)

    const limitCountRef = useRef<number>(0)
    const synth = window.speechSynthesis;
    const speakerCRef = useRef<string>("");
    const speakerERef = useRef<string>("");
    const voices = useRef<SpeechSynthesisVoice[]>([])

    const randomTableRef = useRef<number[] | null>(randomTable);

    useEffect(() => {
        const initialSettingsL = localStorage.getItem('ectts-settings');
        if (initialSettingsL) {
            setSettings(JSON.parse(initialSettingsL));
        } else {
            setSettings({ ...initialSettings, init: false });
        }
    }, [])

    useEffect(() => {
        if (!settings.init) {
            localStorage.setItem('ectts-settings', JSON.stringify(settings))
        }
    }, [settings])

    useEffect(() => {
        setTimeout(() => {
            voices.current = synth.getVoices();
            for (let i = 0; i < voices.current.length; i++) {

                if (voices.current[i].name == "Microsoft Emma Online (Natural) - English (United States)" || voices.current[i].name == "Fred") {
                    speakerERef.current = voices.current[i].name
                }

                if (voices.current[i].name == "Microsoft Hanhan - Chinese (Traditional, Taiwan)" || voices.current[i].name == "美嘉" || voices.current[i].name == "Mei-Jia") {
                    speakerCRef.current = voices.current[i].name
                }
            }

        }, 1000);

        window.addEventListener('beforeunload', (event) => {
            window.speechSynthesis.cancel();
        });
    }, [])

    const createUtterance = useCallback((text: string, rate: number, voiceName: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.voice = voices.current.find(v => v.name === voiceName) || voices.current[0];
        return utterance;
    }, [voices, settings]);

    useEffect(() => {
        currentProgressRef.current = currentProgress
        settingsRef.current = settings
        randomTableRef.current = randomTable
        isPlayingRef.current = isPlaying
    }, [currentProgress, settings, randomTable, isPlaying])

    const createUtterances = useCallback((settings: Settings, word: Word) => {
        const utterances = [];

        // English utterances
        const englishUtterance = createUtterance(word.english, settings.speed, speakerERef.current);
        for (let i = 0; i < settings.repeat; i++) {
            utterances.push(englishUtterance);
            if (i < settings.repeat - 1) utterances.push(settings.timeEE);
        }

        // Letter spelling
        if (settings.letter) {
            utterances.push(settings.timeEL);
            const letterUtterance = createUtterance('"' + word.english.split("").join('","') + '"', 1, speakerERef.current);
            utterances.push(letterUtterance);
        }

        // Chinese translation
        if (settings.chinese) {
            utterances.push(settings.timeLC);
            const chineseUtterance = createUtterance(word.chinese, 0.9, speakerCRef.current);
            utterances.push(chineseUtterance);
        }

        utterances.push(settings.timeWW);
        return utterances;
    }, [words, settings]);

    const playUtterances = useCallback((utterances: (number | SpeechSynthesisUtterance)[], ProgressIndex: number) => {
        let index = 0;
        const playNext = () => {
            if (!isPlayingRef.current) {
                return
            }
            if (currentProgressRef.current !== ProgressIndex) {
                playWord(-10);
                return
            }
            if (index >= utterances.length) {
                playWord(ProgressIndex + 1);
                return;
            }

            const item = utterances[index];
            if (typeof item === 'number') {
                setTimeout(playNext, item);
            } else {
                window.speechSynthesis.speak(item);
                item.onend = playNext;
            }
            index++;
        };

        playNext();
    }, [words, settings, currentProgress]);

    const playWord = useCallback((index: number) => {
        let newIndex = index

        if (randomTableRef.current![index] != randomTableRef.current![currentProgressRef.current + 1]) {
            if (limitCountRef.current < 2000) {
                limitCountRef.current++
                newIndex = currentProgressRef.current
            } else {
                setIsPlaying(false);
                return
            }
        }

        // if (words[newIndex] && !words[newIndex].needToPlay) {
        //     setCurrentProgress(newIndex)
        //     setTimeout(() => {
        //         playWord(newIndex + 1)
        //     }, 100);
        //     return
        // }

        // const newNewIndex = randomTable.current ? randomTable.current[newIndex] : newIndex
        // console.log(newIndex, randomTable.current, newNewIndex)

        if (!words[randomTableRef.current![newIndex]]) {
            setCurrentProgress(0)
            scrollToCenter(0)
            setIsPlaying(false);
            return
        }

        setCurrentProgress(newIndex)
        currentProgressRef.current = newIndex
        scrollToCenter(randomTableRef.current![newIndex])
        const utterances = createUtterances(settingsRef.current, words[randomTableRef.current![newIndex]]);
        playUtterances(utterances, newIndex);

    }, [words, createUtterances, playUtterances, settings, currentProgress]);

    const stop = () => {
        limitCountRef.current = 0
        setIsPlaying(false);
        for (let _ = 0; _ < 3; _++) {
            setTimeout(() => {
                window.speechSynthesis.cancel();
            }, 100 * _ + 100);
        }
        window.speechSynthesis.cancel();
    }

    const handlePlay = () => {
        if (!isPlaying) {
            isPlayingRef.current = true
            setIsPlaying(true);
            popNotify("Start playing")
            playWord(currentProgress);
        } else {
            popNotify("Stop playing")
            stop()
        }
    }

    return (
        <div className="bottom-2 left-0 right-0 px-2 xs:right-0 absolute flex flex-col items-center z-10">
            <div className={`${showSetting ? "h-[25rem] xs:h-[15rem] s940:h-[13rem]  s1200:h-[10rem]" : "h-[3.6rem]"} shadow-md bg-purple-200 rounded-lg w-full opacity-80 transition-all duration-300 ease-in-out flex flex-col justify-end`}>
                {showSetting && <>
                    <div className='w-full flex flex-wrap justify-center'>{
                        Object.entries(settings).filter(([key, value]) => key !== "init").map(([key, value], i) => (
                            <div key={i} className=" my-2 flex min-w-[18.5rem] xs:min-w-[18rem] s940:min-w-[17.5rem]  s1200:min-w-[17rem] space-x-3 mx-3">
                                <span onClick={() => { popNotify(SettingsUI[key].hint || "") }} className="w-16 cursor-help">{key}</span>
                                <input checked={value} onChange={(e) => setSettings(prev => ({ ...prev, [key]: isNaN(parseFloat(e.target.value)) ? e.target.value.toString() !== "true" : parseFloat(e.target.value) }))} type={SettingsUI[key].type} className={" accent-purple-700 " + (SettingsUI[key].type === "range" ? "jx-3 w-36" : "w-5 jx-4")} step={SettingsUI[key].step} max={SettingsUI[key].max} min={SettingsUI[key].min} value={value} />
                                {SettingsUI[key].type === "range" && <span> {value}</span>}
                            </div>
                        ))
                    }</div>
                    <hr />
                </>}

                <div className={` min-[28rem] w-full h-14 py-1 flex justify-center items-center space-x-[2%] mdlg:space-x-[6%] xs:space-x-[8%] 2xs:space-x-[5%]`}>
                    <div className=" w-[16%] xs:w-[26%] text-right flex-shrink-0 text-sm xs:text-lg ">{currentTitle}</div>

                    <div className="flex flex-shrink-0 justify-center space-x-[-1px] mt-1">
                        <button className="js-2" onClick={() => {
                            if (currentProgress > 0) {
                                setCurrentProgress((prev: number) => prev - 1)
                            }
                        }}>
                            <FluentPreviousFrame24Filled className=" text-3xl" />
                        </button>
                        <button className="js-2">
                            <MingcuteSettings6Fill className=" text-3xl" onClick={() => setShowSetting(!showSetting)} />
                        </button>
                        <button className="js-2" onClick={handlePlay}>
                            {isPlaying ? <FluentPause24Filled className=" text-3xl" /> : <FluentPlay24Filled className=" text-3xl" />}
                        </button>
                        <button className="js-2" onClick={() => {
                            if (currentProgress < words.length - 1) {
                                setCurrentProgress((prev: number) => prev + 1)
                            }
                        }}>
                            <FluentNextFrame24Filled className=" text-3xl" />
                        </button>
                    </div>

                    <div className=" w-[28%] xs:w-[30%] pr-2 text-sm xs:text-lg  ">
                        {words[randomTableRef.current![currentProgress]] ? words[randomTableRef.current![currentProgress]].english : ""}
                        <br></br>
                        {words[randomTableRef.current![currentProgress]] ? words[randomTableRef.current![currentProgress]].chinese : ""}
                    </div>
                </div >
            </div>
        </div>
    )
}

export default PlayArea