import { ReactElement } from "react";

export interface OutlineButtonProps {
    text?: string;
    ariaLabel?: string;
    leftImg?: ReactElement;
    rightImg?: ReactElement;
    clickFunction: () => void;
    containerClasses?: string;
}