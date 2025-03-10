import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | Fred's Portfolio",
    description: "Learn about my professional journey, skills, and experiences as a developer.",
};

const About = () => {
    return (
        <h1 className="text-3xl text-red-500 font-bold underline">
            About Page
        </h1>
    )
}

export default About