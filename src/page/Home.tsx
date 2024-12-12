import React, { useRef } from 'react';

import { Link } from 'react-router-dom';
import PageLayout from './PageLayout';
import ReactMarkdown from 'react-markdown'


function Home() {

    return (
        <PageLayout>
            <div className='home px-4 sm:px-16 space-y-3 w-full overflow-y-scroll pb-20'>
                <h1 className=' w-full text-center text-2xl mt-3'>Home</h1>
                <hr className=' black w-full' />

                <h2 className=' text-xl mt-3'>Introduction</h2>
                <ReactMarkdown className=' text-wrap break-words whitespace-pre-line'>
                    一個可以自動朗讀單字集的**英文、中文、拼法**並可以設定朗讀的**重複次數、速度、停頓時間**等的工具。
                    現已加入了**字卡功能**以及**標籤管理**，目前正在製作**同步功能**以及**測驗模式**。
                </ReactMarkdown>
            </div>
        </PageLayout>
    )
}


export default Home