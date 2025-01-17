import React, { useRef } from 'react';
import breaks from 'remark-breaks'

import { Link } from 'react-router-dom';
import PageLayout from './PageLayout';
import ReactMarkdown from 'react-markdown'


function General() {

    return (
        <PageLayout>
            <div className='general px-4 sm:px-16 space-y-3 w-full overflow-y-auto pb-20'>
                <h1 className=' w-full text-center text-2xl mt-3'>General Settings</h1>
                <hr className=' black w-full' />

                <ReactMarkdown remarkPlugins={[breaks]} className=' md'>
                    {`
## 3.0 版預計功能
- 朗讀音色
- 朗讀順序
- 匯出匯入格式
`
                    }
                </ReactMarkdown>
            </div>
        </PageLayout>
    )
}


export default General