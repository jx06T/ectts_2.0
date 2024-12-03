import React, { useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import MainBlock from "../components/MainBlock";
import { StateProvider } from "../context/StateContext";
import SetBlock from "../components/SetBlock";

function WordLayout({ home = false }: { home?: boolean }) {
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
            <Sidebar></Sidebar>
            {!home ?
                <MainBlock></MainBlock> :
                <SetBlock></SetBlock>
            }
        </StateProvider>
    </div>
}

export default WordLayout