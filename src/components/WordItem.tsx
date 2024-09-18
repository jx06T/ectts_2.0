import React, { useEffect, useRef, useState } from "react"

interface WordItemProps {
  word: Word;
  index: number;
  isPlaying: boolean
  isFocused: boolean;
  onPlay: Function;
  onChange: (index: number, field: 'english' | 'chinese', value: string) => void;
  onDoneToggle: (index: number) => void;
  onNext: () => void;
  state: State1
}


function WordItem({ onPlay, isPlaying, state, word, index, isFocused, onChange, onDoneToggle, onNext }: WordItemProps) {
  const englishRef = useRef<HTMLInputElement>(null);
  const chineseRef = useRef<HTMLInputElement>(null);
  const [showEnglish, setShowEnglish] = useState<boolean>(false);
  const [showChinese, setShowChinese] = useState<boolean>(false);

  useEffect(() => {
    if (isFocused) {
      englishRef.current?.focus();
    }
  }, [isFocused]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'english' | 'chinese') => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (field === 'english') chineseRef.current?.focus();
      else onNext();
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
    <div className="flex space-x-3 my-1">
      <input
        ref={englishRef}
        value={state.showE || showEnglish ? word.english : "· · · · ·"}
        onChange={(e) => onChange(index, 'english', e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, 'english')}
        className="jx-1 bg-blue-50 hover:bg-blue-100 w-[42%]"
        readOnly={state.lock}
        onFocus={() => setShowEnglish(true || !state.lock)}
        onBlur={() => setShowEnglish(false)}
      />

      <input
        ref={chineseRef}
        value={state.showC || showChinese ? word.chinese : "· · · · ·"}
        onChange={(e) => onChange(index, 'chinese', e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, 'chinese')}
        className="jx-1 bg-blue-50 hover:bg-blue-100 w-[42%]"
        readOnly={state.lock}
        onFocus={() => setShowChinese(true || !state.lock)}
        onBlur={() => setShowChinese(false)}
      />

      <div
        onDoubleClick={() => {
          onPlay(index)
          console.log(33)
          //@ts-ignore
          window.getSelection().removeAllRanges()
        }}
        onMouseEnter={handleMouseLeave}
        onClick={() => onDoneToggle(index)}
        // title={state.deleting ? "delete it" : state.editing ? "select it" : "Marked as done"}
        className={`jx-1 ${state.deleting ? "bg-red-400 hover:bg-red-500" : state.editing ? (word.selected ? "bg-purple-400 hover:bg-purple-500" : "bg-purple-100 hover:bg-purple-200") : (word.done ? "bg-green-400 hover:bg-green-500" : "bg-green-100 hover:bg-green-200")} w-8 cursor-pointer ${isPlaying ? " border-2 border-blue-400" : ""} `}
      ></div>
    </div>
  );
}

export default WordItem