import React, { useRef } from 'react';
import breaks from 'remark-breaks'

import { Link } from 'react-router-dom';
import PageLayout from './PageLayout';
import ReactMarkdown from 'react-markdown'


function Contact() {

    return (
        <PageLayout>
            <div className='contact px-4 sm:px-16 space-y-3 w-full overflow-y-auto h-full'>
                <h1 className=' w-full text-center text-2xl mt-3'>Contact Us</h1>
                <hr className=' black w-full' />

                <ReactMarkdown remarkPlugins={[breaks]} className=' md'>
                    {`
## Contact Us
- Instagram：[jx06_t](https://www.instagram.com/jx06_t)
- GitHub：[jx06T](https://github.com/jx06T)
`}
                </ReactMarkdown>
            </div>
        </PageLayout>
    )
}


export default Contact