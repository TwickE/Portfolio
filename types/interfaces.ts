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

export interface Skill {
    $id: string;
    skillName: string;
    link: string;
    icon: string;
    order: number;
}

export interface AdminSkill {
    $id: string;
    skillName: string;
    link: string;
    icon: string;
    order: number;
    iconFile?: File;
    bucketFileId: string;
    mainSkill: boolean;
    newSkill: boolean;
}

export interface DeleteSkillProps {
    skillId: string;
    fileId: string;
}

export interface AdminInputProps {
    icon: 'link' | 'text';
    inputValue: string;
    onChange?: (value: string) => void;
}

export interface TechBadgeProps {
    imgSrc: string;
    text: string;
}

export interface TechBadgeType {
    $id: string;
    techBadgeName: string;
    icon: string;
    bucketFileId: string;
}