import React, { useRef } from 'react';

import { Params, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNotify } from '../context/NotifyContext'
import PageLayout from './PageLayout';
import ReactMarkdown from 'react-markdown'


function Home() {

    return (
        <PageLayout>
            <div className='home px-4 sm:px-16 space-y-3 w-full overflow-y-scroll pb-20'>
                <div className=' ml-8 sm:-ml-4 flex'>
                    < Link to="/" className=' flex cursor-pointer mt-[12px] min-w-[70px]' >
                        <div className=' w-7 h-7 mr-1' style={{
                            backgroundImage: "url(icon.png)",
                            backgroundPosition: "center",
                            backgroundSize: "contain"
                        }}></div>
                        <span>ECTTS 2.0</span>
                    </Link>
                </div>

                <h1 className=' w-full text-center text-2xl mt-3'>Home</h1>
                <hr className=' black w-full' />

                <h2 className=' text-xl mt-3'>Introduction</h2>
                <ReactMarkdown className=' text-wrap break-words whitespace-pre-line'>
                    一個可以自動朗讀單字集的**英文、中文、拼法**並可以設定朗讀的**重複次數、速度、停頓時間**等的工具。
                    現已加入了**字卡功能**以及**標籤管理**，目前正在製作**同步功能**以及**測驗模式**。
                </ReactMarkdown>

                <h2 className=' text-xl mt-3'>Usage</h2>
                <pre className=' text-wrap break-words whitespace-pre-line'>
                    在左側側欄點擊圖標建立一個單字集，接下來就可以新增單字，上面的按鈕以及其他詳細進階用法請到 <a href="https://github.com/jx06T/ectts_2.0" target="_blank" className=' underline'>github</a> 查看。
                </pre>

                <h2 className=' text-xl mt-3'>Other pages</h2>
                <pre className=' text-wrap break-words whitespace-pre-line'>
                    <Link className=' underline' to="/profile">Profile</Link>
                </pre>
            </div>
        </PageLayout>
    )
}


export default Home