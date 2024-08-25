import React, { useEffect, useState } from 'react'
import { MaterialAddToPhotos, MdiGithub, SolarSiderbarBold } from '../utils/Icons'

const allSet = [
    { id: "a1fs", title: "W1ddddddddddddddddddddd" },
    { id: "s2ef", title: "W2" },
    { id: "fv3", title: "W3" },
    { id: "r4ewg4", title: "W4" },
    { id: "b6te", title: "W5" },
    { id: "f5ew5g", title: "W6" },
    { id: "b475", title: "W7" },
    { id: "g85b9", title: "W8" },
    { id: "4f9", title: "W9" },
    { id: "48v", title: "W10" },
    { id: "4e743t", title: "W11" },
    { id: "ve6t4", title: "W12" },
    { id: "g55b", title: "W8" },
    { id: "4s4sf", title: "W9" },
    { id: "4v3111", title: "W10" },
    { id: "4e3243t", title: "W11" },
    { id: "vet14", title: "W12" },
    { id: "g52b", title: "W8" },
    { id: "46f", title: "W9" },
    { id: "4sddecvte4bfv", title: "W10" },
    { id: "4e444557993t", title: "W11" },
    { id: "vet84", title: "W12" },
]

function Aset({ title = "" }: { title: string }) {
    return (
        <div className=" cursor-pointer rounded-md bg-blue-50 hover:bg-blue-100 h-10 text-base p-1 flex items-center gap-2 my-[2px] overflow-x-hidden">
            {title}
        </div>
    )
}

function Sidebar({ showSidebar = true }: { showSidebar?: boolean }) {
    const [showSidebarL, setShowSidebarL] = useState<boolean>(showSidebar)
    const [isMobile, setIsMobile] = useState<boolean>(window.matchMedia('(max-width: 768px)').matches);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className='sidebar h-full flex'>
            <div className={`bg-blue-50 ${showSidebarL ? "min-w-72 w-72 px-2 p-1" : "min-w-0 w-0 px-0"} fixed xs:static h-full flex flex-col rounded-md transition-all duration-300 ease-in-out overflow-x-hidden`}>
                <div className=' h-8 flex mt-1 items-center justify-between'>
                    <SolarSiderbarBold className=' cursor-pointer text-3xl' onClick={() => setShowSidebarL(!showSidebarL)} />
                    <MaterialAddToPhotos className=' cursor-pointer text-3xl mr-1' />
                </div>
                <hr className=' my-1'></hr>
                <div className={` ${showSidebarL ? "overflow-y-auto" : "overflow-y-hidden"} flex-1 overflow-x-hidden pr-2`}>
                    {
                        allSet.map(e => (
                            <Aset key={e.id} title={e.title}></Aset>
                        ))
                    }
                </div>
                <div className=' mt-1 h-10 p-1 flex items-center'>
                    <a href='https://github.com/jx06T/ectts_2.0' target='_blank'>
                        <MdiGithub className=' text-3xl' />
                    </a>
                    {showSidebarL && <span className=' ml-2 text-xs text-slate-300'>
                        2.0.0 - jx06T
                    </span>}
                </div>
            </div>

            <div className={` ${showSidebarL ? " opacity-0" : " opacity-100 w-11 pl-2 p-1"} bg-transparent absolute flex flex-col justify-between transition-all duration-300 ease-in-out `}>
                {!showSidebarL &&
                    <>
                        <div className=' h-8 flex mt-1 items-center'>
                            <SolarSiderbarBold className=' text-3xl' onClick={() => setShowSidebarL(!showSidebarL)} />
                        </div>
                        <div className=' mt-1 h-10 xs:p-1 bottom-1 flex items-center fixed'>
                            <a href='https://github.com/jx06T/ectts_2.0' target='_blank'>
                                <MdiGithub className=' text-3xl' />
                            </a>
                        </div>
                    </>
                }
            </div>
        </div>
    )

}

export default Sidebar