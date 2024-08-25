import React, { useEffect, useRef, useState } from "react"

interface WordItemProps {
  word: Word;
  index: number;
  isFocused: boolean;
  onChange: (index: number, field: 'english' | 'chinese', value: string) => void;
  onDoneToggle: (index: number) => void;
  onNext: () => void;
  state: State1
}


function WordItem({ state, word, index, isFocused, onChange, onDoneToggle, onNext }: WordItemProps) {
  const englishRef = useRef<HTMLInputElement>(null);
  const chineseRef = useRef<HTMLInputElement>(null);
  const [showEnglish, setShowEnglish] = useState(false);
  const [showChinese, setShowChinese] = useState(false);

  useEffect(() => {
    if (isFocused) englishRef.current?.focus();
  }, [isFocused]);

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

  const handleBlur = (field: 'english' | 'chinese') => {
    if (field === 'english') setShowEnglish(false);
    else setShowChinese(false);
  };

  return (
    <div className="flex space-x-3 my-1">
      <input
        ref={englishRef}
        value={state.showE || showEnglish ? word.english : "· · · · ·"}
        onChange={(e) => onChange(index, 'english', e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, 'english')}
        className="jx-1 bg-blue-50 hover:bg-blue-100 w-[40%]"
        onFocus={() => handleFocus('english')}
        onBlur={() => handleBlur('english')}
      />
      <input
        ref={chineseRef}
        value={state.showC || showChinese ? word.chinese : "· · · · ·"}
        onChange={(e) => onChange(index, 'chinese', e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, 'chinese')}
        className="jx-1 bg-blue-50 hover:bg-blue-100 w-[40%]"
        onFocus={() => handleFocus('chinese')}
        onBlur={() => handleBlur('chinese')}
      />
      <div
        onClick={() => onDoneToggle(index)}
        className={`jx-1 ${state.Editing? "bg-red-600 hover:bg-red-700":(word.done ? "bg-blue-300 hover:bg-blue-350" : "bg-blue-50 hover:bg-blue-100")} w-8 cursor-pointer`}
      ></div>
    </div>
  );
}

export default WordItem