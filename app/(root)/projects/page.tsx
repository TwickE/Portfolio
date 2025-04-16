import BreadCrumbs from "@/components/BreadCrumbs";
import ProjectsSection from "@/components/ProjectsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects | Fred's Portfolio",
    description: "Browse through my portfolio of web and software development projects. See examples of my work, the technologies I've used, and the problems I've solved.",
};

const Projects = () => {
    return (
        <>
            <BreadCrumbs title="Projects" />
            <ProjectsSection backgroundColor="bg-my-background-200" limitQuery={false} />
        </>
    )
}

export default Projects