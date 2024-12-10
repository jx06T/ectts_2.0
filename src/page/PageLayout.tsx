import React, { ReactElement, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import { StateProvider } from "../context/StateContext";
import FunSidebar from "../components/FunSidebar";

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

    return <div ref={rootRef} className="word-layout flex">
        <StateProvider>
            <FunSidebar></FunSidebar>
            <main className=" w-full overflow-y-auto pb-24">
                {children}
            </main>
            <Footer></Footer>
        </StateProvider>
    </div>
}

export default PageLayout