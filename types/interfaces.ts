import { ReactElement } from "react";

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

export interface ThemeToggleProps {
    activeTheme: string;
    setActiveTheme: (theme: string) => void;
}