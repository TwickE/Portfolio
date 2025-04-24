"use client";

import FilledButton from "@/components/FilledButton";
import OutlineButton from "@/components/OutlineButton";
import { FaGithub, FaArrowUp, FaGlobe, FaFigma, FaGamepad, FaInfoCircle, FaChevronDown, FaExclamationTriangle } from 'react-icons/fa';
import { FaSliders, FaCircleXmark } from "react-icons/fa6";
import TechBadge from "@/components/TechBadge";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { getProjectCards } from "@/lib/actions/projects.actions";
import { ProjectCardProps, ProjectCardType, ProjectCardImage, ProjectCardLink, ProjectCardTechBadge, TechBadgeType } from "@/types/interfaces";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getTechBadgesOrderedByName } from "@/lib/actions/techBadges.actions";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import { useQueries } from "@tanstack/react-query";
import ErrorCard from "@/components/ErrorCard";

const NUMBER_OF_SKELETON_PROJECTS = 4;
const NUMBER_OF_SKELETON_TECH_BADGES = 5;

const ProjectsSection = ({ backgroundColor, limitQuery }: { backgroundColor: string, limitQuery: boolean }) => {
    // State to store the filtered projects
    const [filteredProjects, setFilteredProjects] = useState<ProjectCardType[]>([]);
    // State to store the number of results
    const [numberOfResults, setNumberOfResults] = useState(0);
    // State variables for sorting order and filters
    const [sortingOrderFilter, setSortingOrderFilter] = useState<string>("relevance");
    const [linkFilters, setLinkFilters] = useState<string[]>([]);
    const [techBadgeFilters, setTechBadgeFilters] = useState<string[]>([]);

    // Fetch tech badges and project cards
    const [
        {
            data: techBadgesData,
            isLoading: isLoadingTechBadges,
            isError: isTechBadgesError
        },
        {
            data: projectCardsData,
            isLoading: isLoadingProjects,
            isError: isProjectsError
        }
    ] = useQueries({
        queries: [
            {
                queryKey: ['techBadges'],
                queryFn: getTechBadgesOrderedByName,
                gcTime: 1000 * 60 * 60 * 12, // Cache for 12 hours
                // Transform data into the desired Record format
                select: (data) => (data as TechBadgeType[] | undefined)?.reduce((acc, techBadge) => {
                    acc[techBadge.$id] = techBadge;
                    return acc;
                }, {} as Record<string, TechBadgeType>) ?? {}, // Provide default empty object
            },
            {
                // Include limitQuery and sortingOrderFilter in the queryKey
                queryKey: ['projectCards', limitQuery, sortingOrderFilter],
                queryFn: () => getProjectCards({
                    all: !limitQuery,
                    sortingOrder: sortingOrderFilter,
                }),
                gcTime: 1000 * 60 * 60 * 12, // Cache for 12 hours
                // Process the data to parse stringified fields
                select: (data) => (data as ProjectCardType[] | undefined)?.map(card => ({
                    ...card,
                    images: typeof card.images === 'string' ? JSON.parse(card.images) : card.images,
                    links: typeof card.links === 'string' ? JSON.parse(card.links) : card.links,
                })) ?? [], // Provide default empty array
            }
        ]
    });

    // Apply filters whenever filter values change or project cards change
    useEffect(() => {
        if (!projectCardsData || projectCardsData.length === 0) {
            setFilteredProjects([]);
            setNumberOfResults(0);
            return;
        }

        // Create a copy of the project cards to filter
        let filtered = [...projectCardsData];

        // Apply link filters
        if (linkFilters.length > 0) {
            filtered = filtered.filter(project =>
                project.links.some((link: ProjectCardLink) =>
                    linkFilters.includes(link.text.toLowerCase())
                )
            );
        }

        // Apply tech badge filters
        if (techBadgeFilters.length > 0) {
            filtered = filtered.filter(project =>
                project.techBadges.some((badge: ProjectCardTechBadge) =>
                    techBadgeFilters.includes(badge.$id)
                )
            );
        }

        // Update the filtered projects state
        setFilteredProjects(filtered);
        setNumberOfResults(filtered.length);
    }, [projectCardsData, linkFilters, techBadgeFilters]);

    // Function to handle sorting order change
    const handleSortingOrderChange = (value: string) => {
        setSortingOrderFilter(value);
    }

    // Function to handle link filter changes
    const handleLinkFilterChange = (linkType: string, isChecked: boolean) => {
        setLinkFilters(prev =>
            isChecked
                ? [...prev, linkType]
                : prev.filter(link => link !== linkType)
        );
    }

    // Function to handle tech badge filter changes
    const handleTechBadgeFilterChange = (badgeId: string, isChecked: boolean) => {
        setTechBadgeFilters(prev =>
            isChecked
                ? [...prev, badgeId]
                : prev.filter(id => id !== badgeId)
        );
    }

    // Function to clear all filters
    const clearAllFilters = () => {
        setLinkFilters([]);
        setTechBadgeFilters([]);
    }

    // Add new states for the image viewer
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [activeImageSrc, setActiveImageSrc] = useState("");
    const [activeImageAlt, setActiveImageAlt] = useState("");

    // Function to open the image viewer with a specific image
    const openImageViewer = (src: string, alt: string) => {
        setActiveImageSrc(src);
        setActiveImageAlt(alt);
        setImageViewerVisible(true);
    }

    // Function to close the image viewer
    const closeImageViewer = () => {
        setImageViewerVisible(false);
    }

    const titleRef = useRef(null);
    const titleVisible = useScrollAnimation(titleRef, 20);

    return (
        <section className={`${backgroundColor} flex flex-col items-center w-full py-12`}>
            <div className="flex flex-col items-center responsive-container">
                <div ref={titleRef} className={`${titleVisible ? 'animate-fade-in-up' : 'opacity-0'} text-center`}>
                    <h2 className="section-title mb-4">My Projects</h2>
                    <p className="w-[600px] max-xl:w-full text-base text-center mb-12">I bring creative ideas to life through detailed, user-focused solutions. Each project showcases my ability to blend innovation with functionality, delivering results that exceed expectations and drive success.</p>
                </div>
                {!limitQuery && (
                    <div className="w-full flex items-center justify-between gap-4 max-lg:flex-col">
                        {isLoadingTechBadges ? (
                            <div className="flex items-center gap-1 text-base">
                                <p>Number of results:</p>
                                <Skeleton className="h-5 w-6 rounded-sm" />
                            </div>
                        ) : (
                            <p className="text-base">Number of results: <b className="text-my-primary">{numberOfResults}</b></p>
                        )}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-base">
                                <p className="max-sm:hidden">Order by:</p>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="primary">
                                            {sortingOrderFilter.charAt(0).toUpperCase() + sortingOrderFilter.slice(1)}
                                            <FaChevronDown color="white" className="!w-2 !h-2 ml-2" size={8} />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="end" className="flex flex-col gap-2 w-auto p-2 text-base">
                                        <RadioGroup value={sortingOrderFilter} onValueChange={handleSortingOrderChange}>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="relevance" id="relevance" />
                                                <Label htmlFor="relevance">Relevance</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="newest" id="newest" />
                                                <Label htmlFor="newest">Newest</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="oldest" id="oldest" />
                                                <Label htmlFor="oldest">Oldest</Label>
                                            </div>
                                        </RadioGroup>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="primary">
                                        <FaSliders />
                                        Filters
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="end" className="w-60">
                                    <div className="grid gap-6">
                                        <div className="space-y-3">
                                            <h4 className="font-medium leading-none">Links</h4>
                                            <div className="space-y-2">
                                                {["Github", "Figma", "Website", "Game"].map((linkType) => (
                                                    <div key={linkType} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={linkType.toLowerCase()}
                                                            checked={linkFilters.includes(linkType.toLowerCase())}
                                                            onCheckedChange={(checked) =>
                                                                handleLinkFilterChange(linkType.toLowerCase(), checked === true)
                                                            }
                                                        />
                                                        <label
                                                            htmlFor={linkType.toLowerCase()}
                                                            className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            {linkType}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="font-medium leading-none">Technologies</h4>
                                            {isLoadingTechBadges ? (
                                                <div className="space-y-2">
                                                    {Array(NUMBER_OF_SKELETON_TECH_BADGES).fill(0).map((_, index) => (
                                                        <div key={index} className="flex items-center space-x-2">
                                                            <Skeleton className="w-4 h-4 rounded-sm" />
                                                            <Skeleton className="w-25 h-4 rounded-sm" />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : isTechBadgesError ? (
                                                <p className="text-sm text-red-500">Error loading Tech Badges</p>
                                            ) : techBadgesData && (
                                                <div className="space-y-2 max-h-50 overflow-auto">
                                                    {Object.values(techBadgesData).map((techBadge) => (
                                                        <div key={techBadge.$id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={techBadge.$id}
                                                                checked={techBadgeFilters.includes(techBadge.$id)}
                                                                onCheckedChange={(checked) =>
                                                                    handleTechBadgeFilterChange(techBadge.$id, checked === true)
                                                                }
                                                            />
                                                            <label
                                                                htmlFor={techBadge.$id}
                                                                className="cursor-pointer text-sm font-medium leading-none flex items-center gap-1"
                                                            >
                                                                <Image
                                                                    src={techBadge.icon}
                                                                    alt={`${techBadge.name} icon`}
                                                                    width={20}
                                                                    height={20}
                                                                    className="object-contain object-center p-0.5"
                                                                />
                                                                {techBadge.name}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            variant='outline'
                                            onClick={clearAllFilters}
                                            disabled={linkFilters.length === 0 && techBadgeFilters.length === 0}
                                        >
                                            Clear Filters
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                )}
                <div className={`${!limitQuery ? 'mt-2' : ''} w-full flex justify-between flex-wrap gap-5`}>
                    {isLoadingProjects ? ( // Checks if the projects are still loading and shows skeletons
                        Array(NUMBER_OF_SKELETON_PROJECTS).fill(0).map((_, index) => (
                            <Skeleton key={index} className="p-10 rounded-3xl w-[650px] h-[750px] max-5xl:w-[560px] max-5xl:p-7 max-4xl:w-[470px] max-4xl:p-5 max-3xl:w-full max-3xl:p-10 max-xl:p-5" />
                        ))
                    ) : isProjectsError ? ( // Show error card if there was an error fetching projects
                        <div className="w-full"><ErrorCard name="Projects" /></div>
                    ) : filteredProjects.length > 0 ? ( // Show projects if loading is done, no error, and projects exist
                        filteredProjects.map((card, index) => (
                            <ProjectCard
                                key={index}
                                title={card.title}
                                startDate={card.startDate}
                                endDate={card.endDate}
                                description={card.description}
                                links={card.links}
                                techBadges={card.techBadges}
                                images={card.images}
                                original={card.original}
                                onImageClick={openImageViewer}
                                index={index}
                            />
                        ))
                    ) : ( // Only show "No projects found" if loading is done, no error, and filteredProjects is empty
                        <div className="bg-my-accent mx-auto my-20 p-8 rounded-2xl border border-my-secondary flex flex-col items-center max-w-md">
                            <FaExclamationTriangle size={40} className="text-my-primary mb-4" />
                            <h3 className="text-2xl font-bold mb-2">No projects found</h3>
                            <p className="text-center text-base mb-6">
                                No projects match your current filter selections.
                                Try adjusting your filters to see more results.
                            </p>
                            <Button
                                variant="primary"
                                onClick={clearAllFilters}
                                className="px-6"
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    )}
                </div>
                {limitQuery && (
                    <Link href="/projects">
                        <FilledButton
                            text="View All Projects"
                            containerClasses='px-8 py-4 mt-8'
                        />
                    </Link>
                )}
            </div>
            <ImageViewer
                src={activeImageSrc}
                alt={activeImageAlt}
                visible={imageViewerVisible}
                onClose={closeImageViewer}
            />
        </section>
    )
}

export default ProjectsSection

const ProjectCard = ({ title, startDate, endDate, description, links, techBadges, images, original, index, onImageClick }: ProjectCardProps & { onImageClick: (src: string, alt: string) => void }) => {
    // State to manage the main image data
    const [mainImageData, setMainImageData] = useState({
        src: images[0].src,
        alt: images[0].alt
    });

    // Reset the main image when the images prop changes
    useEffect(() => {
        // This ensures the state is synchronized with the new props
        setMainImageData({
            src: images[0].src,
            alt: images[0].alt
        });
    }, [images]); // Dependency on images prop

    // Function to select an image from the list and display it in the main image container
    const selectImage = (src: string, alt: string) => {
        setMainImageData({ src, alt });
    }

    const cardRef = useRef(null);
    const cardVisible = useScrollAnimation(cardRef, 200);
    const cardAnimation = index % 2 === 0 ? 'animate-fade-in-left' : 'animate-fade-in-right';

    return (
        <div ref={cardRef} className={cardVisible ? cardAnimation : 'opacity-0'}>
            <div className='relative flex flex-col items-center bg-my-accent h-full w-[650px] p-10 border border-my-secondary hover:border-my-primary hover:shadow-[0_0_10px] hover:shadow-my-primary transition-all duration-300 rounded-3xl max-5xl:w-[560px] max-5xl:p-7 max-4xl:w-[470px] max-4xl:p-5 max-3xl:w-full max-3xl:p-10 max-xl:p-5'>
                {original &&
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="text-my-primary absolute right-4 top-4">
                                <FaInfoCircle size={18} />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>All or part of this project was done with the help of a tutorial</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                }
                <h3 className="text-3xl font-bold mb-8">{title}</h3>
                <span className="text-sm mb-2">{format(startDate, "MMM yyyy")} - {format(endDate, "MMM yyyy")}</span>
                <p className="mb-7 text-base text-center min-h-[2lh] line-clamp-2 overflow-ellipsis max-lg:min-h[3lh] max-lg:line-clamp-3">{description}</p>
                <div className="flex justify-center flex-wrap gap-2 w-full mb-7">
                    {links.map((link: ProjectCardLink, index: number) => (
                        <Link key={index} href={link.url} target="_blank" rel="noopener,noreferrer">
                            <OutlineButton
                                text={link.text}
                                leftImg={
                                    link.text === "Github"
                                        ? <FaGithub size={18} />
                                        : link.text === "Website"
                                            ? <FaGlobe size={18} />
                                            : link.text === "Figma"
                                                ? <FaFigma size={18} />
                                                : <FaGamepad size={18} />
                                }
                                rightImg={<FaArrowUp size={18} className="rotate-45 group-hover:rotate-90 transition-transform duration-300" />}
                                containerClasses="py-2 px-7 group"
                            />
                        </Link>
                    ))}
                </div>
                <div className="flex justify-center flex-wrap gap-2 w-full mb-4">
                    {techBadges.map((badge: ProjectCardTechBadge, index: number) => (
                        <TechBadge
                            key={index}
                            imgSrc={badge.icon}
                            text={badge.name}
                        />
                    ))}
                </div>
                <div className="flex gap-4 w-full mt-auto max-lg:flex-col max-lg:items-center max-lg:gap-2">
                    <div className="w-30 h-[300px] flex flex-col gap-4 overflow-y-auto px-2 max-5xl:w-25 max-4xl:h-60 max-3xl:w-30 max-3xl:h-[300px] max-lg:flex-row max-lg:w-full max-lg:h-25 max-lg:order-2">
                        {images.map((image: ProjectCardImage, index: number) => (
                            <Image
                                key={index}
                                src={image.src}
                                alt={image.alt}
                                width={104}
                                height={58.5}
                                style={{ width: 'auto', height: 'auto' }}
                                className={`${image.src === mainImageData.src
                                    ? 'border-my-primary shadow-[0_0_10px] shadow-my-primary'
                                    : 'border-slate-700 dark:border-slate-400'}
                            object-contain object-center border cursor-pointer`
                                }
                                onClick={() => selectImage(image.src, image.alt)}
                            />
                        ))}
                    </div>
                    <Image
                        src={mainImageData.src}
                        alt={mainImageData.alt}
                        width={300}
                        height={80}
                        style={{ width: 'auto', height: 'auto' }}
                        className="object-contain object-center flex-1 max-h-[300px] max-lg:order-1 cursor-pointer"
                        onClick={() => onImageClick(mainImageData.src, mainImageData.alt)}
                    />
                </div>
            </div>
        </div>
    )
}

export const ImageViewer = ({ src, alt, visible, onClose }: { src: string, alt: string, visible: boolean, onClose: () => void }) => {
    return (
        <>
            {visible && (
                <div onClick={onClose} className="fixed z-50 top-0 left-0 w-full h-full backdrop-blur-xs grid place-items-center">
                    <Button className="fixed right-5 top-5 cursor-pointer p-2 h-8"><FaCircleXmark /></Button>
                    <div className="relative w-[90dvw] h-[90dvh] max-w-[90dvw] max-h-[90dvh]">
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            className="object-contain object-center"
                            quality={100}
                        />
                    </div>
                </div>
            )}
        </>
    )
}