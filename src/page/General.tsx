import React, { useEffect, useRef, useState } from 'react';
import breaks from 'remark-breaks'
import { MingcuteVolumeLine } from '../utils/Icons';

import PageLayout from './PageLayout';
import ReactMarkdown from 'react-markdown'
import CustomSelect from '../components/Select';
import useSpeech from '../utils/Speech';

function General() {
    const { voices, speakerE, speakerC, setSpeakerE, setSpeakerC, speakC, speakE } = useSpeech()

    const HandleEToneSelect = (newTone: string) => {
        setSpeakerE(newTone)
    }
    const HandleCToneSelect = (newTone: string) => {
        setSpeakerC(newTone)
    }

    return (
        <PageLayout>
            <div className='general px-4 sm:px-16 space-y-3 w-full overflow-y-auto h-full '>
                <h1 className=' w-full text-center text-2xl mt-3'>General Settings</h1>
                <hr className=' black w-full' />

                <ReactMarkdown remarkPlugins={[breaks]} className=' md'>
                    {`
## 3.0 版預計功能
- 朗讀順序
- 匯出匯入格式
`
                    }
                </ReactMarkdown>
                <div>
                    <h1 className=' w-full text-2xl'>Tone settings</h1>
                    <h2 className=' text-lg'>English
                        <button className=' ml-2 align-text-bottom' onClick={() => speakE("The quick brown fox jumps over the lazy dog")}><MingcuteVolumeLine className=' text-2xl ' /></button>
                    </h2>
                    <h3>{speakerE}</h3>
                    <CustomSelect
                        options={voices.map(e => ({ value: e.name, label: `${e.name} (${e.lang})` }))}
                        placeholder="Select a voice or type your own..."
                        onChange={HandleEToneSelect}
                        initialValue=""
                        maxH={200}
                    />
                    <h2 className=' text-lg'>Chinese
                        <button className=' ml-2 align-text-bottom' onClick={() => speakC("快速的棕色狐狸跳過了懶狗")}><MingcuteVolumeLine className=' text-2xl ' /></button>
                    </h2>
                    <h3>{speakerC}</h3>
                    <CustomSelect
                        options={voices.map(e => ({ value: e.name, label: `${e.name} (${e.lang})` }))}
                        placeholder="Select a voice or type your own..."
                        onChange={HandleCToneSelect}
                        initialValue=""
                        maxH={200}
                    />
                </div>
            </div>
        </PageLayout>
    )
}


export default General