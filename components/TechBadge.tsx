import Image from "next/image"
import { TechBadgeProps } from "@/types/interfaces"

const TechBadge = ({ imgSrc, text }: TechBadgeProps) => {
    return (
        <div className="flex items-center gap-1 text-sm font-bold px-5 py-2 bg-primary dark:bg-secondary border border-secondary dark:border-primary rounded-full">
            <Image
                src={imgSrc}
                alt={`${text} Logo`}
                width={20}
                height={20}
                className="object-contain object-center max-w-5 max-h-5"
            />
            {text}
        </div>
    )
}

export default TechBadge