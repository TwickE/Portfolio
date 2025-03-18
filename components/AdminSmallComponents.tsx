import { useState, useEffect } from "react";
import { FaFont, FaLink } from "react-icons/fa";
import { AdminInputProps } from "@/types/interfaces";

export const AdminInput = ({ icon, inputValue, onChange }: AdminInputProps) => {
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
        <div className="flex items-center gap-2 ps-[10px] h-[36px] bg-primary rounded-sm ">
            {icon === 'link' && <FaLink size={16} />}
            {icon === 'text' && <FaFont size={16} />}
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={icon === 'link' ? 'Link' : 'Skill Name'}
                className="bg-secondary h-full w-56 ps-2 text-base border border-primary rounded-br-[5px] rounded-tr-[5px] outline-none focus:outline-none focus:ring-0 focus:shadow-none"
            />
        </div>
    );
};