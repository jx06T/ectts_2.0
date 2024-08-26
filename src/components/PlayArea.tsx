import React, { useCallback, useEffect, useRef, useState } from "react";
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

function PlayArea({ callback, words, currentTitle }: { callback: Function, words: Word[], currentTitle: string }) {
    const [showSetting, setShowSetting] = useState<boolean>(true)
    const [settings, setSettings] = useState<Settings>(initialSettings);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const voices = useRef<SpeechSynthesisVoice[]>([])
    const currentProgressRef = useRef<number>(0)
    const [currentProgress, setCurrentProgress] = useState<number>(0)
    const { notify, popNotify } = useNotify();

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
            const synth = window.speechSynthesis;
            voices.current = synth.getVoices();
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
    }, [voices]);

    const createUtterances = (word: Word) => {
        setSettings(prev => {
            console.log(JSON.stringify(prev))
            return prev
        })
        console.log(JSON.stringify(settings), word)
        const utterances = [];

        // English utterances
        const englishUtterance = createUtterance(word.english, settings.speed, "Microsoft Emma Online (Natural) - English (United States)");
        for (let i = 0; i < settings.repeat; i++) {
            utterances.push(englishUtterance);
            if (i < settings.repeat - 1) utterances.push(settings.timeEE);
        }

        // Letter spelling
        if (settings.letter) {
            utterances.push(settings.timeEL);
            const letterUtterance = createUtterance('"' + word.english.split("").join('","') + '"', 1, "Microsoft Emma Online (Natural) - English (United States)");
            utterances.push(letterUtterance);
        }

        // Chinese translation
        if (settings.chinese) {
            utterances.push(settings.timeLC);
            const chineseUtterance = createUtterance(word.chinese, 0.9, "Microsoft Hanhan - Chinese (Traditional, Taiwan)");
            utterances.push(chineseUtterance);
        }

        utterances.push(settings.timeWW);
        return utterances;
    }

    useEffect(() => {
        console.log("Settings updated:", JSON.stringify(settings));
    }, [settings]);

    const playUtterances = useCallback((utterances: (number | SpeechSynthesisUtterance)[]) => {
        let index = 0;
        const playNext = () => {
            if (index >= utterances.length) {
                currentProgressRef.current++;
                if (currentProgressRef.current < words.length) {
                    playWord(currentProgressRef.current);
                } else {
                    callback(currentProgressRef.current, false)
                    setIsPlaying(false);
                    currentProgressRef.current = 0
                }
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
    }, [words]);

    const playWord = useCallback((index: number) => {
        callback(index, true)
        setCurrentProgress(index)
        const utterances = createUtterances(words[index]);
        playUtterances(utterances);
    }, [words, createUtterances, playUtterances]);

    const handlePlay = () => {
        callback(currentProgressRef.current, !isPlaying)
        if (!isPlaying) {
            popNotify("Start playing")
            playWord(currentProgressRef.current);
        } else {
            popNotify("Stop playing")
            window.speechSynthesis.cancel();
        }
        setIsPlaying(prev => !prev);
    }

    return (
        <div className="bottom-2 left-0 right-0 px-2 xs:right-0 absolute flex flex-col items-center z-10">
            <div className={`${showSetting ? "h-[25rem] xs:h-[15rem] s940:h-[13rem]  s1200:h-[10rem]" : "h-[3.6rem]"} shadow-md bg-purple-200 rounded-lg w-full opacity-80 transition-all duration-300 ease-in-out flex flex-col justify-end`}>
                {showSetting && <>
                    <div className='w-full flex flex-wrap justify-center'>{
                        Object.entries(settings).filter(([key, value]) => key !== "init").map(([key, value], i) => (
                            <div key={i} className=" my-2 flex min-w-[18.5rem] xs:min-w-[18rem] s940:min-w-[17.5rem]  s1200:min-w-[17rem] space-x-3 mx-3">
                                <span onClick={() => { popNotify(SettingsUI[key].hint || "") }} className="w-16 cursor-help">{key}</span>
                                <input onChange={(e) => setSettings(prev => ({ ...prev, [key]: isNaN(parseFloat(e.target.value)) ? e.target.value : parseFloat(e.target.value) }))} type={SettingsUI[key].type} className={" accent-purple-700 " + (SettingsUI[key].type === "range" ? "jx-3 w-36" : "w-5 jx-4")} step={SettingsUI[key].step} max={SettingsUI[key].max} min={SettingsUI[key].min} value={value} />
                                {SettingsUI[key].type === "range" && <span> {value}</span>}
                            </div>
                        ))
                    }</div>
                    <hr />
                </>}

                <div className={` min-[28rem] w-full h-14 py-1 items-center flex justify-center space-x-[7%]`}>
                    <div className="pl-2 min-w-8">{currentTitle}</div>

                    <div className="flex flex-shrink-0 justify-center space-x-1">
                        <button className="js-2">
                            <FluentPreviousFrame24Filled className=" text-3xl" />
                        </button>
                        <button className="js-2">
                            <MingcuteSettings6Fill className=" text-3xl" onClick={() => setShowSetting(!showSetting)} />
                        </button>
                        <button className="js-2" onClick={handlePlay}>
                            {isPlaying ? <FluentPause24Filled className=" text-3xl" /> : <FluentPlay24Filled className=" text-3xl" />}
                        </button>
                        <button className="js-2">
                            <FluentNextFrame24Filled className=" text-3xl" />
                        </button>
                    </div>

                    <div className="min-w-8 pr-2">{words[currentProgress] ? (words[currentProgress].english + "／" + words[currentProgress].chinese) : ""}</div>
                </div >
            </div>
        </div>
    )
}

export default PlayArea