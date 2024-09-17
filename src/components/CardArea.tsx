import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MingcuteSettings6Fill, FluentNextFrame24Filled, FluentPreviousFrame24Filled, FluentPause24Filled, FluentPlay24Filled } from "../utils/Icons";
import { useNotify } from './NotifyContext'

function Card() {
    return (
        <div className="card cursor-move w-[95%] mt-3 rounded-2xl flex items-center justify-center max-w-[440px] h-full min-w-80 z-30 bg-white opacity-100">
            <div className=" absolute mt-[800px] cursor-auto">
                <h1 className=" -top-[420px] relative leading-none text-center text-4xl">apple</h1>
            </div>
        </div>
    )
}

function CardArea({ randomTable, words }: { randomTable: number[], words: Word[] }) {
    return (
        // <div className="card-area left-0 right-0 top-0 absolute flex h-full flex-col items-center z-30 bg-blue-200 opacity-80">
        <div className="card-area left-0 right-0 top-[66px] bottom-[70px] absolute flex flex-col items-center z-30 bg-transparent">
            <Card />
        </div>
    )
}

export default CardArea