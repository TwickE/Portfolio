"use client";

import FilledButton from "@/components/FilledButton";
import OutlineButton from "@/components/OutlineButton";
import { FaGithub, FaArrowUp, FaGlobe, FaFigma, FaGamepad, FaInfoCircle, FaChevronDown } from 'react-icons/fa';
import { FaSliders } from "react-icons/fa6";
import TechBadge from "@/components/TechBadge";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getProjectCards } from "@/lib/actions/projects.actions";
import { ProjectCardProps, ProjectCardType, ProjectCardImage, ProjectCardLink, ProjectCardTechBadge, TechBadgeType } from "@/types/interfaces";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getTechBadgesOrderedByName } from "@/lib/actions/techBadges.actions";

const NUMBER_OF_SKELETON_PROJECTS = 4;
const NUMBER_OF_SKELETON_TECH_BADGES = 5;

const ProjectsSection = ({ backgroundColor, limitQuery }: { backgroundColor: string, limitQuery: boolean }) => {
    // State to store if the project cards are loading
    const [isLoading, setIsLoading] = useState(true);
    // State to store the project cards
    const [projectCards, setProjectCards] = useState<ProjectCardType[]>([]);
    // State to store the tech badges
    const [techBadges, setTechBadges] = useState<Record<string, TechBadgeType>>({});

    // State to store the filtered projects
    const [filteredProjects, setFilteredProjects] = useState<ProjectCardType[]>([]);

    // State to store the number of results
    const [numberOfResults, setNumberOfResults] = useState(0);

    // State variables for sorting order and filters
    const [sortingOrderFilter, setSortingOrderFilter] = useState<string>("relevance");
    const [linkFilters, setLinkFilters] = useState<string[]>([]);
    const [techBadgeFilters, setTechBadgeFilters] = useState<string[]>([]);

    // Fetches the project cards when the component mounts
    useEffect(() => {
        const fetchProjectCards = async () => {
            setIsLoading(true);
            try {
                // Fetch both techBadgesData and projectsData in parallel
                const [techBadgesData, projectsData] = await Promise.all([
                    getTechBadgesOrderedByName(),
                    getProjectCards({ all: !limitQuery })
                ]);

                if (techBadgesData) {
                    // Set the tech badges state
                    setTechBadges(
                        techBadgesData.reduce((acc, techBadge) => {
                            acc[techBadge.$id] = techBadge;
                            return acc;
                        }, {} as Record<string, TechBadgeType>)
                    );
                }

                if (projectsData) {
                    // Process the data to parse stringified fields
                    const processedData = projectsData.map(card => {
                        // Create a new object to avoid mutating the original
                        return {
                            ...card,
                            // Parse the images JSON string to an array of image objects
                            images: typeof card.images === 'string'
                                ? JSON.parse(card.images)
                                : card.images,
                            // Parse the links JSON string to an array of link objects
                            links: typeof card.links === 'string'
                                ? JSON.parse(card.links)
                                : card.links,
                        };
                    });

                    setProjectCards(processedData);

                    // Initialize filtered projects with all projects
                    setFilteredProjects(processedData);
                    setNumberOfResults(processedData.length);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjectCards();
    }, [limitQuery]);

    // Apply filters whenever filter values change or project cards change
    useEffect(() => {
        if (projectCards.length === 0) return;

        // Create a copy of the project cards to filter
        let filtered = [...projectCards];

        // 1. Apply link filters
        if (linkFilters.length > 0) {
            filtered = filtered.filter(project =>
                project.links.some((link: ProjectCardLink) =>
                    linkFilters.includes(link.text.toLowerCase())
                )
            );
        }

        // 2. Apply tech badge filters
        if (techBadgeFilters.length > 0) {
            filtered = filtered.filter(project =>
                project.techBadges.some((badge: ProjectCardTechBadge) =>
                    techBadgeFilters.includes(badge.$id)
                )
            );
        }

        // 3. Apply sorting
        if (sortingOrderFilter) {
            filtered.sort((a, b) => {
                switch (sortingOrderFilter) {
                    case 'newest':
                        // For newest, larger dates come first (descending)
                        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
                    case 'oldest':
                        // For oldest, smaller dates come first (ascending)
                        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                    case 'relevance':
                    default:
                        // For relevance, lower order values come first (ascending)
                        return (a.order || 999) - (b.order || 999);
                }
            });
        }

        // Update the filtered projects state
        setFilteredProjects(filtered);
        setNumberOfResults(filtered.length);
    }, [projectCards, sortingOrderFilter, linkFilters, techBadgeFilters]);

    // Function to handle sorting order change
    const handleSortingOrderChange = (value: string) => {
        setSortingOrderFilter(value);
    };

    // Function to handle link filter changes
    const handleLinkFilterChange = (linkType: string, isChecked: boolean) => {
        setLinkFilters(prev =>
            isChecked
                ? [...prev, linkType]
                : prev.filter(link => link !== linkType)
        );
    };

    // Function to handle tech badge filter changes
    const handleTechBadgeFilterChange = (badgeId: string, isChecked: boolean) => {
        setTechBadgeFilters(prev =>
            isChecked
                ? [...prev, badgeId]
                : prev.filter(id => id !== badgeId)
        );
    };

    // Function to clear all filters
    const clearAllFilters = () => {
        setLinkFilters([]);
        setTechBadgeFilters([]);
    };

    return (
        <section className={`${backgroundColor} flex flex-col items-center w-full py-12`}>
            <div className="flex flex-col items-center responsive-container">
                <h2 className="section-title mb-4">My Projects</h2>
                <p className="w-[600px] max-xl:w-full text-base text-center mb-12">I bring creative ideas to life through detailed, user-focused solutions. Each project showcases my ability to blend innovation with functionality, delivering results that exceed expectations and drive success.</p>
                {!limitQuery && (
                    <div className="w-full flex items-center justify-end gap-4">
                        {isLoading ? (
                            <div className="flex items-center gap-1 text-base mr-auto">
                                <p>Number of results:</p>
                                <Skeleton className="h-5 w-6 rounded-sm" />
                            </div>
                        ) : (
                            <p className="text-base mr-auto">Number of results: <b className="text-my-primary">{numberOfResults}</b></p>
                        )}
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
                                        {isLoading ? (
                                            <div className="space-y-2">
                                                {Array(NUMBER_OF_SKELETON_TECH_BADGES).fill(0).map((_, index) => (
                                                    <div key={index} className="flex items-center space-x-2">
                                                        <Skeleton className="w-4 h-4 rounded-sm" />
                                                        <Skeleton className="w-25 h-4 rounded-sm" />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="space-y-2 max-h-50 overflow-auto">
                                                {Object.values(techBadges).map((techBadge) => (
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
                )}
                <div className={`${!limitQuery ? 'mt-2' : ''} flex justify-between flex-wrap gap-5`}>
                    {isLoading ? (
                        Array(NUMBER_OF_SKELETON_PROJECTS).fill(0).map((_, index) => (
                            <Skeleton key={index} className="p-10 rounded-3xl w-[650px] h-[750px] max-5xl:w-[560px] max-5xl:p-7 max-4xl:w-[470px] max-4xl:p-5 max-3xl:w-full max-3xl:p-10 max-xl:p-5 max-lg:w-full" />
                        ))
                    ) : (
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
                            />
                        ))
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
        </section>
    )
}

export default ProjectsSection

const ProjectCard = ({ title, startDate, endDate, description, links, techBadges, images, original }: ProjectCardProps) => {
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

    return (
        <>
            <div className="relative flex flex-col items-center bg-my-accent w-[650px] p-10 border border-my-secondary hover:border-my-primary hover:shadow-[0_0_10px] hover:shadow-my-primary transition-all duration-300 rounded-3xl max-5xl:w-[560px] max-5xl:p-7 max-4xl:w-[470px] max-4xl:p-5 max-3xl:w-full max-3xl:p-10 max-xl:p-5 max-lg:w-full">
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
                <p className="mb-7 text-base text-center min-h-[2lh] line-clamp-2 overflow-ellipsis">{description}</p>
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
                        className="object-contain object-center flex-1 max-h-[300px] max-lg:order-1"
                    />
                </div>
            </div>
        </>
    )
}