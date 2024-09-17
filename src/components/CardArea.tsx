import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MingcuteSettings6Fill, FluentNextFrame24Filled, FluentPreviousFrame24Filled, FluentPause24Filled, FluentPlay24Filled } from "../utils/Icons";
import { useNotify } from './NotifyContext'

function Card() {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [angle, setAngle] = useState<number>(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const lastX = useRef<number>(0)
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (e: React.MouseEvent) => {
        const startX = e.clientX - position.x;
        const startY = e.clientY - position.y;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const newX = moveEvent.clientX - startX;
            const newY = moveEvent.clientY - startY;

            setIsDragging(Math.abs(newX - lastX.current) > 10);
            setPosition({ x: newX, y: newY });
            setAngle(newX * 0.1)
        };

        const handleMouseUp = (upEvent: MouseEvent) => {
            const newX = upEvent.clientX - startX;
            console.log(newX, lastX.current)
            if (Math.abs(newX - lastX.current) < 10) {
                setIsFlipped(!isFlipped);
            }
            lastX.current = newX
            setIsDragging(false);

            cardRef.current!.removeEventListener('mousemove', handleMouseMove);
            cardRef.current!.removeEventListener('mouseup', handleMouseUp);
        };

        cardRef.current!.addEventListener('mousemove', handleMouseMove);
        cardRef.current!.addEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.changedTouches[0];

        const startX = touch.clientX - position.x;
        const startY = touch.clientY - position.y;

        const handleTouchMove = (moveEvent: TouchEvent) => {
            const moceTouch = moveEvent.changedTouches[0];

            const newX = moceTouch.clientX - startX;
            const newY = moceTouch.clientY - startY;

            setIsDragging(Math.abs(newX - lastX.current) > 10);
            setPosition({ x: newX, y: newY });
            setAngle(newX * 0.1)
        };

        const handleTouchEnd = (endEvent: TouchEvent) => {
            const upEvent = endEvent.changedTouches[0];
            const newX = upEvent.clientX - startX;
            lastX.current = newX
            setIsDragging(false);

            cardRef.current!.removeEventListener('touchmove', handleTouchMove);
            cardRef.current!.removeEventListener('touchend', handleTouchEnd);
        };

        cardRef.current!.addEventListener('touchmove', handleTouchMove);
        cardRef.current!.addEventListener('touchend', handleTouchEnd);
    };

    return (
        <div
            ref={cardRef}
            className={`card relative select-none w-[95%] mt-3 rounded-2xl max-w-[440px] h-full min-w-80 z-30 bg-slate-200 bg-opacity-30`}
            style={{
                transform: `translate(${position.x}px, ${position.y}px) rotate(${angle}deg)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                perspective: '100rem'
            }}

            onTouchStart={handleTouchStart}
            onMouseDown={handleDragStart}
        >
            <div
                className={` small-card ${isDragging ? 'dragging' : ''}`}
                style={{
                    transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                    backfaceVisibility: 'hidden',
                }}>
                <h1 className=" select-text leading-none text-center text-4xl">apple</h1>
            </div>
            <div
                className={` small-card ${isDragging ? 'dragging' : ''}`}
                style={{
                    transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                }}>
                <h1 className=" select-text leading-none text-center text-4xl">蘋果</h1>
            </div>
        </div>
    )
}

function CardArea({ randomTable, words }: { randomTable: number[], words: Word[] }) {
    return (
        <div className="card-area left-0 right-0 top-[66px] bottom-[70px] absolute flex flex-col items-center z-30 bg-transparent">
            {/* <FlipCard /> */}
            <Card />
        </div>
    )
}

export default CardArea;