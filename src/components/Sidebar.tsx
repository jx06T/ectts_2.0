import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams, Params, useNavigate } from 'react-router-dom';
import { IcRoundDoneOutline, MaterialFileRename, MaterialDeleteRounded, AkarIconsMoreVerticalFill, MaterialAddToPhotos, MdiGithub, SolarSiderbarBold } from '../utils/Icons'
import { useNotify } from '../context/NotifyContext'
import createConfirmDialog from './ConfirmDialog';
import { getRandId } from '../utils/tool';
import { useStateContext } from '../context/StateContext';


function PopupMenu({ isShow, y, id, callback }: { isShow: boolean, y: number, id: string, callback: Function }) {
    const optionRef = useRef<HTMLDivElement>(null)
    const spaceBelow = window.innerHeight;
    const yCss = `${y + (y > spaceBelow - 160 ? -70 : 20)}px`

    useEffect(() => {
        if (optionRef.current) {
            optionRef.current.style.top = yCss
        }
    }, [y, isShow])

    return (
        <>
            {isShow && <div ref={optionRef} className={`shadow-md bg-purple-200 left-60 absolute z-60 rounded-lg p-2 space-y-2`}>
                <button className='option-button2 h-8 items-center justify-start flex w-full cursor-pointer rounded-md hover:bg-purple-300' onClick={() => callback(id, "D")} >
                    <MaterialDeleteRounded className='option-button2 text-3xl text-red-700 mr-2 ' />
                    <span>Delete</span>
                </button>
                <hr></hr>
                <button className='option-button2 h-8 items-center justify-start flex w-full cursor-pointer rounded-md hover:bg-purple-300' onClick={() => callback(id, "R")} >
                    <MaterialFileRename className='option-button2 text-3xl text-blue-700 mr-2 ' />
                    <span>Rename</span>
                </button>
            </div >}
        </>
    )
}

function Aset({ title = "", index, onShowOption, selected, id, rename, handleRename }: { handleRename: Function, rename: boolean, title: string, index: number, onShowOption: Function, selected: boolean, id: string }) {
    const { popNotify } = useNotify();

    const setId = window.location.pathname.slice(1);
    const setRef = useRef<HTMLDivElement>(null)
    const selected2 = selected || setId === id
    const reNamedRef = useRef<HTMLInputElement>(null)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            handleRename(id, reNamedRef.current?.value)
        }
    };

    return (
        <div ref={setRef} className={` cursor-pointer rounded-md ${selected2 ? "bg-blue-50" : "bg-blue-100"} hover:bg-blue-50 relative h-10 text-base flex items-center gap-2 my-[2px] justify-between`}>
            {!rename ?
                <Link onClick={() => popNotify('Switch word set')} to={`/set/${id}`} className='h-full p-2 overflow-x-hidden w-full'>{title}</Link> :
                <input ref={reNamedRef} className=' border-purple-300 outline-none border-b-2 my-1 p-2 bg-transparent' onKeyDown={handleKeyDown} defaultValue={title} type="text" />
            }
            {rename ?
                // <div className=' h-6 w-6 rounded-md mr-1 bg-purple-200 pl-1'></div>
                <IcRoundDoneOutline onClick={() => {
                    handleRename(id, reNamedRef.current?.value)
                }} className=' shadow-sm mr-2 text-lg bg-blue-100 rounded-lg ' />
                :
                <button className='option-button h-8 hover:bg-blue-150 rounded-md mr-[1px]' onClick={() => onShowOption(id, setRef.current?.offsetTop)}>
                    <AkarIconsMoreVerticalFill className='option-button w-5 mr-0 flex-shrink-0' />
                </button>
            }
        </div>
    )
}

function Agroup({ tagName = "", sets, deleteSet, renameSet, scrollBarY }: { scrollBarY: number, renameSet: Function, deleteSet: Function, tagName: string, sets: Aset[] }) {
    const { setId } = useParams<Params>();

    const { popNotify } = useNotify();
    const [showSets, setShowSets] = useState<boolean>(false)

    const [optionY, setOptionY] = useState<number>(-99999)
    const [optionId, setOptionId] = useState<string>("")

    const [renameId, setRenameId] = useState<string>("")

    const handleRename = (id: string, name: string) => {
        setRenameId("")
        renameSet(id, name)
    }

    const handleOptionClick = (id: string, type: "D" | "R"): void => {
        console.log(type)
        if (type === "D") {
            createConfirmDialog(
                `Delete "${sets.find(e => e.id === id)?.title}" ? \nThis operation is irreversible.`,
                () => {
                    deleteSet(id)
                },
                () => {
                    popNotify("Delete operation canceled.");
                },
                "Delete",
                "Cancel"
            );

        } else {
            popNotify(`Rename`)
            setRenameId(id)
        }
    }

    const handleShowOption = (id: string, y: number): void => {
        console.log(id)
        setOptionY(y)
        setOptionId(id)
    }



    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {

            //@ts-ignore
            if (!e.target.classList || !e.target.parentNode.classList) {
                return
            }
            //@ts-ignore
            if (e.target.classList.contains('option-button') || e.target.parentNode.classList.contains('option-button')) {
                return
            }

            //@ts-ignore
            if (!e.target.classList.contains('option-button2') && !e.target.parentNode.classList.contains('option-button2')) {
                setOptionId("")
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

    return (
        <div className={` cursor-pointer w-full bg-blue-100 p-2 my-1 rounded-md ${!showSets ? " h-10" : ""}`}>
            <div onClick={() => setShowSets(!showSets)} className=' flex justify-between'>
                <h1>{tagName}</h1>
                <span className=' w-6' >{showSets ? "▼" : "▶"}</span>
            </div>
            {showSets &&
                <hr className=' my-1'></hr>
            }
            {showSets && <div>
                {sets.map((e, i) =>
                    <Aset handleRename={handleRename} onShowOption={handleShowOption} id={e.id} key={e.id} title={e.title} index={i} selected={setId === e.id} rename={renameId === e.id}></Aset>
                )}
            </div>}

            <PopupMenu callback={handleOptionClick} id={optionId} isShow={optionY !== -99999} y={optionY - scrollBarY} />

        </div>
    )
}

function Sidebar() {
    const { allSet, setAllSet, allSetMap, setAllSetMap } = useStateContext()

    const [showSidebar, setshowSidebar] = useState<boolean>(false)

    const { popNotify } = useNotify();
    const navigate = useNavigate();

    const [scrollBarY, setScrollBarY] = useState<number>(0)
    const scrollBarRef = useRef<HTMLDivElement>(null)

    const sidebarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
                setshowSidebar(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAdd = () => {
        const id = getRandId()
        localStorage.setItem(`set-${id}`, JSON.stringify([{ id: getRandId(), chinese: "", english: "" }]))
        setAllSet((prev: Aset[]) => [{ id: id, title: "", tags: [] }, ...prev])
        setshowSidebar(false)
        setTimeout(() => {
            navigate(`/set/${id}/settings`);
        }, 500);
    }

    const handleDelete = (id: string) => {
        localStorage.removeItem("set-" + id);
        popNotify(`"${allSet.find(e => e.id === id)?.title}" deleted`)
        setAllSet((prev: Aset[]) => prev.filter((Aset: Aset) => (Aset.id !== id)))
    }

    const handleRename = (id: string, name: string) => {
        setAllSet((prev: Aset[]) => prev.map((Aset: Aset) => (Aset.id === id) ? { ...Aset, title: name } : Aset))
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollBarY(scrollBarRef.current?.scrollTop || 0)
    };

    return (
        <div ref={sidebarRef} className='sidebar h-full flex z-50'>
            <div className={`bg-blue-50 ${showSidebar ? " w-[16.5rem] px-2 p-1" : "min-w-0 w-0 px-0"} fixed xs:static h-full flex flex-col rounded-md transition-all duration-300 ease-in-out`}>
                <div className=' h-8 flex mt-1 items-center justify-between'>
                    <SolarSiderbarBold className=' cursor-pointer text-3xl' onClick={() => setshowSidebar(!showSidebar)} />
                    <MaterialAddToPhotos className=' cursor-pointer text-3xl mr-1' onClick={handleAdd} />
                </div>

                <hr className=' my-1'></hr>

                <div ref={scrollBarRef} onScroll={handleScroll} className={` jx-8 ${showSidebar ? "overflow-y-auto" : "overflow-y-hidden"} flex-auto`}>
                    {Object.keys(allSetMap).length > 0 &&
                        Object.keys(allSetMap).map((tag, i) => {
                            const sets = allSet.filter(e => allSetMap[tag].includes(e.id))
                            return <Agroup scrollBarY={scrollBarY} key={tag} renameSet={handleRename} deleteSet={handleDelete} tagName={tag} sets={sets}></Agroup>
                        })
                    }
                    {
                        <Agroup scrollBarY={scrollBarY} key={"All"} renameSet={handleRename} deleteSet={handleDelete} tagName={"All"} sets={allSet}></Agroup>
                    }
                </div>

                {showSidebar && <div className=' z-30 mt-1 h-10 p-1 flex items-center'>
                    <a href='https://github.com/jx06T/ectts_2.0' target='_blank'>
                        <MdiGithub className=' text-3xl' />
                    </a>
                    <span className='ml-2 text-xs text-slate-300'>
                        2.2.5 - jx06T
                    </span>
                </div>}

            </div>

            <div className={` ${showSidebar ? " opacity-0" : " opacity-100 w-11 pl-2 p-1 "} bg-transparent absolute flex flex-col justify-between`}>
                <div className=' h-8 flex mt-1 items-center'>
                    <SolarSiderbarBold className=' text-3xl' onClick={() => setshowSidebar(!showSidebar)} />
                </div>
            </div>

        </div >
    )

}

export default Sidebar