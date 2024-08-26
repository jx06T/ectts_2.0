import React, { useEffect, useRef, useState } from 'react'
import { MaterialFileRename, MaterialDeleteRounded, AkarIconsMoreVerticalFill, MaterialAddToPhotos, MdiGithub, SolarSiderbarBold } from '../utils/Icons'
import { useNotify } from './NotifyContext'

const initialAllSet = [
    { id: "a11fs", title: "W1ddddddddddddddddddddd" },
    { id: "s22ef", title: "W2" },
    { id: "fv33", title: "W3" },
    { id: "r44ewg4", title: "W4" },
    { id: "b65te", title: "W5" },
    { id: "f65ew5g", title: "W6" },
    { id: "b4775", title: "W7" },
    { id: "g885b9", title: "W8" },
    { id: "4f99", title: "W9" },
    { id: "408v", title: "W10" },
    { id: "49e743t", title: "W11" },
    { id: "ve68t4", title: "W12" },
    { id: "g575b", title: "W8" },
    { id: "4s64sf", title: "W9" },
    { id: "4v53111", title: "W10" },
    { id: "ve46t4", title: "W12" },
    { id: "g535b", title: "W8" },
    { id: "4s342sf", title: "W9" },
    { id: "4v32111", title: "W10" },
]

function Options({ show, y, index, callback }: { show: boolean, y: number, index: number, callback: Function }) {
    const optionRef = useRef<HTMLDivElement>(null)
    const spaceBelow = window.innerHeight;
    const yCss = `${y + (y > spaceBelow - 160 ? -70 : 20)}px`

    useEffect(() => {
        if (optionRef.current) {
            optionRef.current.style.top = yCss
        }
    }, [y, show])

    return (
        <>
            {show && <div ref={optionRef} className={` w-14 h-[5.4rem] shadow-md bg-purple-200 left-60 absolute z-10 rounded-lg p-2 space-y-2`}>
                <button className='option-button2 h-8 items-center justify-center flex w-full cursor-pointer rounded-md hover:bg-purple-300' onClick={() => callback(index, "D")} >
                    <MaterialDeleteRounded className='option-button2 text-3xl text-red-700 ' />
                </button>
                <button className='option-button2 h-8 items-center justify-center flex w-full cursor-pointer rounded-md hover:bg-purple-300' onClick={() => callback(index, "R")} >
                    <MaterialFileRename className='option-button2 text-3xl text-blue-700 ' />
                </button>
            </div >}
        </>
    )
}

function Aset({ title = "", index, onShowOption, selected }: { title: string, index: number, onShowOption: Function, selected: boolean }) {
    const setRef = useRef<HTMLInputElement>(null)

    return (
        <div ref={setRef} className={` cursor-pointer rounded-md ${selected ? "bg-blue-100" : "bg-blue-50"} hover:bg-blue-100 relative h-10 text-base p-1 flex items-center gap-2 my-[2px] justify-between`}>
            <div className=' overflow-x-hidden'>{title}</div>
            <button className='option-button h-8 hover:bg-blue-150 rounded-md mr-[1px]' onClick={() => onShowOption(selected ? -1 : index, selected ? -99999 : setRef.current?.offsetTop)}>
                <AkarIconsMoreVerticalFill className='option-button w-5 mr-0 flex-shrink-0' />
            </button>
        </div>
    )
}

function Sidebar({ showSidebar0 = true }: { showSidebar0?: boolean }) {
    const [allSet, setAllSet] = useState<Aset[]>(initialAllSet)
    const [optionY, setOptionY] = useState<number>(-99999)
    const [optionIndex, setOptionIndex] = useState<number>(-1)
    const [scrollBarY, setScrollBarYY] = useState<number>(0)
    const [showSidebar, setshowSidebar] = useState<boolean>(showSidebar0)
    const [showReNamed, setShowReNamed] = useState<boolean>(false)
    const scrollBarRef = useRef<HTMLDivElement>(null)
    const reNamedRef = useRef<HTMLInputElement>(null)
    const { notify, popNotify } = useNotify();

    const handleShowOption = (index: number, y: number): void => {
        setOptionY(y)
        setOptionIndex(index)
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollBarYY(scrollBarRef.current?.scrollTop || 0)
    };


    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            //@ts-ignore
            if (e.target.classList.contains('option-button') || e.target.parentNode.classList.contains('option-button')) {
                return
            }
            //@ts-ignore
            if (!e.target.classList.contains('option-button2') && !e.target.parentNode.classList.contains('option-button2')) {
                setOptionIndex(-1)
                setShowReNamed(false)
            }

            setTimeout(() => {
                setOptionY(-99999)
            }, 100);
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOptionClick = (index: number, type: "D" | "R"): void => {
        if (type === "D") {
            popNotify(`${allSet[index].title} deleted`)
            setAllSet(prev => prev.filter((Aset: Aset, i) => (i !== index)))
        } else {
            popNotify(`Enter in the box on the upper left`)
            setShowReNamed(true)
        }
    }

    const handleReNamed = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAllSet(prev => prev.map((Aset: Aset, i) => (i !== optionIndex ? Aset : { ...Aset, title: reNamedRef.current?.value || "" })))
        setShowReNamed(false)
    }

    return (
        <div className='sidebar h-full flex'>
            <div className={`bg-blue-50 ${showSidebar ? " w-[17rem] px-2 p-1" : "min-w-0 w-0 px-0"} fixed xs:static h-full flex flex-col rounded-md transition-all duration-300 ease-in-out overflow-x-hidden`}>
                <div className=' h-8 flex mt-1 items-center justify-between'>
                    <SolarSiderbarBold className=' cursor-pointer text-3xl' onClick={() => setshowSidebar(!showSidebar)} />
                    <MaterialAddToPhotos className=' cursor-pointer text-3xl mr-1' />
                </div>
                
                <hr className=' my-1'></hr>
                
                <div onScroll={handleScroll} ref={scrollBarRef} className={` ${showSidebar ? "overflow-y-auto" : "overflow-y-hidden"} flex-auto overflow-x-hidden pr-2`}>
                    {
                        allSet.map((e, i) => (
                            <Aset onShowOption={handleShowOption} key={e.id} title={e.title} index={i} selected={optionIndex === i}></Aset>
                        ))
                    }
                </div>
                
                <div className=' mt-1 h-10 p-1 flex items-center'>
                    <a href='https://github.com/jx06T/ectts_2.0' target='_blank'>
                        <MdiGithub className=' text-3xl' />
                    </a>
                    {showSidebar && <span className=' ml-2 text-xs text-slate-300'>
                        2.0.0 - jx06T
                    </span>}
                </div>
                
            </div>

            <div className={` ${showSidebar ? " opacity-0" : " opacity-100 w-11 pl-2 p-1"} bg-transparent absolute flex flex-col justify-between transition-all duration-300 ease-in-out `}>
                {!showSidebar &&
                    <>
                        <div className=' h-8 flex mt-1 items-center'>
                            <SolarSiderbarBold className=' text-3xl' onClick={() => setshowSidebar(!showSidebar)} />
                        </div>
                        <div className=' mt-1 h-10 xs:p-1 bottom-1 flex items-center fixed'>
                            <a href='https://github.com/jx06T/ectts_2.0' target='_blank'>
                                <MdiGithub className=' text-3xl' />
                            </a>
                        </div>
                    </>
                }
            </div>
            
            <Options callback={handleOptionClick} index={optionIndex} show={optionY !== -99999} y={optionY - scrollBarY} />
            
            {showReNamed && <div className={`option-button2 w-72 h-10 shadow-md bg-purple-200 left-2 top-16 absolute z-10 rounded-lg p-2 flex`}>
                <input ref={reNamedRef} property='name' defaultValue={optionIndex > 0 ? allSet[optionIndex].title : ""} type="text" className='option-button2 jx-0 border-b-2 border-stone-50 w-full rounded-none' />
                <button onClick={handleReNamed} className=' ml-2 w-6 rounded-lg flex-shrink-0 bg-purple-400 option-button2'>▶</button>
            </div >}
        </div>
    )

}

export default Sidebar