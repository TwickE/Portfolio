import BreadCrumbs from "@/components/BreadCrumbs";
import ResumeSection from "@/components/ResumeSection";
import SkillsSection from "@/components/SkillsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | Fred's Portfolio",
    description: "Learn about my professional journey, skills, and experiences as a developer.",
};

const About = () => {
    return (
        <>
            <BreadCrumbs title="About"/>
            <SkillsSection backgroundColor="bg-my-background-200" />
            <ResumeSection backgroundColor="bg-my-background-100" />
        </>
    )
}

export default About