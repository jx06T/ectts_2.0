import React, { ReactElement, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import { StateProvider } from "../context/StateContext";
import FunSidebar from "../components/FunSidebar";
import { Link } from 'react-router-dom';

function PageLayout({ children }: { children: ReactElement }) {
    const rootRef = useRef<HTMLInputElement>(null)


    useEffect(() => {
        const handleResize = () => {
            if (rootRef.current) {
                rootRef.current.style.height = `${window.innerHeight}px`;
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <div ref={rootRef} className="word-layout flex w-full relative">
        <StateProvider>
            <FunSidebar></FunSidebar>
            <div className="w-full overflow-y-auto">
                <div className=' mt-[0.25rem] ml-12 flex h-16'>
                    <div className=' w-7 h-7 mr-1 mt-2' style={{
                        backgroundImage: "url(icon.png)",
                        backgroundPosition: "center",
                        backgroundSize: "contain"
                    }}></div>
                    < Link to="/" className=' flex cursor-pointer mt-[8px] min-w-[70px]' >
                        <span>ECTTS 2.0</span>
                    </Link>
                </div>
                <div className="flex flex-col">
                    <main
                        className=" w-full-jx flex-grow  overflow-y-auto"
                        style={{ minHeight: "calc(100vh - 160px)" }}
                    >
                        {children}
                    </main>
                    <Footer></Footer>
                </div>
            </div>
        </StateProvider>
    </div>
}

export default PageLayout