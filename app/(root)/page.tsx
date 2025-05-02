"use client";

import OutlineButton from "@/components/OutlineButton";
import Image from "next/image";
import { FiDownload } from "react-icons/fi";
import { FaLinkedin, FaGithub, FaCodepen } from "react-icons/fa";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ResumeSection from "@/components/ResumeSection";
import Link from "next/link";
import ContactSection from "@/components/ContactSection";
import { getCVFile } from "@/lib/actions/cvFile.actions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

export default function Home() {
    return (
        <>
            <HeroSection />
            <SkillsSection backgroundColor="bg-my-background-200" />
            <ProjectsSection backgroundColor="bg-my-background-100" limitQuery={true} />
            <ResumeSection backgroundColor="bg-my-background-200" />
            <ContactSection backgroundColor="bg-my-background-100" />
        </>
    )
}

const HeroSection = () => {
    const fetchCVFileMutation = useMutation({
        mutationFn: getCVFile,
        onSuccess: (file) => {
            if (file) {
                window.open(file.fileURL, '_blank');
            } else {
                toast.error("No file returned");
            }
        },
        onError: () => {
            toast.error("Failed to get CV file");
        },
    });

    const fetchCVFile = () => {
        fetchCVFileMutation.mutate();
    };

    return (
        <main className="responsive-container min-h-[calc(100vh-196px)] flex my-12 hero-glow1  max-2xl:flex-col max-2xl:items-center">
            <div className="animate-fade-in-left flex flex-col justify-center gap-2 w-1/2 max-2xl:w-[700px] max-2xl:items-center max-xl:w-full max-lg:px-3">
                <h2 className="text-4xl font-bold max-5xl:text-[2rem] max-4xl:text-[1.8rem] max-3xl:text-[1.4rem] max-2xl:m-auto max-2xl:text-[2rem] max-xl:text-[1.8rem] max-lg:text-2xl max-md:text-xl max-sm:text-base">Hi, I am Fred</h2>
                <h1 className="text-5xl font-bold text-gradient mb-2 leading-[1.1] max-5xl:text-[2.7rem] max-4xl:text-4xl max-3xl:text-[2rem] max-2xl:m-auto max-2xl:text-center max-2xl:text-5xl max-xl:text-[2.5rem] max-lg:text-[2rem] max-md:[1.7rem] max-sm:text-xl">A Full Stack Developer + UX Designer</h1>
                <div className="hero-glow2 hidden max-2xl:block">
                    <Image
                        src="/profilePlaceHolder.png"
                        alt="Profile Photo"
                        width={475}
                        height={510}
                        className="border-2 border-my-secondary bg-my-photo-background rounded-[38px] hover:border-my-primary transition-colors duration-300 max-2xl:my-8 max-lg:w-full max-lg:h-auto max-md:my-4 max-sm:my-2"
                    />
                </div>
                <p className="mb-16 max-4xl:text-[1.1rem] max-3xl:text-base max-3xl:mb-5 max-2xl:text-2xl max-2xl:text-center max-lg:text-[1.1rem] max-lg:w-full max-md:text-base max-sm:text-[0.8rem]">I&apos;m a technology enthusiast with a focus on Web Development. I consider myself a curious individual, always eager to learn new things.</p>
                <div className="flex gap-5 items-center max-md:flex-wrap max-md:justify-center">
                    <OutlineButton
                        text="Download CV"
                        rightImg={<FiDownload size={18} />}
                        clickFunction={fetchCVFile}
                        containerClasses="py-5 px-10"
                    />
                    <div className="flex gap-5 items-center">
                        <Link href="https://www.linkedin.com/in/frederico-silva-727a8b21a/" target="_blank" rel="noopener,noreferrer">
                            <OutlineButton
                                rightImg={<FaLinkedin size={18} />}
                                clickFunction={() => console.log("oi")}
                                containerClasses="p-2"
                                ariaLabel="Open LinkedIn Profile"
                            />
                        </Link>
                        <Link href="https://github.com/TwickE" target="_blank" rel="noopener,noreferrer">
                            <OutlineButton
                                rightImg={<FaGithub size={18} />}
                                containerClasses="p-2"
                                ariaLabel="Open Github Profile"
                            />
                        </Link>
                        <Link href="https://codepen.io/TwickE" target="_blank" rel="noopener,noreferrer">
                            <OutlineButton
                                rightImg={<FaCodepen size={18} />}
                                containerClasses="p-2"
                                ariaLabel="Open Codepen Profile"
                            />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="animate-fade-in-right flex items-center justify-center w-1/2 hero-glow2 max-2xl:hidden">
                <Image
                    src="/profilePlaceHolder.png"
                    alt="Profile Photo"
                    width={475}
                    height={510}
                    className="border-2 border-my-secondary bg-my-photo-background rounded-[38px] rotate-5 hover:rotate-0 hover:border-my-primary transition-all duration-300 max-4xl:w-[80%] max-4xl:h-auto"
                />
            </div>
        </main>
    )
}
