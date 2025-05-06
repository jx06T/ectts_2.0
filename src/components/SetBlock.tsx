import React, { ReactElement, useEffect, useRef } from "react";
import { useStateContext } from '../context/StateContext';
import { Link } from "react-router-dom";
import { getRandId } from '../utils/tool';
import Tag from './Tag';
import { JamChevronCircleRight } from "../utils/Icons";


function SetBlock() {
    const { allSet } = useStateContext()


    const getSetWords = (setId: string): Word[] => {
        const Words0 = localStorage.getItem(`set-${setId}`);
        if (Words0) {
            return JSON.parse(Words0 as string);
        } else {
            return [{ chinese: "Null", english: "Null", id: getRandId() }]
        };

    }
    return (<div className="ml-12 w-full">

        <div className=" flex mt-3  min-w-[70px]">
            <div className=' w-7 h-7 mr-1' style={{
                backgroundImage: "url(../../icon.png)",
                backgroundPosition: "center",
                backgroundSize: "contain"
            }}></div>
            < Link to="/" className='cursor-pointer' >
                <span className=" h-8">ECTTS 2.0</span>
            </Link>
        </div>


        <div className=" w-full-jx">
            <div className=" -ml-12">
                <h2 className=" text-2xl mb-1 mt-3 text-center -ml-6">Commonly used word set</h2>
                <hr className=' black w-full' />
                {allSet.length == 0 ? <div className=" ml-1 mt-2  mr-10">
                    展開側邊欄並點擊加號圖標新增單字集！
                </div> : <div className=" ml-1 mt-2 mr-10">
                    點擊單字集標題進入單字集！展開側邊欄查看更多單字集！
                </div>}
            </div>
        </div>
        <div className=" cardsL w-full h-full mt-6 -ml-6 overflow-y-auto no-y-scrollbar pb-36">
            {allSet.slice(0, Math.min(6, allSet.length)).map(aSet => {
                const words = getSetWords(aSet.id);
                // console.log(words.filter(word => word.done))
                return (
                    <div key={aSet.id} className=" w-72 h-60 bg-blue-50 rounded-md border-0 border-blue-100 hover:bg-blue-100">
                        <Link to={"/set/" + aSet.id} >
                            <h1 className=" w-full text-center text-2xl mt-3 whitespace-nowrap overflow-x-hidden pl-3 truncate">{aSet.title}   <JamChevronCircleRight className=" inline-block -mt-[0.3rem]" /></h1>
                        </Link>
                        <div className=" mx-auto mt-1 w-[90%] rounded-lg h-1 bg-purple-200"></div>
                        <div className=" no-y-scrollbar h-32 mb-2 overflow-y-auto ml-4">{
                            words.map((aWord: Word) => {
                                return <div key={aWord.id}>{aWord.english === '' && aWord.chinese === '' ? "Null" : (aWord.english + '／' + aWord.chinese)}</div>
                            }
                            )
                        }

                        </div>
                        <div className=" flex ml-3">
                            <div className=" w-24 text-left pt-[14px]">✓ {words.filter(word => word.done).length}/{words.length}</div>
                            <div className=' w-full overflow-x-auto flex h-13 py-3 space-x-2'>
                                {aSet.tags.length > 0 &&
                                    aSet.tags.map((e: string) => (
                                        <Tag key={e + getRandId(2)}>{e}</Tag>
                                    ))
                                }
                            </div>
                        </div>
                    </div>)
            })}
        </div>

    </div>)
}

export default SetBlock