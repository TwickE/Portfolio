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

export interface AdminSkill {
    $id: string;
    name: string;
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
    placeholder: string;
    inputValue: string;
    onChange?: (value: string) => void;
}

export interface TechBadgeProps {
    imgSrc: string;
    text: string;
}

export interface TechBadgeType {
    $id: string;
    name: string;
    icon: string;
    bucketFileId: string;
    iconFile?: File;
    newTechBadge: boolean;
}

export interface ProjectCardType {
    $id: string;
    title: string;
    startDate: string;
    endDate: string;
    description: string;
    links: any;
    techBadges: any;
    images: any;
    order: number;
    original: boolean;
}

export interface ProjectCardProps {
    title: string;
    startDate: string;
    endDate: string;
    description: string;
    links: any;
    techBadges: any;
    images: any;
    original: boolean;
}