import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams, Params, useNavigate } from 'react-router-dom';
import { MdiGithub, SolarSiderbarBold } from '../utils/Icons'
import { useNotify } from '../context/NotifyContext'



function Aset({ label = "", path }: { label: string, path: string }) {
    const { popNotify } = useNotify();

    return (
        <div className={` rounded-sm border-b-2 cursor-pointer bg-blue-50 hover:bg-blue-100 relative h-fit text-base flex items-center gap-2 my-[2px] justify-between`}>
            <Link to={`/${path}`} className='h-full p-2 overflow-x-hidden w-full'>{label}</Link>
        </div>
    )
}

function FunSidebar() {
    const allPage: { label: string, path: string }[] = [
        { label: 'Home', path: '' },
        { label: 'Words Sets', path: 'set' },
        { label: 'Profile', path: 'profile' },
        { label: 'General Settings', path: 'general-settings' },
        { label: 'Sets Management', path: 'sets-management' },
        { label: 'Guidance', path: 'guidance' },
        { label: 'Privacy', path: 'privacy' },
        { label: 'Contact Us', path: 'contact' }
    ]

    const [showSidebar, setshowSidebar] = useState<boolean>(false)

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

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollBarY(scrollBarRef.current?.scrollTop || 0)
    };

    return (
        <div ref={sidebarRef} className='sidebar h-full flex z-50'>
            <div className={`bg-blue-50 ${showSidebar ? " w-[16.5rem] px-2 p-1" : "min-w-0 w-0 px-0"} fixed xs:static h-full flex flex-col rounded-md transition-all duration-300 ease-in-out`}>
                <div className=' h-8 flex mt-1 items-center justify-between'>
                    <SolarSiderbarBold className=' cursor-pointer text-3xl' onClick={() => setshowSidebar(!showSidebar)} />
                    {/* <MaterialAddToPhotos className=' cursor-pointer text-3xl mr-1' onClick={handleAdd} /> */}
                </div>

                <hr className=' my-1'></hr>

                <div ref={scrollBarRef} onScroll={handleScroll} className={` jx-8 ${showSidebar ? "overflow-y-auto" : "overflow-y-hidden"} flex-auto space-y-2`}>
                    {allPage.map((page) => <Aset key={page.path} label={page.label} path={page.path} />)}
                </div>

                {showSidebar && <div className=' z-30 mt-1 h-10 p-1 flex items-center'>
                    <a href='https://github.com/jx06T/ectts_2.0' target='_blank'>
                        <MdiGithub className=' text-3xl' />
                    </a>
                    <span className='ml-2 text-xs text-slate-300'>
                        2.2.3 - jx06T
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

export default FunSidebar