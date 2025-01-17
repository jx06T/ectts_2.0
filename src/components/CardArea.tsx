import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Params } from "react-router-dom";
import { useNotify } from "../context/NotifyContext";
import useSpeech from "../utils/Speech";
import { MingcuteVolumeLine } from "../utils/Icons";

function Card({ english, state, chinese, done, index = 0, toNext, back, handleDoneToggle }: { state: StateFormat, done: boolean, handleDoneToggle: Function, back: boolean, toNext: Function, english: string, chinese: string, index: number }) {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isMoving, setIsMoving] = useState<boolean>(false);
    const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [angle, setAngle] = useState<number>(0);
    const [isFlipped, setIsFlipped] = useState<boolean>(!state.showC ? (!state.showE ? (Math.random() < 0.5) : true) : false);
    const [action, setAction] = useState<number>(0);
    const [alpha, setAlpha] = useState<number>(0);

    const { speakE } = useSpeech()

    const lastX = useRef<number>(0)
    const lastY = useRef<number>(0)
    const cardRef = useRef<HTMLDivElement>(null);
    const overRef = useRef<boolean>(false);
    const overX = useRef<number>(100);

    const handleMove = (newX: number, newY: number): void => {
        setPosition({ x: newX, y: newY });
        setAngle(newX * 0.1)

        // setAlpha(Math.min(90, Math.max(0, (Math.abs(newX) - overX.current + 70) * 0.5)))
        // document.documentElement.style.setProperty('--color-l', `${50}%`);

        if (newX < -overX.current) {
            setAction(-1)
        } else if (newX > overX.current) {
            setAction(1)
        } else {
            setAction(0)
        }

    }

    useEffect(() => {
        setAlpha(Math.min(90, Math.max(0, (Math.abs(position.x) - overX.current + 70) * 0.5)))
    }, [position])

    useEffect(() => {
        setIsFlipped(!state.showC ? (!state.showE ? (Math.random() < 0.5) : true) : false)
    }, [chinese, english])

    const handleMoveEnd = (newX: number, newY: number): void => {
        lastX.current = newX
        lastY.current = newY
        setIsDragging(false);
        setIsMoving(false)

        if (Math.abs(newX) < overX.current) {
            handleMove(0, 0)
        } else {
            if (newX < -overX.current) {
                handleMove(-0.4 * window.screen.width - 400, 0)
            } else if (newX > overX.current) {
                handleMove(0.4 * window.screen.width + 400, 0)
            }

            setTimeout(() => {
                setIsMoving(true)
                setIsFlipped(!state.showC ? (!state.showE ? (Math.random() < 0.5) : true) : false)

                if (newX < -overX.current && done === true) {
                    handleDoneToggle(index)

                } else if (done === false && newX > overX.current) {
                    handleDoneToggle(index)
                }

                handleMove(0, 0)
                toNext()

            }, 200);
        }
    }

    const handleDragStart = (e: React.MouseEvent): void => {
        // @ts-ignore
        if (back || !e.target || e.target.classList.contains("dontDoIt")) {
            return
        }
        setIsMoving(false)
        const startX = e.clientX - position.x;
        const startY = e.clientY - position.y;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const newX = moveEvent.clientX - startX;
            const newY = moveEvent.clientY - startY;

            setIsDragging(Math.abs(newX - lastX.current) > 2 || Math.abs(newY - lastY.current) > 2);
            if (Math.abs(newX - lastX.current) > 2 || Math.abs(newY - lastY.current) > 2) {
                overRef.current = true
            }

            handleMove(newX, newY)
        };

        const handleMouseUp = (upEvent: MouseEvent) => {
            const newX = upEvent.clientX - startX;
            const newY = upEvent.clientY - startY;
            if (!overRef.current) {
                setIsFlipped(!isFlipped);
            }

            handleMoveEnd(newX, newY)

            overRef.current = false
            cardRef.current!.removeEventListener('mousemove', handleMouseMove);
            cardRef.current!.removeEventListener('mouseup', handleMouseUp);
        };

        cardRef.current!.addEventListener('mousemove', handleMouseMove);
        cardRef.current!.addEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (e: React.TouchEvent): void => {
        // @ts-ignore
        if (back || !e.target || e.target.classList.contains("dontDoIt")) {
            return
        }
        const touch = e.changedTouches[0];
        setIsMoving(false)
        const startX = touch.clientX - position.x;
        const startY = touch.clientY - position.y;
        console.log(startX)

        const handleTouchMove = (moveEvent: TouchEvent) => {
            const moceTouch = moveEvent.changedTouches[0];

            const newX = moceTouch.clientX - startX;
            const newY = moceTouch.clientY - startY;

            setIsDragging(Math.abs(newX - lastX.current) > 2 || Math.abs(newY - lastY.current) > 2);

            if (Math.abs(newX - lastX.current) > 2 || Math.abs(newY - lastY.current) > 2) {
                overRef.current = true
            }
            overRef.current = false

            handleMove(newX, newY)
        };

        const handleTouchEnd = (endEvent: TouchEvent) => {
            const upEvent = endEvent.changedTouches[0];
            const newX = upEvent.clientX - startX;
            const newY = upEvent.clientY - startY;

            handleMoveEnd(newX, newY)

            cardRef.current!.removeEventListener('touchmove', handleTouchMove);
            cardRef.current!.removeEventListener('touchend', handleTouchEnd);
        };

        cardRef.current!.addEventListener('touchmove', handleTouchMove);
        cardRef.current!.addEventListener('touchend', handleTouchEnd);
    };

    return (
        <div
            ref={cardRef}
            className={` card pointer-events-auto absolute top-16 bottom-[70px] select-none w-[95%] mt-3 rounded-2xl max-w-[440px] min-w-80 ${back ? "bg-opacity-0  z-20" : "bg-opacity-0  z-30"} `}
            style={{
                transform: `translate(${position.x}px, ${position.y}px) rotate(${angle}deg)`,
                transition: isDragging || isMoving ? 'none' : 'transform 0.2s ease-out',
                perspective: isDragging || isMoving ? '9000rem' : '100rem'
            }}

            onTouchStart={handleTouchStart}
            onMouseDown={handleDragStart}
        >
            <div
                className={`bg-blue-200 small-card ${back ? "back" : ""}`}
                style={{
                    transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                    backfaceVisibility: 'hidden',

                }}>
                <div
                    className={` small-card ${isDragging ? 'dragging' : ''}  ${action === -1 ? " border-2 border-red-500" : (action === 1 ? "border-2 border-green-500" : "")}`}
                    style={{
                        backgroundColor: `hsla(${position.x < 0 ? 14 : 94}deg, 80%, 50%, ${alpha}%`,
                        transition: isDragging ? 'none' : 'background-color 0.2s ease-out',
                    }}
                >
                    <h1 className=" select-text leading-none text-center text-4xl">{chinese}</h1>
                </div>
                <div className={` opacity-70 absolute right-2 top-2 rounded-lg w-8 h-8 ${done ? " bg-green-300" : " bg-red-300"}`}>
                </div>
                <div className=" dontDoIt absolute left-2 top-2 w-8 flex-">
                    <button className="dontDoIt" onClick={(e) => {
                        e.stopPropagation()
                        speakE(english)
                    }}><MingcuteVolumeLine className=" dontDoIt text-3xl" /></button>
                </div>
            </div>
            <div
                className={`bg-blue-200 small-card ${back ? "back" : ""}`}
                style={{
                    transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                }}>
                <div
                    className={` small-card ${isDragging ? 'dragging' : ''} ${action === -1 ? " border-2 border-red-500" : (action === 1 ? "border-2 border-green-500" : "")}`}
                    style={{
                        backgroundColor: `hsla(${position.x < 0 ? 14 : 94}deg, 80%, 50%, ${alpha}%`,
                        transition: isDragging ? 'none' : 'background-color 0.2s ease-out',
                    }}
                >
                    <h1 className=" select-text leading-none text-center text-4xl">{english}</h1>
                </div>
                <div className={` opacity-70 absolute right-2 top-2 rounded-lg w-8 h-8 ${done ? " bg-green-300" : " bg-red-300"}`}>
                </div>
                <div className=" dontDoIt absolute left-2 top-2 w-8 flex-">
                    <button className="dontDoIt" onClick={(e) => {
                        e.stopPropagation()
                        speakE(english)
                    }}><MingcuteVolumeLine className="dontDoIt  text-3xl" /></button>
                </div>
            </div>
        </div >
    )
}

function CardArea({ randomTableToPlay, state, handleDoneToggle, randomTable, words, progress }: { randomTableToPlay: number[], state: StateFormat, handleDoneToggle: Function, progress: { playIndex: number, setPlayIndex: Function }, randomTable: number[], words: Word[] }) {
    const { popNotify } = useNotify();
    const { playIndex, setPlayIndex } = progress
    const bias = useRef<number>(0)
    const { setId } = useParams<Params>();
    const addBias = useRef<boolean>(false)
    const navigate = useNavigate();

    const nextplayIndex = randomTableToPlay[randomTableToPlay.indexOf(playIndex) + 1] ? randomTableToPlay[randomTableToPlay.indexOf(playIndex) + 1] : randomTableToPlay[0]

    const CurrentIndex0 = (playIndex + bias.current) % 2 === 0 ? randomTable[playIndex] : randomTable[nextplayIndex]
    const CurrentIndex1 = (playIndex + bias.current) % 2 === 1 ? randomTable[playIndex] : randomTable[nextplayIndex]

    const currentWord0 = words[CurrentIndex0] ? words[CurrentIndex0] : { id: "ddddddddddddddd", chinese: "", english: "" }
    const currentWord1 = words[CurrentIndex1] ? words[CurrentIndex1] : { id: "ddddddddddddddd", chinese: "", english: "" }

    useEffect(() => {
        if (addBias.current) {
            bias.current += 1
            addBias.current = false
        }
    }, [words])

    const toNext = () => {
        setPlayIndex(randomTableToPlay[randomTableToPlay.indexOf(playIndex) + 1] || randomTableToPlay[0])
        console.log(randomTableToPlay)
        // setPlayIndex(findNextWordToPlay(words, randomTable, playIndex, state.onlyPlayUnDone))
    }

    console.log(playIndex, randomTableToPlay)
    useEffect(() => {
        if (randomTableToPlay.indexOf(playIndex) < 0) {
            setPlayIndex(randomTableToPlay[0])
        }
        if (randomTableToPlay.length === 0 && randomTable.length !== 0) {
            navigate(`/set/${setId}`);
            popNotify("All done")
        }
        // console.log(playIndex)
    }, [playIndex, randomTable, randomTableToPlay])

    if (!currentWord0 || !currentWord1) {
        return null
    }

    return (
        <div className=" pointer-events-none pb-16 overflow-hidden card-area left-0 right-0 top-0 bottom-0 absolute flex flex-col items-center z-20 bg-slate-100 bg-opacity-5">
            <Card state={state} chinese={currentWord0.chinese} english={currentWord0.english} done={!!currentWord0.done} index={CurrentIndex0} toNext={toNext} handleDoneToggle={handleDoneToggle} back={(playIndex + bias.current) % 2 === 1} />
            <Card state={state} chinese={currentWord1.chinese} english={currentWord1.english} done={!!currentWord1.done} index={CurrentIndex1} toNext={toNext} handleDoneToggle={handleDoneToggle} back={(playIndex + bias.current) % 2 === 0} />
        </div>
    )
}

export default CardArea;
