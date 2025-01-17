import React, { useRef } from 'react';
import breaks from 'remark-breaks'
import { Link } from 'react-router-dom';
import PageLayout from './PageLayout';
import ReactMarkdown from 'react-markdown'


function Guidance() {

    return (
        <PageLayout>
            <div className='guidance px-4 sm:px-16 space-y-3 w-full overflow-y-auto pb-20'>
                <h1 className=' w-full text-center text-2xl mt-3'>Guidance</h1>
                <hr className=' black w-full' />

                <h2 className=' text-xl mt-3'>Introduction</h2>
                <ReactMarkdown remarkPlugins={[breaks]} className=' md'>
                    {`
## 待辦                    
                    `}
                </ReactMarkdown>
            </div>
        </PageLayout>
    )
}


export default Guidance