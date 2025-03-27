import { useState, useEffect } from "react";
import { FaFont, FaLink, FaCalendarAlt, FaGithub, FaGlobe, FaFigma, FaGamepad, FaChevronDown, FaInfoCircle } from "react-icons/fa";
import { AdminCheckBoxProps, AdminDatePickerProps, AdminInputProps, AdminLinkProps } from "@/types/interfaces";
import { Button } from "@/components/ui/button";
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"

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

export const AdminLink = ({ linkType, inputValue, onChange, onRemove }: AdminLinkProps) => {
    const [selectedLinkType, setSelectedLinkType] = useState(linkType);
    const [value, setValue] = useState(inputValue);

    // When the input value changes, update the parent with both the value and link type
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (onChange) onChange(newValue, selectedLinkType);
    };

    // When the link type changes, also notify the parent
    const handleLinkTypeChange = (newLinkType: string) => {
        setSelectedLinkType(newLinkType);
        if (onChange) onChange(value, newLinkType);
    };

    // Update local state when props change
    useEffect(() => {
        setValue(inputValue);
    }, [inputValue]);

    useEffect(() => {
        setSelectedLinkType(linkType);
    }, [linkType]);

    const handleRemoveLink = () => {
        if (onRemove) onRemove();
    };

    return (
        <div className="flex items-center rounded-sm">
            <Popover>
                <PopoverTrigger asChild>
                    <button className="cursor-pointer flex items-center gap-[6px] ps-[10px] pe-2 h-[36px] bg-my-primary rounded-s-sm">
                        {selectedLinkType === "Github" && <FaGithub color="white" size={16} />}
                        {selectedLinkType === "Website" && <FaGlobe color="white" size={16} />}
                        {selectedLinkType === "Figma" && <FaFigma color="white" size={16} />}
                        {selectedLinkType === "Game" && <FaGamepad color="white" size={16} />}
                        <FaChevronDown color="white" size={8} />
                    </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="flex flex-col gap-2 w-auto p-2 text-base">
                    <button
                        className={`${selectedLinkType === "Github" ? "bg-my-primary" : "hover:bg-my-secondary/50"} flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition-colors duration-200`}
                        onClick={() => handleLinkTypeChange("Github")}
                    >
                        <FaGithub />
                        Github
                    </button>
                    <button
                        className={`${selectedLinkType === "Website" ? "bg-my-primary" : "hover:bg-my-secondary/50"} flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition-colors duration-200`}
                        onClick={() => handleLinkTypeChange("Website")}
                    >
                        <FaGlobe />
                        Website
                    </button>
                    <button
                        className={`${selectedLinkType === "Figma" ? "bg-my-primary" : "hover:bg-my-secondary/50"} flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition-colors duration-200`}
                        onClick={() => handleLinkTypeChange("Figma")}
                    >
                        <FaFigma />
                        Figma
                    </button>
                    <button
                        className={`${selectedLinkType === "Game" ? "bg-my-primary" : "hover:bg-my-secondary/50"} flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition-colors duration-200`}
                        onClick={() => handleLinkTypeChange("Game")}
                    >
                        <FaGamepad />
                        Game
                    </button>
                    <hr />
                    <Button variant="destructive" onClick={handleRemoveLink}>Remove Link</Button>
                </PopoverContent>
            </Popover>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={`Enter the URL for ${selectedLinkType}`}
                className="bg-secondary h-full w-[208px] ps-2 text-base border border-my-primary rounded-br-[5px] rounded-tr-[5px] outline-none focus:outline-none focus:ring-0 focus:shadow-none"
            />
        </div>
    )
}

export const AdminCheckBox = ({ checked, onChange, id }: AdminCheckBoxProps) => {
    const [isChecked, setIsChecked] = useState(checked);

    // Handle checkbox changes
    const handleCheckedChange = (checked: boolean) => {
        setIsChecked(checked);
        if (onChange) onChange(checked);
    };

    // Update local state when the checked prop changes
    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    return (
        <div className="flex items-center gap-4">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="text-my-primary">
                        <FaInfoCircle size={18} />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>All or part of this project was done with the help of a tutorial</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <div className="flex items-center gap-2">
                <Checkbox
                    id={id}
                    checked={isChecked}
                    onCheckedChange={handleCheckedChange}
                />
                <label
                    htmlFor={id}
                    className="text-sm cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Original
                </label>
            </div>
        </div>
    )
}