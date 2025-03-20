import FilledButton from "@/components/FilledButton"
import ProjectCard from "@/components/ProjectCard"
import { useRouter } from "next/navigation"

const ProjectsSection = () => {
    const router = useRouter();

    const navigateToProjects = () => {
        router.push('/projects');
    };

    return (
        <section className="flex flex-col items-center bg-light-mode-100 dark:bg-dark-mode-100 w-full py-12">
            <div className="flex flex-col items-center responsive-container">
                <h2 className="section-title mb-4">My Projects</h2>
                <p className="w-[600px] max-xl:w-full text-base text-center">I bring creative ideas to life through detailed, user-focused solutions. Each project showcases my ability to blend innovation with functionality, delivering results that exceed expectations and drive success.</p>
                <div className="flex justify-between flex-wrap mt-12 gap-5">
                    <ProjectCard />
                    <ProjectCard />
                    <ProjectCard />
                    <ProjectCard />
                </div>
                <FilledButton
                    text="View All Projects"
                    containerClasses='px-8 py-4 mt-8'
                    clickFunction={navigateToProjects}
                />
            </div>
        </section>
    )
}

export default ProjectsSection