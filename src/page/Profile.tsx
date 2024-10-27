import React, { useRef } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useNotify } from '../context/NotifyContext'
import Sidebar from '../components/Sidebar';
import { StateProvider } from '../context/StateContext';

function Profile() {
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
        <StateProvider>
            <div className=' flex'>
                <Sidebar></Sidebar>
                <div className='profile px-4 sm:px-16 space-y-3 w-full'>
                    <div className=' flex'>
                        <Link to="/" className=' cursor-pointer mt-[13px] min-w-[70px]'>ECTTS 2.0</Link>
                        <h1 className=' w-full text-center text-2xl mt-3'>Profile</h1>
                    </div>
                    <hr className=' black w-full' />

                    <h2 className=' text-xl mt-3'>About you</h2>
                    <pre className=' whitespace-pre-line'>哈哈哈哈哈哈哈啥都沒有</pre>

                    <h2 className=' text-xl mt-3'>Your words</h2>
                    <button onClick={handleExportAll} className=' block underline'>匯出全部單字</button>
                    <button onClick={handleImportBtnClick} className=' block underline'>匯入全部單字</button>

                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImportAll}
                    className="hidden w-0"
                />
            </div>
        </StateProvider>
    )
}


export default Profile