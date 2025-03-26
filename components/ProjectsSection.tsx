"use client";

import FilledButton from "@/components/FilledButton"
import { useRouter } from "next/navigation"
import OutlineButton from "@/components/OutlineButton"
import { FaGithub, FaArrowUp, FaGlobe, FaFigma, FaGamepad, FaInfoCircle } from 'react-icons/fa'
import useOpenLink from "@/hooks/useOpenLink"
import TechBadge from "./TechBadge"
import Image from "next/image"
import { useState, useEffect } from "react";
import { getProjectCards } from "@/lib/actions/file.actions";
import { ProjectCardProps, ProjectCardType } from "@/types/interfaces";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


const ProjectsSection = () => {
    // State to store the project cards
    const [projectCards, setProjectCards] = useState<ProjectCardType[]>([]);

    // Hook to navigate to the projects page
    const router = useRouter();
    const navigateToProjects = () => {
        router.push('/projects');
    };

    // Fetches the project cards when the component mounts
    useEffect(() => {
        const fetchProjectCards = async () => {
            try {
                const data = await getProjectCards();

                if (data) {
                    // Process the data to parse stringified fields
                    const processedData = data.map(card => {
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

                    // Set the state with the processed data
                    setProjectCards(processedData);
                    console.log("Processed project cards:", processedData);
                }
            } catch (error) {
                console.error("Failed to fetch tech badges:", error);
            }
        };
        fetchProjectCards();
    }, []);

    return (
        <section className="flex flex-col items-center w-full py-12">
            <div className="flex flex-col items-center responsive-container">
                <h2 className="section-title mb-4">My Projects</h2>
                <p className="w-[600px] max-xl:w-full text-base text-center">I bring creative ideas to life through detailed, user-focused solutions. Each project showcases my ability to blend innovation with functionality, delivering results that exceed expectations and drive success.</p>
                <div className="flex justify-between flex-wrap mt-12 gap-5">
                    {projectCards.map((card, index) => (
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
                    ))}
                </div>
                <FilledButton
                    text="View All Projects"
                    containerClasses='px-8 py-4 mt-8'
                    clickFunction={navigateToProjects}
                />
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

    // Call the hook once to get the openLink function
    const openLink = useOpenLink();

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
                <span className="text-sm mb-2">{startDate} - {endDate}</span>
                <p className="mb-7 text-base text-center min-h-[2lh] line-clamp-2 overflow-ellipsis">{description}</p>
                <div className="flex justify-center flex-wrap gap-2 w-full mb-7">
                    {links.map((link: any, index: number) => (
                        <OutlineButton
                            key={index}
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
                            clickFunction={() => openLink(link.url)}
                        />
                    ))}
                </div>
                <div className="flex justify-center flex-wrap gap-2 w-full mb-4">
                    {techBadges.map((badge: any, index: number) => (
                        <TechBadge
                            key={index}
                            imgSrc={badge.icon}
                            text={badge.name}
                        />
                    ))}
                </div>
                <div className="flex gap-4 w-full mt-auto max-lg:flex-col max-lg:items-center max-lg:gap-2">
                    <div className="w-30 h-[300px] flex flex-col gap-4 overflow-y-auto px-2 max-5xl:w-25 max-4xl:h-60 max-3xl:w-30 max-3xl:h-[300px] max-lg:flex-row max-lg:w-full max-lg:h-25 max-lg:order-2">
                        {images.map((image: any, index: number) => (
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