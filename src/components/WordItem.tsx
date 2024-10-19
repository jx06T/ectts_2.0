import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Word {
  english: string;
  chinese: string;
  selected?: boolean;
  done?: boolean;
}

interface AnimatedWordProps {
  word: Word;
  index: number;
  indexP: number;
  isTop: boolean;
  isFocused: boolean;
  onNext: Function;
  state: State1;
  onChange: (index: number, field: 'english' | 'chinese', value: string) => void;
  onDoneToggle: (index: number) => void;
  onPlay: (index: number) => void;
  isPlaying: boolean;
}

interface ActionButtonProps {
  state: State1;
  word: Word;
  isPlaying: boolean;
  onPlay: () => void;
  onDoneToggle: () => void;
  handleMouseLeave: () => void;
}

const AnimatedWord: React.FC<AnimatedWordProps> = ({ word, index, indexP, isTop, state, onChange, onDoneToggle, onPlay, isPlaying }) => {
  const [showEnglish, setShowEnglish] = useState(false);
  const [showChinese, setShowChinese] = useState(false);
  const englishRef = useRef<HTMLInputElement>(null);
  const chineseRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'english' | 'chinese') => {
    if (e.key === 'Enter') {
      if (field === 'english') {
        chineseRef.current?.focus();
      } else {
        englishRef.current?.focus();
      }
    }
  };

  const handleMouseLeave = () => {
    setShowEnglish(false);
    setShowChinese(false);
  };

  const commonInputProps = (field: 'english' | 'chinese') => ({
    value: state[`show${field.charAt(0).toUpperCase() as 'E' | 'C'}`] || (field === 'english' ? showEnglish : showChinese) ? word[field] : "· · · · ·",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(index, field, e.target.value),
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, field),
    readOnly: state.lock,
    onFocus: () => field === 'english' ? setShowEnglish(true || !state.lock) : setShowChinese(true || !state.lock),
    onBlur: () => field === 'english' ? setShowEnglish(false) : setShowChinese(false),
  });

  return (
    <motion.div
      layout
      // transition={{ duration: 0.3 }}
      transition={{
        layout: { duration: 0.7, type: "spring" },
        height: { duration: 0.7, },
        width: { duration: 0.7, }
      }}
      data-index={indexP}
      className={` overflow-hidden a-word ${isTop ? '-ml-1 -mr-1 sm:-mr-2 sm:-ml-2' : 'flex space-x-3'}`}
      style={{ scrollSnapAlign: 'start' }}
    >
      {isTop ? (
        <div className="jx-6 flex w-full bg-blue-50 rounded-md p-2 space-x-3">
          <div className="flex-grow flex flex-col space-y-2">
            <motion.input
              layout
              ref={englishRef}
              {...commonInputProps('english')}
              className="jx-1 bg-transparent border-b-2 border-blue-900 rounded-none w-full"
            />
            <motion.input
              layout
              ref={chineseRef}
              {...commonInputProps('chinese')}
              className="jx-1 bg-transparent border-b-2 border-blue-900 rounded-none w-full"
            />
          </div>
          <ActionButton
            state={state}
            word={word}
            isPlaying={isPlaying}
            onPlay={() => onPlay(index)}
            onDoneToggle={() => onDoneToggle(index)}
            handleMouseLeave={handleMouseLeave}
          />
        </div>
      ) : (
        <>
          <motion.input
            layout
            ref={englishRef}
            {...commonInputProps('english')}
            className="jx-1 rounded-md bg-blue-50 hover:bg-blue-100 flex-grow flex-shrink min-w-0"
          />
          <motion.input
            layout
            ref={chineseRef}
            {...commonInputProps('chinese')}
            className="jx-1 rounded-md bg-blue-50 hover:bg-blue-100 flex-grow flex-shrink min-w-0"
          />
          <ActionButton
            state={state}
            word={word}
            isPlaying={isPlaying}
            onPlay={() => onPlay(index)}
            onDoneToggle={() => onDoneToggle(index)}
            handleMouseLeave={handleMouseLeave}
          />
        </>
      )}
    </motion.div>
  );
};

const ActionButton: React.FC<ActionButtonProps> = ({ state, word, isPlaying, onPlay, onDoneToggle, handleMouseLeave }) => (
  <motion.div
    onDoubleClick={() => {
      onPlay();
      window.getSelection()?.removeAllRanges();
    }}
    onMouseEnter={handleMouseLeave}
    onClick={onDoneToggle}
    className={`rounded-md flex-shrink-0 jx-1 ${state.editing
      ? word.selected
        ? "bg-purple-400 hover:bg-purple-500"
        : "bg-purple-100 hover:bg-purple-200"
      : word.done
        ? "bg-green-400 hover:bg-green-500"
        : "bg-green-100 hover:bg-green-200"
      } w-7 cursor-pointer ${isPlaying ? "border-2 border-blue-400" : ""}`}
  />
);

export default AnimatedWord;