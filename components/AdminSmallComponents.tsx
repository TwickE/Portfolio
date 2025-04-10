import { useState, useEffect } from "react";
import { FaFont, FaLink, FaCalendarAlt, FaGithub, FaGlobe, FaFigma, FaGamepad, FaChevronDown, FaInfoCircle, FaSearch, FaBan, FaGraduationCap, FaBriefcase } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PiCertificateFill } from "react-icons/pi";
import { AdminCheckBoxProps, AdminDatePickerProps, AdminDropDownProps, AdminInputProps, AdminLinkProps, TechBadgeType } from "@/types/interfaces";
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
import { getTechBadgesByName } from "@/lib/actions/techBadges.actions";
import Image from "next/image";

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
            {icon === 'date' && <FaCalendarAlt color="white" size={16} />}
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
                        {selectedLinkType === "NoLink" && <FaBan color="red" size={16} />}
                        {selectedLinkType === "Github" && <FaGithub color="white" size={16} />}
                        {selectedLinkType === "Website" && <FaGlobe color="white" size={16} />}
                        {selectedLinkType === "Figma" && <FaFigma color="white" size={16} />}
                        {selectedLinkType === "Game" && <FaGamepad color="white" size={16} />}
                        <FaChevronDown color="white" size={8} />
                    </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="flex flex-col gap-2 w-auto p-2 text-base">
                    <button
                        className={`${selectedLinkType === "Github" ? "bg-my-primary text-white" : "hover:bg-my-secondary/50"} flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition-colors duration-200`}
                        onClick={() => handleLinkTypeChange("Github")}
                    >
                        <FaGithub />
                        Github
                    </button>
                    <button
                        className={`${selectedLinkType === "Website" ? "bg-my-primary text-white" : "hover:bg-my-secondary/50"} flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition-colors duration-200`}
                        onClick={() => handleLinkTypeChange("Website")}
                    >
                        <FaGlobe />
                        Website
                    </button>
                    <button
                        className={`${selectedLinkType === "Figma" ? "bg-my-primary text-white" : "hover:bg-my-secondary/50"} flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition-colors duration-200`}
                        onClick={() => handleLinkTypeChange("Figma")}
                    >
                        <FaFigma />
                        Figma
                    </button>
                    <button
                        className={`${selectedLinkType === "Game" ? "bg-my-primary text-white" : "hover:bg-my-secondary/50"} flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition-colors duration-200`}
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

export const AdminSearch = ({ onTechBadgeSelect }: { onTechBadgeSelect: (techBadge: TechBadgeType) => void }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<TechBadgeType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Debounce search to avoid too many requests
    useEffect(() => {
        const searchTimer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsLoading(true);
                try {
                    const data = await getTechBadgesByName(query);
                    setResults(data || []);
                    setIsOpen(true);
                } catch (error) {
                    console.error("Error searching tech badges:", error);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(searchTimer);
    }, [query]);

    const handleSelectTechBadge = (techBadge: TechBadgeType) => {
        onTechBadgeSelect(techBadge);
        setQuery("");
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <div className="relative flex items-center gap-2 ps-[10px] h-[36px] bg-my-primary rounded-sm">
                <FaSearch color="white" size={16} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for Tech Badges"
                    className="bg-secondary h-full w-56 ps-2 text-base border border-my-primary rounded-br-[5px] rounded-tr-[5px] outline-none focus:outline-none focus:ring-0 focus:shadow-none"
                />
            </div>
            {isOpen && (
                <div className="text-base absolute mt-1 bg-secondary border border-my-primary rounded-md shadow-lg w-full max-h-60 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex gap-1 items-center p-2">
                            <AiOutlineLoading3Quarters className="animate-spin" />
                            Loading...
                        </div>
                    ) : results.length > 0 ? (
                        <ul>
                            {results.map((techBadge) => (
                                <li key={techBadge.$id} className="flex items-center gap-1 p-2">
                                    <Image
                                        src={techBadge.icon}
                                        alt={techBadge.name}
                                        width={24}
                                        height={24}
                                        className="object-contain object-center max-w-[24px] max-h-[24px]"
                                    />
                                    <p className="max-w-[163px] truncate">{techBadge.name}</p>
                                    <Button
                                        className="ml-auto"
                                        variant="primary"
                                        onClick={() => handleSelectTechBadge(techBadge)}
                                    >
                                        Add
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ) : query.length >= 2 ? (
                        <div className="p-2">No tech badges found</div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export const AdminDropDown = ({ selectedValue, type, onChange }: AdminDropDownProps) => {
    const [selected, setSelected] = useState(selectedValue || "");

    // When the selection changes, update the parent component
    const handleSelectionChange = (newValue: string) => {
        setSelected(newValue);
        if (onChange) onChange(newValue);
    };

    // Update local state when selectedValue prop changes
    useEffect(() => {
        if (selectedValue !== selected) {
            setSelected(selectedValue || "");
        }
    }, [selectedValue, selected]);

    return (
        type === "education" ? (
            <Popover>
                <PopoverTrigger asChild>
                    <Button className="cursor-pointer text-white flex items-center gap-2 min-w-32" variant="primary">
                        {selected === "school" && (
                            <>
                                <FaGraduationCap size={16} />
                                School
                            </>
                        )}
                        {selected === "course" && (
                            <>
                                <PiCertificateFill size={16} />
                                Course
                            </>
                        )}
                        <FaChevronDown color="white" className="!w-2 !h-2" size={8} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="flex flex-col gap-2 w-auto p-2 text-base">
                    <button
                        className={`${selected === "school" ? "bg-my-primary text-white" : "hover:bg-my-secondary/50"} flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition-colors duration-200`}
                        onClick={() => handleSelectionChange("school")}
                    >
                        <FaGraduationCap />
                        School
                    </button>
                    <button
                        className={`${selected === "course" ? "bg-my-primary text-white" : "hover:bg-my-secondary/50"} flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition-colors duration-200`}
                        onClick={() => handleSelectionChange("course")}
                    >
                        <PiCertificateFill />
                        Course
                    </button>
                </PopoverContent>
            </Popover>
        ) : (
            <div className="flex justify-center items-center gap-2 min-w-32 h-[36px] px-[10px] text-sm bg-my-primary rounded-sm">
                <FaBriefcase size={16} />
                Work
            </div>
        )
    )
}