import React, { useRef } from 'react';
import breaks from 'remark-breaks'

import { Link } from 'react-router-dom';
import PageLayout from './PageLayout';
import ReactMarkdown from 'react-markdown'


function SetsManagement() {

    return (
        <PageLayout>
            <div className='sets-management px-4 sm:px-16 space-y-3 w-full overflow-y-auto pb-20'>
                <h1 className=' w-full text-center text-2xl mt-3'>Sets Management</h1>
                <hr className=' black w-full' />

                <ReactMarkdown className=' md'>
                    {`
## 3.0 版預計功能
- 單字集合併
- 單字集分割
- 單字集批量匯出

                    `}
                </ReactMarkdown>
            </div>
        </PageLayout>
    )
}


export default SetsManagement