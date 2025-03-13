import { ReactElement, Dispatch, SetStateAction } from "react";

export interface OutlineButtonProps {
    text?: string;
    ariaLabel?: string;
    leftImg?: ReactElement;
    rightImg?: ReactElement;
    clickFunction: () => void;
    containerClasses?: string;
}

export interface FilledButtonProps {
    text?: string;
    icon?: ReactElement;
    clickFunction: () => void;
    containerClasses: string;
    ariaLabel?: string;
}

export type Theme = 'light' | 'dark' | 'system';
export interface ThemeToggleProps {
    activeTheme: Theme;
    setActiveTheme: Dispatch<SetStateAction<Theme>>;
}

export interface SkillCardProps {
    link: string;
    image: string;
    text: string;
}
