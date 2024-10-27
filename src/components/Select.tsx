import React, { useState, useRef, useEffect } from 'react';
// import { ChevronDown, X } from 'lucide-react';

const CustomSelect = ({
    options = [],
    placeholder = "Select or type...",
    onChange = (value: string) => { },
    initialValue = "",
}: { options: string[], placeholder: string, onChange: Function, initialValue: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(initialValue);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            //@ts-ignore
            if (wrapperRef.current && !wrapperRef.current!.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (inputValue) {
            const filtered = options.filter((option: string) =>
                option.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions(options);
        }
    }, [inputValue, options]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (!isOpen) setIsOpen(true);
    };

    const handleOptionClick = (option: string) => {
        setInputValue(option);
        onChange(option);
        setInputValue("")
        setIsOpen(false);
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            setInputValue("")
            onChange(inputValue);
        }
    };
    return (
        <div ref={wrapperRef} className="relative w-full max-w-xs ">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onKeyDown={handleKeyDown}
                    onChange={handleInputChange}
                    onClick={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className=" outline-none w-full px-4 py-2 border-blue-700 border-2 bg-transparent rounded-full focus:outline-none pr-20"
                />
            </div>

            {isOpen && (
                <div className=" outline-none absolute z-10 w-full mt-1 bg-blue-50 border rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <div
                                key={index}
                                onClick={() => handleOptionClick(option)}
                                className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                            >
                                {option}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-500">
                            No matches found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;