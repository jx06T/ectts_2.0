import React, { useRef } from 'react';

import { Params, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { IcRoundMenuOpenL, IcRoundMenuOpenR, MdiCardsOutline, MaterialChecklistRtl, CarbonSelectWindow, MdiDice5, Fa6SolidFileImport, MaterialDeleteRounded, MaterialLock, MaterialLockOpen, MaterialFileMove, Fa6SolidFileExport, PhSelectionBold, PhSelectionDuotone, PhSelectionInverseDuotone, BxBxsHide, BxBxsShow, MaterialSymbolsEditRounded } from '../utils/Icons'
import { useNotify } from '../context/NotifyContext'
import Sidebar from '../components/Sidebar';

function Home() {
    const navigate = useNavigate();
    const { notify, popNotify } = useNotify();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExportAll = () => {
        let allSet: [Aset] | [] = []

        const allSet0 = localStorage.getItem(`all-set`);
        if (allSet0) {
            allSet = JSON.parse(allSet0 as string);
        } else {
            popNotify("Word list is empty")
            return
        };

        const dataOrigin: [any?] = []
        allSet.forEach(aSet => {
            const aSetData0 = localStorage.getItem(`set-${aSet.id}`);
            let setData = {}

            if (aSetData0) {
                setData = { ...aSet, words: JSON.parse(aSetData0 as string) };
            } else {
                return
            };

            dataOrigin.push(setData)
        })

        const dataStr = JSON.stringify(dataOrigin, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'ectts-all-words.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    const handleImportAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        if (!file) {
            popNotify("error")
            return
        }

        let allSet: [Aset?] = []

        const allSet0 = localStorage.getItem(`all-set`);
        if (allSet0) {
            allSet = JSON.parse(allSet0 as string);
        };

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                const jsonData = JSON.parse(e.target!.result as string);
                jsonData.forEach((aSet: Aset & { words: Word[] }) => {
                    if (!allSet.find((e): e is Aset => e !== undefined && e.id === aSet.id)) {
                        allSet.push({ id: aSet.id, title: aSet.title } as Aset)
                    }
                    localStorage.setItem(`set-${aSet.id}`, JSON.stringify(aSet.words));

                });

                localStorage.setItem(`all-set`, JSON.stringify(allSet));
                navigate(`/${allSet[0]?.id}`)
                popNotify("Imported successfully")

            } catch (error) {
                popNotify(`Error parsing JSON file`)
                console.error('Error parsing JSON file:', error);
            }
        };

        reader.onerror = (error) => {
            popNotify(`Error reading file`)
            console.error('Error reading file:', error);
        };
        reader.readAsText(file);


    }

    const handleImportBtnClick = () => {
        fileInputRef.current!.value = '';
        fileInputRef.current!.click();
    };

    return (
        <Sidebar setId=''></Sidebar>
        // <h1>待修改</h1>
    )
    return (
        <div className='home bg-blue-100 flex flex-col items-center  max-w-[26rem] p-3 rounded-2xl'>
            <pre className=' text-wrap text-center text-xl leading-10'>
                {`歡迎使用這個工具\n請先在左側側欄建立一個單字集\n接下來就可以在中間框框輸入單字\n上面的按鈕以及其他詳細進階用法\n請到`}
                <a href="https://github.com/jx06T/ectts_2.0" target="_blank" className=' underline'>github</a>
                {`查看`}
            </pre>

            <div className='flex flex-col sm:flex-row sm:space-x-6 sm:space-y-0 space-y-6 mt-6 mb-4'>
                <button onClick={handleExportAll} className=' w-40 h-10 bg-green-200 rounded-lg'>匯出全部單字</button>
                <button onClick={handleImportBtnClick} className=' w-40 h-10 bg-green-200 rounded-lg'>匯入全部單字</button>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportAll}
                className="hidden w-0"
            />
        </div>
    )
}


export default Home