"use client";

import { AdminSkill, SkillCardProps } from "@/types/interfaces";
import Image from "next/image";
import useHoverSupport from "@/hooks/useHoverSupport";
import { useRef, useState, useEffect } from "react";
import { getSkills } from "@/lib/actions/skills.actions";
import { Skeleton } from "@/components/ui/skeleton";
import useScrollAnimation from "@/hooks/useScrollAnimation";

const NUMBER_OF_SKELETONS = 24;

const SkillsSection = ({ backgroundColor }: { backgroundColor: string }) => {
    // State to store the mouse position
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    // State to store if the mouse is within the section
    const [isMouseInSection, setIsMouseInSection] = useState(false);
    // Ref to the div element
    const sectionRef = useRef<HTMLDivElement>(null);
    // Custom hook to check if the browser supports hover
    const isHoverSupported = useHoverSupport();
    // State to store if the main skills are loading
    const [isLoadingMainSkills, setIsLoadingMainSkills] = useState(true);
    // State to store the main skills
    const [mainSkills, setMainSkills] = useState<AdminSkill[]>([]);
    // State to store if the main skills are loading
    const [isLoadingOtherSkills, setIsLoadingOtherSkills] = useState(true);
    // State to store the main skills
    const [otherSkills, setOtherSkills] = useState<AdminSkill[]>([]);

    // Handle mouse movement within the section
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!sectionRef.current) return;

        const { left, top } = sectionRef.current.getBoundingClientRect();

        setMousePosition({
            x: e.clientX - left,
            y: e.clientY - top
        });
    };

    // Handle mouse entering the section
    const handleMouseEnter = () => {
        setIsMouseInSection(true);
    }

    // Handle mouse leaving the section
    const handleMouseLeave = () => {
        setIsMouseInSection(false);
    }

    // Fetches the main skills when the component mounts
    useEffect(() => {
        const fetchSkills = async () => {
            setIsLoadingMainSkills(true);
            setIsLoadingOtherSkills(true);
            try {
                // Fetch both types of skills in parallel
                const [mainSkillsData, otherSkillsData] = await Promise.all([
                    getSkills({ isMainSkill: true }),
                    getSkills({ isMainSkill: false })
                ]);

                // Update state with the results
                if (mainSkillsData) {
                    setMainSkills(mainSkillsData);
                }

                if (otherSkillsData) {
                    setOtherSkills(otherSkillsData);
                }
            } catch (error) {
                console.error("Failed to fetch skills:", error);
            } finally {
                setIsLoadingMainSkills(false);
                setIsLoadingOtherSkills(false);
            }
        };
        fetchSkills();
    }, []);

    const mainSkillsRef = useRef(null);
    const mainSkillsVisible = useScrollAnimation(mainSkillsRef, 20);
    const otherSkillsRef = useRef(null);
    const otherSkillsVisible = useScrollAnimation(otherSkillsRef, 20);

    return (
        <section className={`${backgroundColor} w-full py-12 overflow-hidden`}>
            <div
                ref={sectionRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative flex flex-col items-center responsive-container"
            >
                {/* Glowing orb that follows the mouse */}
                {isMouseInSection && isHoverSupported && (
                    <span
                        className="absolute pointer-events-none w-[200px] h-[200px] rounded-full bg-my-primary blur-3xl transition-opacity duration-300"
                        style={{
                            left: `${mousePosition.x - 100}px`,
                            top: `${mousePosition.y - 100}px`,
                        }}
                    />
                )}
                <div ref={mainSkillsRef} className={`${mainSkillsVisible ? '!animate-fade-in-up' : 'opacity-0'}`}>
                    <h2 className="section-title">My Main Skills</h2>
                </div>
                <div className="flex gap-6 flex-wrap m-auto w-[calc(140px*8+24px*7)] mx-auto mt-8 max-5xl:w-[calc(140px*7+24px*6)] max-4xl:w-[calc(140px*6+20px*5)] max-4xl:gap-5 max-3xl:w-[calc(140px*5+20px*4)] max-2xl:w-[calc(140px*4+40px*3)] max-2xl:gap-10 max-xl:w-[calc(140px*3+40px*2)] max-lg:w-[calc(140px*2+16px)] max-lg:gap-4">
                    {isLoadingMainSkills ? (
                        Array(NUMBER_OF_SKELETONS).fill(0).map((_, index) => (
                            <Skeleton key={index} className="w-[140px] h-[140px] rounded-3xl" />
                        ))
                    ) : (
                        mainSkills.map((skill) => (
                            <SkillCard
                                key={skill.$id}
                                link={skill.link}
                                image={skill.icon}
                                text={skill.name}
                            />
                        ))
                    )}
                </div>
                <div ref={otherSkillsRef} className={`${otherSkillsVisible ? '!animate-fade-in-up' : 'opacity-0'}`}>
                    <h2 className="section-title mt-12">My Other Skills</h2>
                </div>
                <div className="flex gap-6 flex-wrap m-auto w-[calc(140px*8+24px*7)] mx-auto mt-8 max-5xl:w-[calc(140px*7+24px*6)] max-4xl:w-[calc(140px*6+20px*5)] max-4xl:gap-5 max-3xl:w-[calc(140px*5+20px*4)] max-2xl:w-[calc(140px*4+40px*3)] max-2xl:gap-10 max-xl:w-[calc(140px*3+40px*2)] max-lg:w-[calc(140px*2+16px)] max-lg:gap-4">
                    {isLoadingOtherSkills ? (
                        Array(NUMBER_OF_SKELETONS).fill(0).map((_, index) => (
                            <Skeleton key={index} className="w-[140px] h-[140px] rounded-3xl" />
                        ))
                    ) : (
                        otherSkills.map((skill) => (
                            <SkillCard
                                key={skill.$id}
                                link={skill.link}
                                image={skill.icon}
                                text={skill.name}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}

export default SkillsSection

const SkillCard = ({ link, image, text }: SkillCardProps) => {
    // State to store the transform style
    const [transformStyle, setTransformStyle] = useState("");
    // Ref to the card element
    const itemRef = useRef<HTMLDivElement>(null);
    // Custom hook to check if the browser supports hover
    const isHoverSupported = useHoverSupport();

    // Function to handle the mouse move event
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!itemRef.current) return;

        const { left, top, width, height } = itemRef.current.getBoundingClientRect();

        const relativeX = (e.clientX - left) / width;
        const relativeY = (e.clientY - top) / height;

        const tiltX = (relativeY - 0.5) * 5;
        const tiltY = (relativeX - 0.5) * -5;

        const newTransform = `perspective(150px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.98, 0.98, 0.98)`;

        setTransformStyle(newTransform);
    }

    // Removes the transform style when the mouse leaves the card
    const handleMouseLeave = () => {
        setTransformStyle("");
    }

    const cardVisible = useScrollAnimation(itemRef, 20);

    return (
        <div
            ref={itemRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transform: transformStyle }}
            className={`${cardVisible ? '!animate-flip-in-y' : 'opacity-0'}`}
        >
            <a
                href={link}
                target="_blank"
                className={`${isHoverSupported ? 'border-[rgba(255,255,255,0.2)] hover:border-my-primary hover:shadow-[0_0_10px] hover:shadow-my-primary transition-all duration-300' : 'border-my-primary'} group flex flex-col gap-4 items-center justify-center w-[140px] h-[140px] bg-my-secondary-glass rounded-3xl border backdrop-blur-xs cursor-pointer`}
            >
                <Image
                    src={image}
                    alt={`${text} Logo`}
                    width={60}
                    height={60}
                    className={`${isHoverSupported ? 'grayscale-100 group-hover:grayscale-0 transition-all duration-300' : 'grayscale-0'} object-contain object-center max-w-[60px] max-h-[60px]`}
                />
                <p className={`${isHoverSupported ? 'text-gray-500 group-hover:text-my-primary transition-colors duration-300' : 'text-my-primary'} text-base font-bold`}>{text}</p>
            </a>
        </div>
    )
}