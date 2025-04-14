"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSkillsInfo } from "@/lib/actions/skills.actions";

const AdminHome = () => {
    const [numberOfMainSkills, setNumberOfMainSkills] = useState(0);
    const [numberOfOtherSkills, setNumberOfOtherSkills] = useState(0);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const mainSkills = await getSkillsInfo({ isMainSkill: true });
                const otherSkills = await getSkillsInfo({ isMainSkill: false });
                if (mainSkills && otherSkills) {
                    /* setNumberOfMainSkills(mainSkills.length);
                    setNumberOfOtherSkills(otherSkills.length);
                    console.log("last updated at: ", mainSkills[0].$updatedAt); */
                }
            } catch (error) {
                console.error("Error fetching skills:", error);
            }
        };

        fetchSkills();
    }, []);

    return (
        <section className="grid grid-cols-4 grid-rows-2 gap-4 h-full w-full max-xl:grid-cols-1 max-xl:grid-rows-4">
            <Link href="/admin/main-skills" className="flex flex-col p-4 font-bold bg-my-accent rounded-sm border border-my-secondary hover:border-my-primary hover:shadow-[0_0_10px] hover:shadow-my-primary transition-all duration-300">
                Main Skills
                <span className="text-sm font-normal">{numberOfMainSkills} documents</span>
            </Link>
            <Link href="/admin/other-skills" className="flex flex-col p-4 font-bold bg-my-accent rounded-sm border border-my-secondary hover:border-my-primary hover:shadow-[0_0_10px] hover:shadow-my-primary transition-all duration-300">
                Other Skills
                <span className="text-sm font-normal">{numberOfOtherSkills} documents</span>
            </Link>
            <Link href="/admin/project-cards" className="flex flex-col p-4 font-bold bg-my-accent rounded-sm border border-my-secondary hover:border-my-primary hover:shadow-[0_0_10px] hover:shadow-my-primary transition-all duration-300">
                Project Cards
            </Link>
            <Link href="/admin/tech-badges" className="flex flex-col p-4 font-bold bg-my-accent rounded-sm border border-my-secondary hover:border-my-primary hover:shadow-[0_0_10px] hover:shadow-my-primary transition-all duration-300">
                Tech Badges
            </Link>
            <Link href="/admin/education" className="flex flex-col p-4 font-bold bg-my-accent rounded-sm border border-my-secondary hover:border-my-primary hover:shadow-[0_0_10px] hover:shadow-my-primary transition-all duration-300">
                Education
            </Link>
            <Link href="/admin/work-experience" className="flex flex-col p-4 font-bold bg-my-accent rounded-sm border border-my-secondary hover:border-my-primary hover:shadow-[0_0_10px] hover:shadow-my-primary transition-all duration-300">
                Work Experience
            </Link>
            <Link href="/admin/cv-file" className=" col-span-2 flex flex-col p-4 font-bold bg-my-accent rounded-sm border border-my-secondary hover:border-my-primary hover:shadow-[0_0_10px] hover:shadow-my-primary transition-all duration-300">
                CV File
            </Link>
        </section>
    )
}

export default AdminHome