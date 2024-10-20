import React, { useEffect, useRef, useState } from "react"
import { MingcuteVolumeLine, MaterialDeleteRounded } from "../utils/Icons";
import App from "../App";

interface WordItemProps {
  word: Word;
  index: number;
  indexP: number;
  isPlaying: boolean
  isTop: boolean
  isFocused: boolean;
  onPlay: Function;
  onChange: (index: number, field: 'english' | 'chinese', value: string) => void;
  onDoneToggle: (index: number) => void;
  onNext: () => void;
  state: State1
}


function WordItem({ onPlay, isPlaying, state, word, index, indexP, isTop, isFocused, onChange, onDoneToggle, onNext }: WordItemProps) {
  const englishRef = useRef<HTMLInputElement>(null);
  const chineseRef = useRef<HTMLInputElement>(null);
  const [showEnglish, setShowEnglish] = useState<boolean>(false);
  const [showChinese, setShowChinese] = useState<boolean>(false);
  const [height, setHeight] = useState(isTop ? "100px" : "48px");
  const [isTopDelay, setIsTopDelay] = useState<boolean>(false);

  useEffect(() => {
    if (isFocused) {
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
      else onNext();
    }
  };

  const handleFocus = (field: 'english' | 'chinese') => {
    if (field === 'english') setShowEnglish(true);
    else setShowChinese(true);
  };


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

      {isTopDelay &&
        <div className=" w-8 flex-grow-0 flex-shrink-0 flex flex-col justify-center space-y-4 mr-3">
          <button><MaterialDeleteRounded className="  text-3xl" /></button>
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
      {!isTopDelay ?
        <div
          onDoubleClick={() => {
            onPlay(index)
            //@ts-ignore
            window.getSelection().removeAllRanges()
          }}
          onMouseEnter={handleMouseLeave}
          onClick={() => onDoneToggle(index)}
          className={`jx-1 
          ${state.editing
              ? (word.selected ? "bg-purple-400 hover:bg-purple-500" : "bg-purple-100 hover:bg-purple-200")
              : (word.done ? "bg-green-400 hover:bg-green-500" : "bg-green-100 hover:bg-green-200")
            }
            w-8 flex-grow-0 flex-shrink-0 cursor-pointer ml-3 ${isPlaying ? " border-2 border-blue-400" : ""} `}
        ></div> :
        <div className=" w-8 flex-grow-0 flex-shrink-0 flex flex-col justify-center space-y-4 ml-3">
          <button><MingcuteVolumeLine className="  text-3xl" /></button>
        </div>
      }

    </div>
  );
}

export default WordItem