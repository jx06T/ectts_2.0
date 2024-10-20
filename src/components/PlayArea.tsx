import React, { useReducer, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MingcuteSettings6Fill, FluentNextFrame24Filled, FluentPreviousFrame24Filled, FluentPause24Filled, FluentPlay24Filled } from "../utils/Icons";
import { useNotify } from '../context/NotifyContext'
import { Params, useParams } from 'react-router-dom';
import useSpeech from "../utils/Speech";

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
    span?: string,
}

const SettingsUI: Record<string, UI> = {
    timeWW: { span: "WtW", type: "range", min: 0, max: 7000, step: 10, hint: "The interval between different words" },
    timeEE: { span: "EtE", type: "range", min: 0, max: 7000, step: 10, hint: "The interval between repeated words" },
    timeEL: { span: "EtL", type: "range", min: 0, max: 7000, step: 10, hint: "The interval between words and letters" },
    timeLC: { span: "LtC", type: "range", min: 0, max: 7000, step: 10, hint: "The interval letters words and Chinese" },
    speed: { span: "speed", type: "range", min: 0.1, max: 3, step: 0.1, hint: "The speed of English words" },
    repeat: { span: "repeat", type: "range", min: 1, max: 13, hint: "number of repetitions" },
    letter: { span: "letter", type: "checkbox", hint: "Say the letters ?" },
    chinese: { span: "chinese", type: "checkbox", hint: "Say chinese ?" },
}

function PlayArea({ scrollToTop, randomTable, progress, words, currentTitle, onlyPlayUnDone }: { scrollToTop: Function, onlyPlayUnDone: boolean, randomTable: number[], progress: { playIndex: number, setPlayIndex: Function }, callback?: Function, words: Word[], currentTitle: string }) {
    const { setId, mode } = useParams<Params>();
    const [cardsMode, setCardsMode] = useState<boolean>(mode === "cards")

    const [showSetting, setShowSetting] = useState<boolean>(false)
    const { popNotify } = useNotify();

    const [settings, setSettings] = useState<Settings>(initialSettings);
    const settingsRef = useRef<Settings>(settings)

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const isPlayingRef = useRef<boolean>(false)
    const playbackIdRef = useRef<number>(0)

    const { setPlayIndex, playIndex } = progress
    const playIndexRef = useRef<number>(0)

    const { synth, speakerC, speakerE, voices } = useSpeech()

    const randomTableRef = useRef<number[] | null>(randomTable);
    const audioRef = useRef<HTMLAudioElement>(null)
    const wordsRef = useRef<Word[]>(words)
    const onlyPlayUnDoneRef = useRef<boolean>(onlyPlayUnDone)

    useEffect(() => {
        setCardsMode(mode === "cards")
    }, [mode])

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

    const createUtterance = useCallback((text: string, rate: number, voiceName: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.voice = voices.find(v => v.name === voiceName) || voices[0];
        return utterance;
    }, [voices, settings]);

    const createUtterances = useCallback((settings: Settings, word: Word) => {
        const utterances = [];

        // English utterances
        const englishUtterance = createUtterance(word.english.replaceAll("sth","something").replaceAll("sb","somebody"), settings.speed, speakerE);
        for (let i = 0; i < settings.repeat; i++) {
            utterances.push(englishUtterance);
            if (i < settings.repeat - 1) utterances.push(settings.timeEE);
        }

        // Letter spelling
        if (settings.letter) {
            utterances.push(settings.timeEL);
            const letterUtterance = createUtterance('"' + word.english.split("").join('","').replaceAll('," "', " ") + '"', 1, speakerE);
            utterances.push(letterUtterance);
        }

        // Chinese translation
        if (settings.chinese) {
            utterances.push(settings.timeLC);
            const chineseUtterance = createUtterance(word.chinese, 0.9, speakerC);
            utterances.push(chineseUtterance);
        }

        utterances.push(settings.timeWW);
        return utterances;
    }, [wordsRef, settings, createUtterance, speakerC, speakerE]);

    const playUtterances = useCallback((utterances: (number | SpeechSynthesisUtterance)[], thisIndex: number, playbackId: number) => {
        let index = 0;
        const playNext = () => {

            if (!isPlayingRef.current || playbackIdRef.current !== playbackId) {
                return
            }
            if (playIndexRef.current !== thisIndex) {
                playWord(-10);
                return
            }
            if (index >= utterances.length) {
                playWord(thisIndex + 1);
                return;
            }

            const item = utterances[index];
            if (typeof item === 'number') {
                setTimeout(playNext, item);
            } else {
                synth.speak(item);
                item.onend = playNext;
            }
            index++;
        };

        playNext();
    }, [wordsRef, settings, speakerC, speakerE]);

    const findNextWordToPlay = (currentIndex: number): number => {
        const isWordPlayable = (word: Word) => word.selected && (!onlyPlayUnDone || !word.done);

        if (isWordPlayable(wordsRef.current[randomTableRef.current![currentIndex]])) {
            return currentIndex;
        }

        for (let i = currentIndex + 1; i < randomTableRef.current!.length; i++) {
            if (isWordPlayable(wordsRef.current[randomTableRef.current![i]])) {
                return i;
            }
        }

        for (let i = 0; i < currentIndex; i++) {
            if (isWordPlayable(wordsRef.current[randomTableRef.current![i]])) {
                return i;
            }
        }

        return -1;
    };

    const findPreviousWordToPlay = (currentIndex: number): number => {
        const isWordPlayable = (word: Word) => word.selected && (!onlyPlayUnDone || !word.done);

        if (isWordPlayable(wordsRef.current[randomTableRef.current![currentIndex]])) {
            return currentIndex;
        }

        for (let i = currentIndex - 1; i > -1; i--) {
            if (isWordPlayable(wordsRef.current[randomTableRef.current![i]])) {
                return i;
            }
        }

        for (let i = randomTableRef.current!.length - 1; i > currentIndex; i--) {
            if (isWordPlayable(wordsRef.current[randomTableRef.current![i]])) {
                return i;
            }
        }

        return -1;
    };

    const playWord = useCallback((index: number) => {
        if (index === -10) {
            index = playIndexRef.current
        }
        if (index === wordsRef.current.length) {
            index = 0
        }


        const nextIndex = findNextWordToPlay(index);
        if (nextIndex === -1) {
            popNotify("No more words to play")
            stop()
            return
        }
        index = nextIndex
        const randIndex = randomTableRef.current![index]

        playIndexRef.current = index
        setPlayIndex(index)
        const utterances = createUtterances(settingsRef.current, wordsRef.current[randIndex]);
        playbackIdRef.current += 1
        playUtterances(utterances, index, playbackIdRef.current);
    }, [wordsRef.current, createUtterances, playUtterances, settings, playIndex, speakerC, speakerE]);


    const stop = () => {
        setIsPlaying(false);
        synth.cancel();
    }

    const handlePlay = () => {
        if (!isPlaying) {
            isPlayingRef.current = true
            setIsPlaying(true);
            popNotify("Start playing")
            playWord(playIndex);

            if (audioRef.current) {
                audioRef.current.volume = 1
                audioRef.current.play();
            }

        } else {
            isPlayingRef.current = false
            popNotify("Stop playing")
            setIsPlaying(false);
            stop()

            if (audioRef.current) {
                audioRef.current.pause();
            }

        }
    }

    const handleEnded = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    }

    const handleAudioPause = () => {

    }

    const handleAudioPlay = () => {

    }

    useEffect(() => {
        playIndexRef.current = playIndex
        settingsRef.current = settings
        randomTableRef.current = randomTable
        isPlayingRef.current = isPlaying
        wordsRef.current = words
        onlyPlayUnDoneRef.current = onlyPlayUnDone
    }, [playIndex, settings, words, randomTable, isPlaying, onlyPlayUnDone])

    return (
        <div className="bottom-2 left-0 right-0 px-2 xs:right-0 fixed flex flex-col items-center z-40">
            <audio onPause={handleAudioPause} onPlay={handleAudioPlay} onEnded={handleEnded} className=" z-50 fixed left-5 top-6 h-36 w-full" ref={audioRef} id="backgroundAudio" src="/test.wav"></audio>
            <div onClick={() => {
                scrollToTop(playIndex)
                setTimeout(() => {
                    scrollToTop(playIndexRef.current)
                }, 400)
            }} className={`${showSetting ? "" : "h-[3.6rem]"} shadow-md bg-purple-200 rounded-lg w-full opacity-80 transition-all duration-300 ease-in-out flex flex-col justify-end`}>
                {showSetting && <>
                    <div
                        style={{
                            gridTemplateColumns: "repeat(auto-fit, 300px)"
                        }}
                        className=' w-full grid gap-2 mx-4 justify-center'>{
                            Object.entries(settings).filter(([key, value]) => key !== "init").map(([key, value], i) => (
                                <div key={i} className=" my-2 space-x-3">
                                    <span onClick={() => { popNotify(SettingsUI[key].hint || "") }} className="w-16 cursor-help">{SettingsUI[key].span}</span>
                                    <input
                                        checked={value}
                                        onChange={(e) =>
                                            setSettings(prev =>
                                            ({
                                                ...prev, [key]: isNaN(parseFloat(e.target.value)) ?
                                                    e.target.value.toString() !== "true" :
                                                    parseFloat(e.target.value)
                                            }))}
                                        type={SettingsUI[key].type}
                                        className={" accent-purple-700 " + (SettingsUI[key].type === "range" ? "jx-3 w-36" : "w-5 jx-4")}
                                        step={SettingsUI[key].step}
                                        max={SettingsUI[key].max}
                                        min={SettingsUI[key].min}
                                        value={value} />

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
                            if (playIndex > 0) {
                                setPlayIndex((prev: number) => findPreviousWordToPlay(prev - 1))
                            } else {
                                setPlayIndex(findPreviousWordToPlay(words.length - 1))
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
                            if (playIndex < words.length - 1) {
                                setPlayIndex((prev: number) => findNextWordToPlay(prev + 1))
                            } else {
                                setPlayIndex(findNextWordToPlay(0))
                            }
                        }}>
                            <FluentNextFrame24Filled className=" text-3xl" />
                        </button>
                    </div>

                    <div className=" w-[28%] xs:w-[30%] pr-2 text-sm xs:text-lg  ">
                        {cardsMode ? "✓ " + words.filter(word => word.done).length : (words[randomTableRef.current![playIndex]] ? words[randomTableRef.current![playIndex]].english : "")}
                        <br></br>
                        {cardsMode ? "✕ " + words.filter(word => !word.done).length : (words[randomTableRef.current![playIndex]] ? words[randomTableRef.current![playIndex]].chinese : "")}
                    </div>
                </div >
            </div>
        </div>
    )
}

export default PlayArea
