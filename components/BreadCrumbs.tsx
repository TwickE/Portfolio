import { BreadCrumbsProps } from "@/types/interfaces";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const BreadCrumbs = ({ title }: BreadCrumbsProps) => {
    return (
        <>
            <section className="absolute top-0 left-0 z-0 w-full bg-[url('/breadcrumbBackground.webp')] bg-center h-99 pt-50 text-white">
                <h1 className="text-5xl font-bold w-fit mx-auto mb-4">{title}</h1>
                <div className="flex items-center gap-2 w-fit mx-auto text-base">
                    <Link href='/' className="breadcrumbs-hover-link">Home</Link>
                    <FaArrowRight size={16} />
                    <p>{title}</p>
                </div>
            </section>
            <div className="h-74"></div>
        </>
    )
}

export default BreadCrumbs