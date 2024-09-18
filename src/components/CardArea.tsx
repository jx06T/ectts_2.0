import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MingcuteSettings6Fill, FluentNextFrame24Filled, FluentPreviousFrame24Filled, FluentPause24Filled, FluentPlay24Filled } from "../utils/Icons";
import { useNotify } from './NotifyContext'

function Card({ english, chinese, index = 0, toNext, back = false, handleDoneToggle = () => null }: { handleDoneToggle?: Function, back?: boolean, toNext: Function, english: string, chinese: string, index?: number }) {
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
                handleDoneToggle(index, false)
            } else if (newX > 150) {
                handleDoneToggle(index, true)
                handleMove(1000, 0)
            }
            setIsFlipped(false);

            setTimeout(() => {
                setIsMoving(true)
                handleMove(0, 0)
                toNext()
            }, 200);
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

            overRef.current = false
            handleMove(newX, newY)
        };

        const handleMouseUp = (upEvent: MouseEvent) => {
            const newX = upEvent.clientX - startX;
            const newY = upEvent.clientY - startY;
            if (!overRef.current) {
                setIsFlipped(!isFlipped);
            }

            handleMoveEnd(newX, newY)

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
        overRef.current = false

        const handleTouchMove = (moveEvent: TouchEvent) => {
            const moceTouch = moveEvent.changedTouches[0];

            const newX = moceTouch.clientX - startX;
            const newY = moceTouch.clientY - startY;

            setIsDragging(Math.abs(newX - lastX.current) > 2 || Math.abs(newY - lastY.current) > 2);

            if (Math.abs(newX - lastX.current) > 2 || Math.abs(newY - lastY.current) > 2) {
                overRef.current = true
            }

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
            className={`${action == -1 ? "learning border-2 border-red-500" : (action == 1 ? "got-it border-2 border-green-500" : "")} card pointer-events-auto absolute top-16 bottom-[70px] select-none w-[95%] mt-3 rounded-2xl max-w-[440px] min-w-80 z-20 bg-blues-300 ${back ? "bg-opacity-0" : "bg-opacity-30"} `}
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

function CardArea({ handleDoneToggle, randomTable, words, progress }: { handleDoneToggle: Function, progress: { currentProgress: number, setCurrentProgress: Function }, randomTable: number[], words: Word[] }) {
    const { currentProgress, setCurrentProgress } = progress

    const currentWord = words[randomTable[currentProgress]]
    const nextWord = words[randomTable[currentProgress + 1]] ? words[randomTable[currentProgress + 1]] : words[randomTable[0]]

    const toNext = () => {
        setCurrentProgress(currentProgress + 1)
    }

    if (!currentWord) {
        setCurrentProgress(0)
        return null
    }

    return (
        <div className=" pointer-events-none pb-16 overflow-hidden card-area left-0 right-0 top-0 bottom-0 absolute flex flex-col items-center z-20 bg-slate-100 bg-opacity-5">
            <Card chinese={nextWord.chinese} english={nextWord.english} toNext={toNext} back={true} />
            <Card chinese={currentWord.chinese} english={currentWord.english} index={randomTable[currentProgress]} toNext={toNext} handleDoneToggle={handleDoneToggle} />
        </div>
    )
}

export default CardArea;
