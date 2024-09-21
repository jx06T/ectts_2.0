import React, { useEffect, useRef, useState } from "react";


function Card({ english, state, chinese, done, index = 0, toNext, back, handleDoneToggle, addBias }: { addBias: Function, state: State1, done: boolean, handleDoneToggle: Function, back: boolean, toNext: Function, english: string, chinese: string, index: number }) {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isMoving, setIsMoving] = useState<boolean>(false);
    const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [angle, setAngle] = useState<number>(0);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [action, setAction] = useState<number>(0);

    const lastX = useRef<number>(0)
    const lastY = useRef<number>(0)
    const cardRef = useRef<HTMLDivElement>(null);
    const overRef = useRef<boolean>(false);

    const handleMove = (newX: number, newY: number): void => {
        setPosition({ x: newX, y: newY });
        setAngle(newX * 0.1)

        if (newX < -150) {
            setAction(-1)
        } else if (newX > 150) {
            setAction(1)
        } else {
            setAction(0)
        }

    }

    const handleMoveEnd = (newX: number, newY: number): void => {
        lastX.current = newX
        lastY.current = newY
        setIsDragging(false);

        if (Math.abs(newX) < 150) {
            handleMove(0, 0)
        } else {

            if (newX < -150) {
                handleMove(-1000, 0)
            } else if (newX > 150) {
                handleMove(1000, 0)
            }

            setTimeout(() => {
                setIsMoving(true)
                setIsFlipped(false);

                
                if (newX < -150 && done === true) {
                    handleDoneToggle(index, false)
                    
                } else if (done === false && newX > 150) {
                    handleDoneToggle(index, true)
                    
                    if (!state.editing) {
                        setTimeout(() => {
                            addBias()
                        }, 0);
                        // return
                    }
                }
                
                // handleMove(0, 0)
                // toNext(1)

            }, 50);
        }
    }

    const handleDragStart = (e: React.MouseEvent): void => {
        if (back) {
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
        if (back) {
            return
        }
        const touch = e.changedTouches[0];
        setIsMoving(false)
        const startX = touch.clientX - position.x;
        const startY = touch.clientY - position.y;

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
            className={`${action === -1 ? " border-2 border-red-500  opacity-80" : (action === 1 ? " border-2 border-green-500 opacity-80" : "")} card pointer-events-auto absolute top-16 bottom-[70px] select-none w-[95%] mt-3 rounded-2xl max-w-[440px] min-w-80 bg-blues-300 ${back ? "bg-opacity-0  z-20" : "bg-opacity-30  z-30"} `}
            style={{
                transform: `translate(${position.x}px, ${position.y}px) rotate(${angle}deg)`,
                transition: isDragging || isMoving ? 'none' : 'transform 0.2s ease-out',
                perspective: '100rem'
            }}

            onTouchStart={handleTouchStart}
            onMouseDown={handleDragStart}
        >
            <div
                className={` small-card ${isDragging ? 'dragging' : ''} ${isMoving ? "moving" : ""} ${!back ? "bg-blue-100" : "bg-slate-50"}`}
                style={{
                    transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                    backfaceVisibility: 'hidden',
                }}>
                <h1 className=" select-text leading-none text-center text-4xl">{chinese}</h1>
            </div>
            <div
                className={` small-card ${isDragging ? 'dragging' : ''} ${isMoving ? "moving" : ""} ${!back ? "bg-blue-100" : "bg-slate-50"}`}
                style={{
                    transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                }}>
                <h1 className=" select-text leading-none text-center text-4xl">{english}</h1>
            </div>
        </div>
    )
}

function CardArea({ state, handleDoneToggle, randomTable, words, progress }: { state: State1, handleDoneToggle: Function, progress: { currentProgress: number, setCurrentProgress: Function }, randomTable: number[], words: Word[] }) {
    const { currentProgress, setCurrentProgress } = progress
    const nextCurrentProgress = words[randomTable[currentProgress + 1]] ? currentProgress + 1 : 0

    const [bias, setBias] = useState<number>(0)
    const currentWord = (currentProgress + bias) % 2 === 0 ? words[randomTable[currentProgress]] : words[randomTable[nextCurrentProgress]]
    const nextWord = (currentProgress + bias) % 2 === 1 ? words[randomTable[currentProgress]] : words[randomTable[nextCurrentProgress]]

    const toNext = (b: number) => {
        setCurrentProgress(currentProgress + b)
    }
    console.log(currentProgress)

    useEffect(() => {
        if (!currentWord) {
            setCurrentProgress(0)
        }
    }, [currentWord])

    if (!currentWord) {
        return null
    }

    return (
        <div className=" pointer-events-none pb-16 overflow-hidden card-area left-0 right-0 top-0 bottom-0 absolute flex flex-col items-center z-20 bg-slate-100 bg-opacity-5">
            <Card state={state} chinese={nextWord.chinese} english={nextWord.english} done={!!nextWord.done} index={randomTable[nextCurrentProgress]} toNext={toNext} handleDoneToggle={handleDoneToggle} back={(currentProgress + bias) % 2 === 0} addBias={() => setBias(bias + 1)} />
            <Card state={state} chinese={currentWord.chinese} english={currentWord.english} done={!!currentWord.done} index={randomTable[currentProgress]} toNext={toNext} handleDoneToggle={handleDoneToggle} back={(currentProgress + bias) % 2 === 1} addBias={() => setBias(bias + 1)} />
        </div>
    )
}

export default CardArea;
