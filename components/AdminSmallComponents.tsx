import { useState, useEffect } from "react";
import { FaFont, FaLink, FaCalendarAlt, FaGithub, FaGlobe, FaFigma, FaGamepad, FaChevronDown } from "react-icons/fa";
import { AdminDatePickerProps, AdminInputProps } from "@/types/interfaces";

import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export const AdminInput = ({ icon, placeholder, inputValue, onChange }: AdminInputProps) => {
    const [value, setValue] = useState(inputValue);

    // When the input value changes, update the parent
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (onChange) onChange(newValue);
    };

    // Update local state when input value prop changes
    useEffect(() => {
        setValue(inputValue);
    }, [inputValue]);

    return (
        <div className="flex items-center gap-2 ps-[10px] h-[36px] bg-my-primary rounded-sm">
            {icon === 'link' && <FaLink color="white" size={16} />}
            {icon === 'text' && <FaFont color="white" size={16} />}
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="bg-secondary h-full w-56 ps-2 text-base border border-my-primary rounded-br-[5px] rounded-tr-[5px] outline-none focus:outline-none focus:ring-0 focus:shadow-none"
            />
        </div>
    );
};

export const AdminTextArea = ({ placeholder, inputValue, onChange }: AdminInputProps) => {
    const [value, setValue] = useState(inputValue);

    // When the input value changes, update the parent
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (onChange) onChange(newValue);
    };

    // Update local state when input value prop changes
    useEffect(() => {
        setValue(inputValue);
    }, [inputValue]);

    return (
        <div className="flex items-center gap-2 ps-[10px] row-span-3 bg-my-primary rounded-sm">
            <FaFont color="white" size={16} />
            <textarea
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="resize-none bg-secondary h-full w-56 ps-2 text-base border border-my-primary rounded-br-[5px] rounded-tr-[5px] outline-none focus:outline-none focus:ring-0 focus:shadow-none"
            />
        </div>
    );
}

export const AdminDatePicker = ({ placeholder, inputValue, onChange }: AdminDatePickerProps) => {
    const [date, setDate] = useState<Date | undefined>(inputValue);

    // When the date changes, update the parent component
    const handleChange = (newDate: Date | undefined) => {
        setDate(newDate);
        if (onChange) onChange(newDate);
    };

    // Update local state when inputValue prop changes
    useEffect(() => {
        setDate(inputValue);
    }, [inputValue]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="cursor-pointer flex items-center gap-2 ps-[10px] h-[36px] bg-my-primary rounded-sm">
                    <FaCalendarAlt color="white" size={16} />
                    <span className="flex items-center bg-secondary h-full w-56 ps-2 text-base border border-my-primary rounded-br-[5px] rounded-tr-[5px]">
                        {date ? format(date, "dd/MM/yyyy") : placeholder}
                    </span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleChange}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

export const AdminLinkInput = () => {
    

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="cursor-pointer flex items-center gap-[6px] ps-[10px] h-[36px] bg-my-primary rounded-sm">
                    <FaGithub color="white" size={16} />
                    <FaChevronDown color="white" size={8} />
                </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="flex flex-col gap-2 w-auto p-2 text-base">
                <button className="flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer hover:bg-my-secondary/50 hover:text-white">
                    <FaGithub />
                    Github
                </button>
                <button className="flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer hover:bg-my-secondary/50 hover:text-white">
                    <FaGlobe />
                    Website
                </button>
                <button className="flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer hover:bg-my-secondary/50 hover:text-white">
                    <FaFigma />
                    Figma
                </button>
                <button className="flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer hover:bg-my-secondary/50 hover:text-white">
                    <FaGamepad />
                    Game
                </button>
            </PopoverContent>
        </Popover>
    )
}