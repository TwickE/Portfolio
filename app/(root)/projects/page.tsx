import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects | Fred's Portfolio",
    description: "Browse through my portfolio of web and software development projects. See examples of my work, the technologies I've used, and the problems I've solved.",
};

const Projects = () => {
    return (
        <h1 className="text-3xl text-red-500 font-bold underline">
            Projects Page
        </h1>
    )
}

export default Projects