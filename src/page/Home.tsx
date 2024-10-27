import React, { useRef } from 'react';

import { Params, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { IcRoundMenuOpenL, IcRoundMenuOpenR, MdiCardsOutline, MaterialChecklistRtl, CarbonSelectWindow, MdiDice5, Fa6SolidFileImport, MaterialDeleteRounded, MaterialLock, MaterialLockOpen, MaterialFileMove, Fa6SolidFileExport, PhSelectionBold, PhSelectionDuotone, PhSelectionInverseDuotone, BxBxsHide, BxBxsShow, MaterialSymbolsEditRounded } from '../utils/Icons'
import { useNotify } from '../context/NotifyContext'
import Sidebar from '../components/Sidebar';
import { StateProvider } from '../context/StateContext';

function Home() {
    const navigate = useNavigate();
    const { notify, popNotify } = useNotify();
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <StateProvider>
            <div className=' flex'>
                <Sidebar></Sidebar>
                <div className='home px-4 sm:px-16 space-y-3 w-full'>
                    <h1 className=' w-full text-center text-2xl mt-3'>Home</h1>
                    <hr className=' black w-full' />

                    <h2 className=' text-xl mt-3'>Introduction</h2>
                    <pre className=' text-wrap'>
                        一個可以自動朗讀單字集的<strong>英文、中文、拼法</strong>並可以設定朗讀的<strong>重複次數、速度、停頓時間</strong>等的工具。<br />
                        現已加入了字卡功能以及標籤管理，目前正在製作同步功能以及測驗模式。
                    </pre>

                    <h2 className=' text-xl mt-3'>Usage</h2>
                    <pre className=' text-wrap'>
                        在左側側欄點擊圖標建立一個單字集，接下來就可以新增單字，上面的按鈕以及其他詳細進階用法請到 <a href="https://github.com/jx06T/ectts_2.0" target="_blank" className=' underline'>github</a> 查看。
                    </pre>
                </div>
            </div>
        </StateProvider>
    )
}


export default Home