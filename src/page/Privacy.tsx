import React, { useRef } from 'react';

import { Link } from 'react-router-dom';
import PageLayout from './PageLayout';
import ReactMarkdown from 'react-markdown'


function Privacy() {

    return (
        <PageLayout>
            <div className='privacy px-4 sm:px-16 space-y-3 w-full overflow-y-auto pb-20'>
                <h1 className=' w-full text-center text-2xl mt-3'>Privacy Policy</h1>
                <hr className=' black w-full' />

                <ReactMarkdown className=' md'>
                    {`
## 概述
此工具目前為 **2.0** 版本，使用者在本網站輸入的任何資料皆僅儲存在本地。本網站不會蒐集任何使用者資料。
未來更新至 **3.0** 版本時預計引入雲端功能，此版本會將存放於雲端之資料妥善儲存且不直接與使用者關聯。更新時恕不主動通知此政策之更改。
                    `}
                </ReactMarkdown>
            </div>
        </PageLayout>
    )
}


export default Privacy