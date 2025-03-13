import { SkillCardProps } from "@/types/interfaces"
import Image from "next/image"


const SkillsSection = () => {

    return (
        <section className="bg-light-mode-200 dark:bg-dark-mode-200 w-full py-12">
            <div className="w-[1320px] mx-auto flex flex-col items-center max-5xl:w-[1140px] max-4xl:w-[960px] max-3xl:w-[800px] max-2xl:w-[700px] max-xl:w-[540px] max-lg:w-full max-lg:px-3">
                <h2 className="font-bold text-4xl text-gradient">My Main Skills</h2>
                <div className="flex gap-6 flex-wrap m-auto w-[calc(140px*8+24px*7)] mx-auto mt-8 max-5xl:w-[calc(140px*7+24px*6)] max-4xl:w-[calc(140px*6+20px*5)] max-4xl:gap-5 max-3xl:w-[calc(140px*5+20px*4)] max-2xl:w-[calc(140px*4+40px*3)] max-2xl:gap-10 max-xl:w-[calc(140px*3+40px*2)] max-lg:w-[calc(140px*2+16px)] max-lg:gap-4">
                        <SkillCard
                            link="https://reactjs.org/"
                            image="/assets/images/react.svg"
                            text="React"
                        />
                        <SkillCard
                            link="https://reactjs.org/"
                            image="/assets/images/react.svg"
                            text="React"
                        />
                        <SkillCard
                            link="https://reactjs.org/"
                            image="/assets/images/react.svg"
                            text="React"
                        />
                        <SkillCard
                            link="https://reactjs.org/"
                            image="/assets/images/react.svg"
                            text="React"
                        />
                        <SkillCard
                            link="https://reactjs.org/"
                            image="/assets/images/react.svg"
                            text="React"
                        />
                        <SkillCard
                            link="https://reactjs.org/"
                            image="/assets/images/react.svg"
                            text="React"
                        />
                        <SkillCard
                            link="https://reactjs.org/"
                            image="/assets/images/react.svg"
                            text="React"
                        />
                        <SkillCard
                            link="https://reactjs.org/"
                            image="/assets/images/react.svg"
                            text="React"
                        />
                        <SkillCard
                            link="https://reactjs.org/"
                            image="/assets/images/react.svg"
                            text="React"
                        />
                        <SkillCard
                            link="https://reactjs.org/"
                            image="/assets/images/react.svg"
                            text="React"
                        />
                        <SkillCard
                            link="https://reactjs.org/"
                            image="/assets/images/react.svg"
                            text="React"
                        />
                        <SkillCard
                            link="https://reactjs.org/"
                            image="/assets/images/react.svg"
                            text="React"
                        />
                </div>
            </div>
        </section>
    )
}

export default SkillsSection

const SkillCard = ({link, image, text}: SkillCardProps) => {
    return (
        <a
            href={link}
            target="_blank"
            className="group flex flex-col gap-4 items-center justify-center w-[140px] h-[140px] bg-light-secondary-glass-bg dark:bg-dark-secondary-glass-bg rounded-3xl border border-[rgba(255,255,255,0.2)] hover:border-primary hover:shadow-[0_0_10px] hover:shadow-primary backdrop-blur-xs cursor-pointer transition-all duration-300 max-2xl:border-primary"
        >
            <Image
                src={image}
                alt={`${text} Logo`}
                width={60}
                height={60}
                className="grayscale-100 group-hover:grayscale-0 transition-all duration-300 max-2xl:grayscale-0"
            />
            <p className="text-base font-bold text-gray-400 group-hover:text-primary transition-colors duration-300 max-2xl:text-primary">{text}</p>
        </a>
    )
}