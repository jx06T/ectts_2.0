import React, { useState } from "react";
import { MingcuteSettings6Fill, FluentNextFrame24Filled, FluentPreviousFrame24Filled, FluentPause24Filled, FluentPlay24Filled } from "../utils/Icons";

const initialSettings: Settings = {
    timeWW: 1000,
    timeEE: 1000,
    timeEL: 1000,
    timeLC: 1000,
    speed: 1,
    repeat: 3,
    letter: true,
    chinese: true,
}

interface UI {
    type: "range" | "checkbox",
    min?: number,
    max?: number,
    step?: number,
}

const SettingsUI: Record<string, UI> = {
    timeWW: { type: "range", min: 0, max: 7000, step: 10 },
    timeEE: { type: "range", min: 0, max: 7000, step: 10 },
    timeEL: { type: "range", min: 0, max: 7000, step: 10 },
    timeLC: { type: "range", min: 0, max: 7000, step: 10 },
    speed: { type: "range", min: 0.1, max: 3, step: 0.1 },
    repeat: { type: "range", min: 1, max: 13 },
    letter: { type: "checkbox" },
    chinese: { type: "checkbox" },
}

function PlayArea() {
    const [showSetting, setShowSetting] = useState<boolean>(true)
    const [settings, setSettings] = useState<Settings>(initialSettings);

    const handleChange = (type: string, value: number | boolean): void => {

    }

    return (
        <div className="bottom-2 left-0 right-0 px-2 xs:right-0 absolute flex flex-col items-center z-10">
            <div className={`${showSetting ? "h-[25rem] xs:h-[15rem] s940:h-[13rem]  s1200:h-[10rem]" : "h-[3.6rem]"} shadow-md bg-purple-200 rounded-lg w-full opacity-80 transition-all duration-300 ease-in-out flex flex-col justify-end`}>
                {showSetting && <>
                    <div className='w-full flex flex-wrap justify-center'>{
                        Object.entries(settings).map(([key, value], i) => (
                            <div key={i} className=" my-2 flex min-w-[18.5rem] xs:min-w-[18rem] s940:min-w-[17.5rem]  s1200:min-w-[17rem] space-x-3 mx-3">
                                <span className="w-16">{key}</span>
                                <input onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} type={SettingsUI[key].type} className={" accent-purple-700 " + (SettingsUI[key].type === "range" ? "jx-3 w-36" : "w-5 jx-4")} step={SettingsUI[key].step} max={SettingsUI[key].max} min={SettingsUI[key].min} value={value} />
                                {SettingsUI[key].type === "range" && <span> {value}</span>}
                            </div>
                        ))
                    }</div>
                    <hr />
                </>}

                <div className={` min-[28rem] w-full h-14 py-1 items-center flex justify-center space-x-[7%]`}>
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