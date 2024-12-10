
import React from "react";

function Tag({ children, handleDelete = null }: { handleDelete?: Function | null, children: string }) {
    return (
        <div className=' px-2 border-2 border-blue-700 rounded-full bg-transparent h-7 whitespace-nowrap'>
            <strong className=' text-blue-700'>#</strong>
            {children}
            {handleDelete &&
                <label onClick={() => handleDelete(children)} className=' ml-1 text-red-800 cursor-pointer'><strong>✕</strong></label>
            }
        </div >
    )
}

export default Tag