import OutlineButton from "@/components/OutlineButton"
import { FaGithub, FaArrowUp } from 'react-icons/fa'
import useOpenLink from "@/hooks/useOpenLink"
import TechBadge from "./TechBadge"
import Image from "next/image"

const ProjectCard = () => {
    return (
        <div className="flex flex-col items-center p-10 bg-tertiary-light dark:bg-tertiary-dark w-[650px] border border-secondary rounded-3xl">
            <h3 className="text-3xl font-bold mb-8">Título do Projeto</h3>
            <span className="text-sm mb-2">Mar 2023 - Mar 2023</span>
            <p className="mb-7">Uma breve descrição do projeto</p>
            <div className="flex justify-center flex-wrap gap-2 w-full mb-7">
                <OutlineButton
                    text="Github"
                    leftImg={<FaGithub size={18} />}
                    rightImg={<FaArrowUp size={18} className="rotate-45 group-hover:rotate-90 transition-transform duration-300" />}
                    containerClasses="py-2 px-7 group"
                    clickFunction={useOpenLink("https://github.com/TwickE")}
                />
                <OutlineButton
                    text="Website"
                    leftImg={<FaGithub size={18} />}
                    rightImg={<FaArrowUp size={18} className="rotate-45 group-hover:rotate-90 transition-transform duration-300" />}
                    containerClasses="py-2 px-7 group"
                    clickFunction={useOpenLink("https://github.com/TwickE")}
                />
                <OutlineButton
                    text="Figma"
                    leftImg={<FaGithub size={18} />}
                    rightImg={<FaArrowUp size={18} className="rotate-45 group-hover:rotate-90 transition-transform duration-300" />}
                    containerClasses="py-2 px-7 group"
                    clickFunction={useOpenLink("https://github.com/TwickE")}
                />
            </div>
            <div className="flex justify-center flex-wrap gap-2 w-full mb-4">
                <TechBadge
                    imgSrc="/images/react.svg"
                    text="React"
                />
                <TechBadge
                    imgSrc="/images/react.svg"
                    text="React"
                />
                <TechBadge
                    imgSrc="/images/react.svg"
                    text="React"
                />
                <TechBadge
                    imgSrc="/images/react.svg"
                    text="React"
                />
                <TechBadge
                    imgSrc="/images/react.svg"
                    text="React"
                />
                <TechBadge
                    imgSrc="/images/react.svg"
                    text="React"
                />
                <TechBadge
                    imgSrc="/images/react.svg"
                    text="React"
                />
            </div>
            <div className="flex gap-4">
                <div className="w-30 h-[300px] flex flex-col gap-4 overflow-y-auto px-2">
                    <Image
                        src="/images/projectImage1.png"
                        alt="Project Image"
                        width={104}
                        height={58.5}
                        className="object-contain object-center border border-slate-400"
                    />
                </div>
                <Image
                    src="/images/projectImage1.png"
                    alt="Project Image"
                    width={300}
                    height={80}
                    className="object-contain object-center max-w-[300px]"
                />
            </div>
        </div>
    )
}

export default ProjectCard