import React, { useEffect, useRef, useState } from "react"
import { MingcuteVolumeLine, MaterialDeleteRounded } from "../utils/Icons";
import useSpeech from "../utils/Speech";
import { useNotify } from "../context/NotifyContext";

interface WordItemProps {
  word: Word;
  index: number;
  indexP: number;
  isPlaying: boolean
  isTop: boolean
  isFocused: boolean;
  onPlay: Function;
  onChange: (index: number, field: 'english' | 'chinese', value: string) => void;
  onDoneToggle: (index: number, type?: string) => void;
  onDelete: (index: number) => void;
  onNext: (indexP: number) => void;
  state: StateFormat
}


function WordItem({ onPlay, isPlaying, state, word, index, indexP, isTop, isFocused, onDelete, onChange, onDoneToggle, onNext }: WordItemProps) {
  const englishRef = useRef<HTMLInputElement>(null);
  const chineseRef = useRef<HTMLInputElement>(null);
  const [showEnglish, setShowEnglish] = useState<boolean>(false);
  const [showChinese, setShowChinese] = useState<boolean>(false);
  const [height, setHeight] = useState(isTop ? "100px" : "48px");
  const [isTopDelay, setIsTopDelay] = useState<boolean>(false);
  const { speakE } = useSpeech()
  const { popNotify } = useNotify();


  useEffect(() => {
    if (isFocused && englishRef.current) {
      englishRef.current?.focus();
    }
  }, [isFocused]);

  useEffect(() => {
    setHeight(isTop ? "100px" : "48px");
    setTimeout(() => {
      setIsTopDelay(isTop);
    }, 150);
  }, [isTop]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'english' | 'chinese') => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (field === 'english') chineseRef.current?.focus();
      else onNext(indexP);
    }
  };

  // const handleFocus = (field: 'english' | 'chinese') => {
  //   if (field === 'english') setShowEnglish(true);
  //   else setShowChinese(true);
  // };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1) {
      onDoneToggle(index);
      //@ts-ignore
      window.getSelection().removeAllRanges()
    }
  };

  return (
    <div
      data-index={indexP}
      style={{
        scrollSnapAlign: 'start',
        height: height,
        transition: 'height 0.3s ease-in-out',
        // overflow: 'hidden'
      }}
      className={` a-word flex my-1 ${isTopDelay ? "top" : ""}`}>

      <div className={`w-1 ${!isTop ? " h-[88%] rounded-md" : " h-full"} ${word.done ? " bg-green-300" : " bg-red-300"}`}>

      </div>
      {isTopDelay &&
        <div className=" w-8 flex-grow-0 flex-shrink-0 flex flex-col items-center justify-center space-y-4 mr-2 ml-1">
          <button onClick={() => onDelete(index)}><MaterialDeleteRounded className="  text-3xl text-red-900" /></button>
          <div
            onClick={() => onDoneToggle(index, "done")}
            className={` rounded-md
          ${word.done ? "bg-green-200 hover:bg-green-300" : "bg-red-200 hover:bg-red-300"}
            w-6 h-6 `}
          ></div>
        </div>}

      <div className={` overflow-hidden  flex-grow flex-shrink min-w-0 ${isTopDelay ? " flex flex-col space-y-3" : "flex space-x-3"}`}>
        <input
          ref={englishRef}
          value={state.showE || showEnglish ? word.english : "· · · · ·"}
          onChange={(e) => onChange(index, 'english', e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, 'english')}
          className="jx-1 bg-blue-50 hover:bg-blue-100 w-[50%]"
          readOnly={state.lock}
          onFocus={() => setShowEnglish(true)}
          onBlur={() => setShowEnglish(false)}
        />

        <input
          ref={chineseRef}
          value={state.showC || showChinese ? word.chinese : "· · · · ·"}
          onChange={(e) => onChange(index, 'chinese', e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, 'chinese')}
          className="jx-1 bg-blue-50 hover:bg-blue-100 w-[50%] "
          readOnly={state.lock}
          onFocus={() => setShowChinese(true)}
          onBlur={() => setShowChinese(false)}
        />
      </div>
      <div>
        {isTopDelay &&
          <div className=" mb-3 w-8 flex-grow-0 flex-shrink-0 flex flex-col justify-center space-y-4 ml-3">
            <button onClick={() => {
              speakE(word.english)
            }}><MingcuteVolumeLine className="  text-3xl" /></button>
          </div>
        }
        <div
          onDoubleClick={() => {
            onPlay(indexP)
            //@ts-ignore
            window.getSelection().removeAllRanges()
          }}
          onMouseEnter={handleMouseLeave}
          onClick={() => onDoneToggle(index)}
          className={` rounded-md jx-1 
          ${word.selected ? "bg-purple-300 hover:bg-purple-400" : "bg-purple-50 hover:bg-purple-100"}
          ${isPlaying ? " border-3 border-purple-500" : ""} 
            w-8 flex-grow-0 flex-shrink-0 cursor-pointer ml-3 `}
        ></div>
      </div>

    </div>
  );
}

export default WordItem