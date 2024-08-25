import React, { useEffect, useState } from 'react'
import Aset from './Aset'
import { MdiGithub, SolarSiderbarBold } from '../utils/Icons'

const allSet = [
    { id: "afs", title: "W1ddddddddddddddddddddd" },
    { id: "sef", title: "W2" },
    { id: "fv", title: "W3" },
    { id: "rewg4", title: "W4" },
    { id: "bte", title: "W5" },
    { id: "few5g", title: "W6" },
    { id: "b45", title: "W7" },
    { id: "g5b", title: "W8" },
    { id: "4f", title: "W9" },
    { id: "4v", title: "W10" },
    { id: "4e43t", title: "W11" },
    { id: "vet4", title: "W12" },
    { id: "g5b", title: "W8" },
    { id: "4f", title: "W9" },
    { id: "4v", title: "W10" },
    { id: "4e43t", title: "W11" },
    { id: "vet4", title: "W12" },
    { id: "g5b", title: "W8" },
    { id: "4f", title: "W9" },
    { id: "4v", title: "W10" },
    { id: "4e43t", title: "W11" },
    { id: "vet4", title: "W12" },
]

function Sidebar({ showSidebar, clickCallback }: { showSidebar: boolean, clickCallback: Function }) {

    useEffect(() => {
        setShowSidebarL(showSidebar)
    }, [showSidebar])

    const [showSidebarL, setShowSidebarL] = useState<boolean>(showSidebar)


    return (
        <div className={` bg-blue-50 ${showSidebarL ? "w-48 px-2" : "w-0 px-0"} flex flex-col rounded-md transition-all duration-300 ease-in-out`}>
            <div className=' h-6 flex mt-2 items-center'>
                <SolarSiderbarBold onClick={() => clickCallback(!showSidebarL)} />
            </div>
            <hr className=' my-1'></hr>
            <div className=' overflow-y-auto overflow-x-hidden pr-2 transition-opacity duration-200 ease-in-out'>
                {
                    allSet.map(e => (
                        <Aset key={e.id} title={e.title}></Aset>
                    ))
                }
            </div>
            <div className=' h-6 p-1 flex items-center transition-opacity duration-200 ease-in-out'>
                <a href='https://github.com/jx06T/ectts_2.0' target='_blank'>
                    <MdiGithub />
                </a>
                {showSidebarL && <span className=' ml-2 text-2xs text-slate-300'>
                    2.0.0 - jx06T
                </span>}
            </div>
        </div>
    )

}

export default Sidebar