import React, { useRef } from 'react';

import { Link } from 'react-router-dom';
import PageLayout from './PageLayout';
import ReactMarkdown from 'react-markdown'


function General() {

    return (
        <PageLayout>
            <div className='general px-4 sm:px-16 space-y-3 w-full overflow-y-scroll pb-20'>
                <h1 className=' w-full text-center text-2xl mt-3'>General</h1>
                <hr className=' black w-full' />

                <h2 className=' text-xl mt-3'>Introduction</h2>
                <ReactMarkdown className=' text-wrap break-words whitespace-pre-line'>
                    General Settings
                </ReactMarkdown>
            </div>
        </PageLayout>
    )
}


export default General