import { useRef, useEffect } from 'react'
import { ResumeItemProps } from "@/types/interfaces";
import { FaGraduationCap, FaBriefcase } from "react-icons/fa";
import { PiCertificateFill } from "react-icons/pi";

const ResumeSection = () => {
    const firstBarContainer = useRef<HTMLDivElement>(null);
    const firstBar = useRef<HTMLSpanElement>(null);
    const secondBarContainer = useRef<HTMLDivElement>(null);
    const secondBar = useRef<HTMLSpanElement>(null);

    const calculateBarHeights = () => {
        if (firstBarContainer.current && firstBar.current) {
            let firstBarHeight = 0;
            const firstNumberOfItems = firstBarContainer.current?.children.length || 0;

            for (let i = 0; i < firstNumberOfItems; i++) {
                if (i === 0) {
                    continue; // Skip the first child (the bar itself)
                } else if (i === firstNumberOfItems - 1) {
                    firstBarHeight += 30; // Adds 30px for the last item to align with the dot
                } else {
                    const child = firstBarContainer.current?.children[i] as HTMLElement;
                    firstBarHeight += child.offsetHeight;
                }
            }

            firstBarHeight += ((firstNumberOfItems - 2) * 40); // Add the gap between items
            firstBarHeight -= 30; // Removes 30px for the last item to align with the dot

            firstBar.current.style.height = `${firstBarHeight}px`;
        }

        if (secondBarContainer.current && secondBar.current) {
            let secondBarHeight = 0;
            const secondNumberOfItems = secondBarContainer.current?.children.length || 0;

            for (let i = 0; i < secondNumberOfItems; i++) {
                if (i === 0) {
                    continue; // Skip the first child (the bar itself)
                } else if (i === secondNumberOfItems - 1) {
                    secondBarHeight += 30; // Adds 30px for the last item to align with the dot
                } else {
                    const child = secondBarContainer.current?.children[i] as HTMLElement;
                    secondBarHeight += child.offsetHeight;
                }
            }

            secondBarHeight += ((secondNumberOfItems - 2) * 40); // Add the gap between items
            secondBarHeight -= 30; // Removes 30px for the last item to align with the dot

            secondBar.current.style.height = `${secondBarHeight}px`;
        }
    }

    useEffect(() => {
        // Calculate heights on initial load
        calculateBarHeights();

        // Add event listener for window resize
        window.addEventListener('resize', calculateBarHeights);

        // Cleanup function to remove event listener when component unmounts
        return () => {
            window.removeEventListener('resize', calculateBarHeights);
        };
    }, []); // Empty dependency array means this runs once on mount

    return (
        <section className="bg-my-background-200 flex flex-col items-center w-full py-12">
            <div className="flex flex-col items-center responsive-container">
                <h2 className="section-title mb-8">My Resume</h2>
                <div className='w-full flex items-start gap-5 max-2xl:flex-col'>

                    <div className='flex flex-1/2 flex-col items-center justify-center gap-10 max-2xl:gap-8'>
                        <h3 className='text-3xl font-bold mx-auto max-2xl:mr-auto max-2xl:ml-0'>Education</h3>
                        <div ref={firstBarContainer} className='w-full flex flex-col gap-10 pl-13 relative max-2xl:pl-6'>
                            <span ref={firstBar} className='absolute w-0.5 bg-gray-400 left-[5px] top-[30px]'></span>
                            <ResumeItem
                                icon="school"
                                date="2023 - 2025"
                                text1="Master's Degree in Computer Science"
                                text2="Faculdade de Ciências da Universidade de Lisboa"
                            />
                            <ResumeItem
                                icon="course"
                                date="2023 - 2025"
                                text1="Master's Degree in Computer Science"
                                text2="Faculdade de Ciências da Universidade de Lisboa"
                            />
                            <ResumeItem
                                icon="work"
                                date="2023 - 2025"
                                text1="Master's Degree in Computer Science"
                                text2="Faculdade de Ciências da Universidade de Lisboa"
                            />
                        </div>
                    </div>

                    <div className='flex flex-1/2 flex-col items-center justify-center gap-10 max-2xl:gap-8 max-2xl:mt-12'>
                        <h3 className='text-3xl font-bold mx-auto max-2xl:mr-auto max-2xl:ml-0'>Work Experience</h3>
                        <div ref={secondBarContainer} className='w-full flex flex-col gap-10 pl-13 relative max-2xl:pl-6'>
                            <span ref={secondBar} className='absolute w-0.5 bg-gray-400 left-[5px] top-[30px]'></span>
                            <ResumeItem
                                icon="school"
                                date="2023 - 2025"
                                text1="Master's Degree in Computer Science"
                                text2="Faculdade de Ciências da Universidade de Lisboa"
                            />
                            <ResumeItem
                                icon="course"
                                date="2023 - 2025"
                                text1="Master's Degree in Computer Science"
                                text2="Faculdade de Ciências da Universidade de Lisboa"
                            />
                            <ResumeItem
                                icon="work"
                                date="2023 - 2025"
                                text1="Master's Degree in Computer Science"
                                text2="Faculdade de Ciências da Universidade de Lisboa"
                            />
                            <ResumeItem
                                icon="work"
                                date="2023 - 2025"
                                text1="Master's Degree in Computer Science"
                                text2="Faculdade de Ciências da Universidade de Lisboa"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default ResumeSection

const ResumeItem = ({ icon, date, text1, text2 }: ResumeItemProps) => {
    return (
        <div className="flex gap-5">
            <span className="w-15 min-w-15 h-15 min-h-15 rounded-full text-white bg-my-primary dark:bg-my-secondary grid place-items-center relative
            before:absolute before:w-3 before:h-3 before:rounded-full before:bg-gray-400 before:-left-13 max-2xl:before:-left-6">
                {
                    icon === "school" ? <FaGraduationCap size={30} />
                        : icon === "work" ? <FaBriefcase size={30} />
                            : <PiCertificateFill size={30} />
                }
            </span>
            <div className="flex flex-col gap-2 font-bold">
                <h4 className="text-my-primary">{date}</h4>
                <h4>{text1}</h4>
                <h5 className="text-base font-normal">{text2}</h5>
            </div>
        </div>
    )
}

