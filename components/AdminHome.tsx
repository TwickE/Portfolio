"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/actions/dashboard.actions";
import { AdminHomeData } from "@/types/interfaces";
import { format } from "date-fns";
import { FaDatabase, FaFolder, FaCopy } from "react-icons/fa";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const AdminHome = () => {
    const [data, setData] = useState<AdminHomeData>();

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const stats = await getDashboardStats();
                if (stats) {
                    setData(stats);
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };

        fetchDashboardStats();
    }, []);

    return (
        <section className="grid grid-cols-4 grid-rows-2 gap-4 h-full w-full max-xl:grid-cols-1 max-xl:grid-rows-4">
            <div className="col-span-2 flex flex-col gap-2 font-bold">
                <div className="flex flex-row gap-2 flex-1/2">
                    <div className="relative flex flex-col justify-between p-4 flex-1/2 bg-my-accent rounded-sm border border-my-secondary hover:border-my-primary hover:shadow-[0_0_10px] hover:shadow-my-primary transition-all duration-300">
                        <Link href="/admin/main-skills" className="w-fit flex gap-1 items-center">
                            <FaDatabase className="text-my-appwrite" size={24} />
                            Main Skills
                        </Link>
                        <Link href="/admin/main-skills" className="text-sm font-normal w-fit max-w-[calc(100%-30px)]">
                            <p><b className="text-3xl text-my-appwrite">{data?.dbTotalMainSkills || 0}</b> Documents</p>
                            <p>Last update: {data?.dbLastUpdatedMainSkills ? format(data.dbLastUpdatedMainSkills, "MMM dd, yyyy, H:mm") : "..."}</p>
                        </Link>
                        <AppwriteButton
                            containerClasses="absolute bottom-4 right-4"
                            id={data?.skillsCollectionId || 'error'}
                            link={data?.skillsCollectionLink || 'https://cloud.appwrite.io/console'}
                        />
                    </div>
                    <div className="relative flex flex-col justify-between p-4 flex-1/2 bg-my-accent rounded-sm border border-my-secondary hover:border-my-primary hover:shadow-[0_0_10px] hover:shadow-my-primary transition-all duration-300">
                        <Link href="/admin/main-skills" className="w-fit flex gap-1 items-center">
                            <FaDatabase className="text-my-appwrite" size={24} />
                            Other Skills
                        </Link>
                        <Link href="/admin/other-skills" className="text-sm font-normal w-fit max-w-[calc(100%-30px)]">
                            <p><b className="text-3xl text-my-appwrite">{data?.dbTotalOtherSkills || 0}</b> Documents</p>
                            <p>Last update: {data?.dbLastUpdatedOtherSkills ? format(data.dbLastUpdatedOtherSkills, "MMM dd, yyyy, H:mm") : "..."}</p>
                        </Link>
                        <AppwriteButton
                            containerClasses="absolute bottom-4 right-4"
                            id={data?.skillsCollectionId || 'error'}
                            link={data?.skillsCollectionLink || 'https://cloud.appwrite.io/console'}
                        />
                    </div>
                </div>
                <div className="relative flex flex-col justify-between flex-1/2 w-full p-4 bg-my-accent rounded-sm border border-my-secondary hover:border-my-primary hover:shadow-[0_0_10px] hover:shadow-my-primary transition-all duration-300">
                    <p className=" flex gap-1 items-center">
                        <FaFolder className="text-my-appwrite" size={24} />
                        Skills Storage
                    </p>
                    <div className="text-sm font-normal w-fit">
                        <p><b className="text-3xl text-my-appwrite">{data?.storageTotalSkills || 0}</b> Documents</p>
                        <p>Last update: {data?.storageLastUpdatedSkills ? format(data.storageLastUpdatedSkills, "MMM dd, yyyy, H:mm") : "..."}</p>
                    </div>
                    <AppwriteButton
                        containerClasses="absolute bottom-4 right-4"
                        id={data?.storageSkillIconsId || 'error'}
                        link={data?.storageSkillsLink || 'https://cloud.appwrite.io/console'}
                    />
                </div>
            </div>
            <Link href="/admin/tech-badges" className="flex flex-col p-4 font-bold bg-my-accent rounded-sm border border-my-secondary hover:border-my-primary hover:shadow-[0_0_10px] hover:shadow-my-primary transition-all duration-300">
                Tech Badges
            </Link>
            <div className="relative flex flex-col justify-between p-4 font-bold bg-my-accent rounded-sm border border-my-secondary hover:border-my-primary hover:shadow-[0_0_10px] hover:shadow-my-primary transition-all duration-300">
                <Link href="/admin/main-skills" className="w-fit flex gap-1 items-center">
                    <FaDatabase className="text-my-appwrite" size={24} />
                    Project Cards
                </Link>
                <Link href="/admin/main-skills" className="text-sm font-normal w-fit max-w-[calc(100%-30px)]">
                    <p><b className="text-3xl text-my-appwrite">{data?.dbTotalProjects || 0}</b> Documents</p>
                    <p>Last update: {data?.dbLastUpdatedProjects ? format(data.dbLastUpdatedProjects, "MMM dd, yyyy, H:mm") : "..."}</p>
                </Link>
                <AppwriteButton
                    containerClasses="absolute bottom-4 right-4"
                    id={data?.projectCardsCollectionId || 'error'}
                    link={data?.projectsCollectionLink || 'https://cloud.appwrite.io/console'}
                />
            </div>
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

const AppwriteButton = ({ link, containerClasses, id }: { link: string, containerClasses?: string, id: string }) => {
    const handleClick = () => {
        navigator.clipboard.writeText(id).then(() => {
            toast.success("ID copied to clipboard");
        }).catch(err => {
            console.error("Failed to copy ID: ", err);
        });
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={`${containerClasses} w-[30px] h-[30px]`}>
                        <Link href={link} target="_blank">
                            <Button
                                variant='appwrite'
                                className="w-[30px] h-[30px] p-1 rounded-sm"
                                type="button"
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src="/appwrite.svg"
                                        alt="Appwrite Icon"
                                        fill
                                        className="object-contain object-center"
                                    />
                                </div>
                            </Button>
                        </Link>
                    </div>
                </TooltipTrigger>
                <TooltipContent className="flex items-center gap-2">
                    <Button
                        variant='appwrite'
                        className="w-[30px] h-[30px] p-1 rounded-sm"
                        onClick={handleClick}
                    >
                        <FaCopy size={26} />
                    </Button>
                    <p>ID: <b>{id}</b></p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}