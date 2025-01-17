import React, { useRef } from 'react';
import breaks from 'remark-breaks'

import { Link } from 'react-router-dom';
import PageLayout from './PageLayout';
import ReactMarkdown from 'react-markdown'


function Home() {

    return (
        <PageLayout>
            <div className='home px-4 sm:px-16 space-y-3 w-full overflow-y-auto pb-20'>
                <h1 className=' w-full text-center text-2xl mt-3'>Home</h1>
                <hr className=' black w-full' />

                <ReactMarkdown remarkPlugins={[breaks]}   className=' md'>
                    {`
## Introduction
一個可以自動朗讀單字集的**英文、中文、拼法**並可以設定朗讀的**重複次數、速度、停頓時間**等的工具。  
現已加入了**字卡功能**以及**標籤管理**，目前正在製作**同步功能**以及**測驗模式** 

## 3.0 版本
此專案 3.0 版本開發擱置中，原作者暫時僅處理錯誤修復。歡迎有興趣的開發者提交貢獻。
                    `}
                </ReactMarkdown>
            </div>
        </PageLayout>
    )
}


export default Home