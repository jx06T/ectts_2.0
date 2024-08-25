import React from 'react'
import Aset from './Aset'
import { MdiGithub, SolarSiderbarBold } from '../utils/Icons'

function Sidebar(props: any) {
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

    return (
        <div className='main bg-blue-50 w-48 flex flex-col rounded-md p-2 overflow-y-hidden'>
            <div className='h-4'>
                <SolarSiderbarBold />
            </div>
            <hr className='my-1'></hr>
            <div className=' overflow-y-auto relative overflow-x-hidden pr-2'>
                {
                    allSet.map(e => (
                        <Aset key={e.id} title={e.title}></Aset>
                    ))
                }
            </div>
            <div className='h-4'>
                <a href=''>
                    <MdiGithub />
                </a>
            </div>
        </div>
    )
}

export default Sidebar