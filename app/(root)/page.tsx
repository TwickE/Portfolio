"use client";

import OutlineButton from "@/components/OutlineButton"
import Image from "next/image"
import { FiDownload } from "react-icons/fi";
import { FaLinkedin, FaGithub, FaCodepen } from "react-icons/fa";
import useDownloadCV from "@/hooks/useDownloadCV";

export default function Home() {
    // Function to open links in a new tab
    const openLink = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <main className="max-w-[1320px] min-h-[calc(100vh-196px)] mx-auto flex my-12">
            <div className="flex flex-col justify-center gap-2 w-1/2 text-white">
                <h2 className="text-4xl font-bold">Hi, I am Fred</h2>
                <h1 className="text-5xl font-bold text-gradient-dark mb-2">A Full Stack Developer +<br />UX Designer</h1>
                <p className="mb-16">I&apos;m a technology enthusiast with a focus on Web Development. I consider myself a curious individual, always eager to learn new things.</p>
                <div className="flex gap-5 items-center">
                    <OutlineButton
                        text="Download CV"
                        rightImg={<FiDownload size={18} />}
                        clickFunction={useDownloadCV()}
                        containerClasses="py-5 px-10"
                    />
                    <OutlineButton
                        rightImg={<FaLinkedin size={18} />}
                        clickFunction={() => openLink("https://www.linkedin.com/in/frederico-silva-727a8b21a/")}
                        containerClasses="p-2"
                        ariaLabel="Open LinkedIn Profile"
                    />
                    <OutlineButton
                        rightImg={<FaGithub size={18} />}
                        clickFunction={() => openLink("https://github.com/TwickE")}
                        containerClasses="p-2"
                        ariaLabel="Open Github Profile"
                    />
                    <OutlineButton
                        rightImg={<FaCodepen size={18} />}
                        clickFunction={() => openLink("https://codepen.io/TwickE")}
                        containerClasses="p-2"
                        ariaLabel="Open Codepen Profile"
                    />
                </div>
            </div>
            <div className=" flex items-center justify-center w-1/2">
                <div className="bg-dark-photo-bg rounded-[38px] w-fit rotate-5 hover:rotate-0 transition-transform duration-300">
                    <Image
                        src="/assets/images/profilePlaceHolder.png"
                        alt="Profile Photo"
                        width={475}
                        height={510}
                        className="border-2 border-secondary rounded-[38px] hover:border-primary transition-border duration-300"
                    />
                </div>
            </div>
        </main>
    )
}
