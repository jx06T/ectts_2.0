import React, { ReactElement, useEffect, useRef } from "react";

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
            {children}
        </StateProvider>
    </div>
}

export default PageLayout