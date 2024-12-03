import React, { ReactElement, useEffect, useRef } from "react";
import { useStateContext } from '../context/StateContext';
import { Link } from "react-router-dom";

function SetBlock() {
    const { allSet } = useStateContext()

    return (<div className=" grid ml-12">
        < Link to="/" className=' flex  mt-3 cursor-pointer min-w-[70px]' >
            <div className=' w-7 h-7 mr-1' style={{
                backgroundImage: "url(../../icon.png)",
                backgroundPosition: "center",
                backgroundSize: "contain"
            }}></div>
            <span>ECTTS 2.0</span>
        </Link>
        
        {allSet.slice(0, Math.min(6, allSet.length)).map(aSet => (
            <div className=" w-60 h-60 bg-blue-50 rounded-md" key={aSet.id}>
                <h1 className=" w-full text-center text-2xl mt-2">{aSet.title}</h1>

            </div>
        ))}
    </div>)
}

export default SetBlock