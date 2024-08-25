import React from "react";

function Aset({ title = "" }: { title: string }) {
    return (
        <div className=" rounded-md bg-blue-50 hover:bg-blue-100 h-7 text-xs p-1 flex items-center gap-2 my-[2px] overflow-x-hidden">
            {title}
        </div>
    )
}

export default Aset