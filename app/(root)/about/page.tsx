import BreadCrumbs from "@/components/BreadCrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | Fred's Portfolio",
    description: "Learn about my professional journey, skills, and experiences as a developer.",
};

const About = () => {
    return (
        <main>
            <BreadCrumbs title="About"/>
            <h1 className="text-3xl text-red-500 font-bold underline">
                About Page
            </h1>
        </main>
    )
}

export default About