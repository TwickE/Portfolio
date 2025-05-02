import { ReactElement, Dispatch, SetStateAction } from "react";

export interface OutlineButtonProps {
    text?: string;
    ariaLabel?: string;
    leftImg?: ReactElement;
    rightImg?: ReactElement;
    clickFunction?: () => void;
    containerClasses?: string;
}

export interface FilledButtonProps {
    text?: string;
    icon?: ReactElement;
    clickFunction?: () => void;
    containerClasses: string;
    ariaLabel?: string;
    disabled?: boolean;
}

export interface ThemeToggleProps {
    activeTheme: string;
    setActiveTheme: Dispatch<SetStateAction<string>>;
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

export interface DeleteProps {
    id: string;
    fileId: string;
}

export interface AdminInputProps {
    icon: 'link' | 'text' | 'date';
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
    startDate: Date;
    endDate: Date;
    description: string;
    links: ProjectCardLink[];
    techBadges: ProjectCardTechBadge[];
    images: ProjectCardImage[];
    order: number;
    original: boolean;
    new: boolean;
}

export interface ProjectCardDatabase {
    $id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    description: string;
    links: string;
    techBadges: string[];
    images: string;
    order: number;
    original: boolean;
}

export interface ProjectCardProps {
    title: string;
    startDate: Date;
    endDate: Date;
    description: string;
    links: ProjectCardLink[];
    techBadges: ProjectCardTechBadge[];
    images: ProjectCardImage[];
    original: boolean;
    index: number;
}

export interface ProjectCardLink {
    text: string;
    url: string;
}

export interface ProjectCardTechBadge {
    $id: string;
    name: string;
    icon: string;
}

export interface ProjectCardImage {
    src: string;
    alt: string;
}

export interface AdminDatePickerProps {
    placeholder: string;
    inputValue: Date;
    onChange?: (date: Date | undefined) => void;
}

export interface AdminLinkProps {
    linkType: string;
    inputValue: string;
    onChange?: (value: string, linkType: string) => void;
    onRemove?: () => void;
}

export interface AdminCheckBoxProps {
    checked: boolean;
    onChange?: (checked: boolean) => void;
    id?: string;
}

export interface AdminSearchProps {
    onTechBadgeSelect: (techBadge: TechBadgeType) => void;
}

export interface ResumeItemProps {
    $id: string;
    icon: string;
    date: string;
    text1: string;
    text2: string;
    order: number;
    new: boolean;
}

export interface AdminDropDownProps {
    selectedValue: string;
    type: 'education' | 'work';
    onChange?: (value: string) => void;
}

export interface ContactBadgeProps {
    link: string;
    icon: ReactElement;
    title: string;
    text: string;
}

export interface BreadCrumbsProps {
    title: string;
}

export interface AdminHomeData {
    dbTotalMainSkills: number;
    dbLastUpdatedMainSkills: Date;
    dbTotalOtherSkills: number;
    dbLastUpdatedOtherSkills: Date;
    skillsCollectionId: string;
    skillsCollectionLink: string;
    storageTotalSkills: number;
    storageLastUpdatedSkills: Date;
    storageSkillIconsId: string;
    storageSkillsLink: string;

    dbTotalProjects: number;
    dbLastUpdatedProjects: Date;
    projectCardsCollectionId: string;
    projectsCollectionLink: string;

    dbTotalTechBadges: number;
    dbLastUpdatedTechBadges: Date;
    techBadgesCollectionId: string;
    techBadgesCollectionLink: string;
    storageTotalTechBadges: number;
    storageLastUpdatedTechBadges: Date;
    storageTechBadgesIconsId: string;
    storageTechBadgesLink: string;

    dbTotalEducation: number;
    dbLastUpdatedEducation: Date;
    dbTotalWork: number;
    dbLastUpdatedWork: Date;
    resumeCollectionId: string;
    resumeCollectionLink: string;

    dbTotalCV: number;
    dbLastUpdatedCV: Date;
    cvFileCollectionId: string;
    cvFileCollectionLink: string;
    storageTotalCV: number;
    storageLastUpdatedCV: Date;
    storageCVFileId: string;
    storageCVLink: string;
}

export interface DatabaseItemProps {
    adminLink?: string;
    name?: string;
    dbTotal?: number;
    dbLastUpdated?: Date;
    collectionId?: string;
    collectionLink?: string;
}

export interface StorageItemProps {
    name?: string;
    storageTotal?: number;
    storageLastUpdated?: Date;
    storageId?: string;
    storageLink?: string;
}

export interface ChartDataItem {
    collection?: string;
    storage?: string;
    number: number;
    fill: string;
}