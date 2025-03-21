import OutlineButton from "@/components/OutlineButton"
import { FaGithub, FaArrowUp } from 'react-icons/fa'
import useOpenLink from "@/hooks/useOpenLink"
import TechBadge from "./TechBadge"
import Image from "next/image"
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useState, useRef } from "react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"



const imagesData = [
    {
        src: "https://github.com/user-attachments/assets/9c9daa72-ce38-4e91-a001-ddb138dd9d84",
        alt: "Home Page Dark Mode"
    },
    {
        src: "https://github.com/user-attachments/assets/10297580-71b8-4278-825b-e717882fe9de",
        alt: "Home Page Light Mode"
    },
    {
        src: "https://github.com/user-attachments/assets/e0901939-99aa-4980-8900-517566ab6066",
        alt: "About Page"
    },
    {
        src: "https://github.com/user-attachments/assets/2f675915-adc7-41fb-80f3-22c0bf91d925",
        alt: "Projects Page"
    },
    {
        src: "https://github.com/user-attachments/assets/68d08046-b1c5-4891-b086-0a392a7b2b6d",
        alt: "Contact Page"
    }
];

const ProjectCard = () => {
    // State to manage the dialog open state
    const [dialogOpen, setDialogOpen] = useState(false);
    // State to manage the main image data
    const [mainImageData, setMainImageData] = useState({
        src: imagesData[0].src,
        alt: imagesData[0].alt
    });
    const mainImage = useRef(null);

    const selectImage = (src: string, alt: string) => {
        setMainImageData({ src, alt });
    }

    return (
        <>
            <div className="flex flex-col items-center bg-tertiary-light dark:bg-tertiary-dark w-[650px] p-10 border border-secondary rounded-3xl max-5xl:w-[560px] max-5xl:p-7 max-4xl:w-[470px] max-4xl:p-5 max-3xl:w-full max-3xl:p-10 max-xl:p-5 max-lg:w-full">
                <h3 className="text-3xl font-bold mb-8">Título do Projeto</h3>
                <span className="text-sm mb-2">Mar 2023 - Mar 2023</span>
                <p className="mb-7 text-base text-center min-h-[2lh] line-clamp-2 overflow-ellipsis">Uma breve descrição do projeto. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam reprehenderit delectus unde commodi sed nostrum, pariatur sint facere voluptatibus cum. Eligendi distinctio consectetur maxime accusantium illum placeat eius vel perferendis.</p>
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
                <div className="flex gap-4 w-full max-lg:flex-col max-lg:items-center max-lg:gap-2">
                    <div className="w-30 h-[300px] flex flex-col gap-4 overflow-y-auto px-2 max-5xl:w-25 max-4xl:h-60 max-3xl:w-30 max-3xl:h-[300px] max-lg:flex-row max-lg:w-full max-lg:h-25 max-lg:order-2">
                        {imagesData.map((image, index) => (
                            <Image
                                key={index}
                                src={image.src}
                                alt={image.alt}
                                width={104}
                                height={58.5}
                                className={`${image.src === mainImageData.src
                                    ? 'border-primary shadow-[0_0_10px] shadow-primary'
                                    : 'border-slate-700 dark:border-slate-400'}
                                object-contain object-center border cursor-pointer`
                                }
                                onClick={() => selectImage(image.src, image.alt)}
                            />
                        ))}
                    </div>
                    <Image
                        ref={mainImage}
                        src={mainImageData.src}
                        alt={mainImageData.alt}
                        width={300}
                        height={80}
                        className="object-contain object-center cursor-pointer flex-1 max-h-[300px] max-lg:order-1"
                        onClick={() => setDialogOpen(true)}
                    />
                </div>
            </div>
            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent className="bg-tertiary-light dark:bg-tertiary-dark border-secondary !min-w-[90dvw] !w-[90dvw]">
                    <AlertDialogHeader className="relative flex justify-center">
                        <AlertDialogTitle className="text-center text-2xl font-bold max-md:text-xl">
                            {mainImageData.alt}
                            <IoIosCloseCircleOutline
                                size={20}
                                onClick={() => setDialogOpen(false)}
                                className='absolute -right-2 -top-4 cursor-pointer'
                            />
                        </AlertDialogTitle>
                        <AlertDialogDescription></AlertDialogDescription>
                    </AlertDialogHeader>
                    <Image
                        ref={mainImage}
                        src={mainImageData.src}
                        alt={mainImageData.alt}
                        width={1000}
                        height={80}
                        style={{ width: 'auto', height: 'auto' }}
                        className="object-contain object-center max-w-[calc(90dvw-48px)] max-h-[70dvh] mx-auto"
                    />
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default ProjectCard