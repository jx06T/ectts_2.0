import React, { useState } from "react";
import { MingcuteSettings6Fill, FluentNextFrame24Filled, FluentPreviousFrame24Filled, FluentPause24Filled, FluentPlay24Filled } from "../utils/Icons";

function PlayArea() {
    const [showSetting, setShowSetting] = useState<boolean>(true)

    return (
        <div className="bottom-16 left-0 right-0 px-2 xs:right-0 absolute flex flex-col items-center z-10">
            <div className={`${showSetting ? "h-[22rem]" : "h-[4.2rem]"} shadow-md bg-purple-200 rounded-lg w-full opacity-70 transition-all duration-300 ease-in-out flex flex-col justify-end`}>
                {showSetting && <div className={` min-[28rem] w-full h-72 py-2`}>
                </div>}

                <div className={` min-[28rem] w-full h-16 py-2 items-center flex justify-center space-x-[7%]`}>
                    <div className="min-w-8">W2</div>

                    <div className="flex flex-shrink-0 justify-center space-x-1">
                        <button className="js-2">
                            <FluentPreviousFrame24Filled className=" text-3xl" />
                        </button>
                        <button className="js-2">
                            <MingcuteSettings6Fill className=" text-3xl" onClick={() => setShowSetting(!showSetting)} />
                        </button>
                        <button className="js-2">
                            <FluentPause24Filled className=" text-3xl" />
                        </button>
                        <button className="js-2">
                            <FluentNextFrame24Filled className=" text-3xl" />
                        </button>
                    </div>

                    <div className="min-w-8">apple</div>
                </div >
            </div>
        </div>
    )
}

export default PlayArea