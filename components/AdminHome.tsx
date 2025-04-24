"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { getDashboardStats } from "@/lib/actions/dashboard.actions";
import { DatabaseItemProps, StorageItemProps } from "@/types/interfaces";
import { format } from "date-fns";
import { FaDatabase, FaFolder, FaCopy } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Label, Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorCard from "@/components/ErrorCard";

const collectionsChartConfig = {
    documents: { label: "Documents", },
    mainSkills: { label: "Main Skills", color: "hsl(var(--chart-1))" },
    otherSkills: { label: "Other Skills", color: "hsl(var(--chart-2))" },
    techBadges: { label: "Tech Badges", color: "hsl(var(--chart-3))" },
    education: { label: "Education", color: "hsl(var(--chart-4))" },
    work: { label: "Work", color: "hsl(var(--chart-5))" },
    cv: { label: "CV", color: "hsl(var(--chart-6))" }
} satisfies ChartConfig;

const storageChartConfig = {
    storage: { label: "Storage" },
    skills: { label: "Skills", color: "hsl(var(--chart-1))" },
    techBadges: { label: "Tech Badges", color: "hsl(var(--chart-2))" },
    cv: { label: "CV", color: "hsl(var(--chart-3))" }
} satisfies ChartConfig;

const AdminHome = () => {
    // Fetches the dashboard stats
    const {
        data,
        isLoading: isLoadingDashboardStats,
        isError: isErrorDashboardStats
    } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: () => getDashboardStats(),
        gcTime: 1000 * 60 * 60 * 12 // 12 hours
    });

    // Derive the collections chart data using useMemo
    const collectionsChartData = useMemo(() => {
        if (!data) return []; // Return empty array if data is not yet available
        return [
            { collection: "mainSkills", number: data.dbTotalMainSkills || 0, fill: "hsl(var(--chart-1))" },
            { collection: "otherSkills", number: data.dbTotalOtherSkills || 0, fill: "hsl(var(--chart-2))" },
            { collection: "techBadges", number: data.dbTotalTechBadges || 0, fill: "hsl(var(--chart-3))" },
            { collection: "education", number: data.dbTotalEducation || 0, fill: "hsl(var(--chart-4))" },
            { collection: "work", number: data.dbTotalWork || 0, fill: "hsl(var(--chart-5))" },
            { collection: "cv", number: data.dbTotalCV || 0, fill: "hsl(var(--chart-6))" }
        ];
    }, [data]); // Recalculate only when data changes

    // Derive the storage chart data using useMemo
    const storageChartData = useMemo(() => {
        if (!data) return []; // Return empty array if data is not yet available
        return [
            { storage: "skills", number: data.storageTotalSkills || 0, fill: "hsl(var(--chart-1))" },
            { storage: "techBadges", number: data.storageTotalTechBadges || 0, fill: "hsl(var(--chart-2))" },
            { storage: "cv", number: data.storageTotalCV || 0, fill: "hsl(var(--chart-3))" }
        ];
    }, [data]); // Recalculate only when data changes

    const totalCollections = useMemo(() => {
        // Check if data is loading before reducing
        if (isLoadingDashboardStats || !data) return 0;
        return collectionsChartData.reduce((acc, curr) => acc + curr.number, 0);
    }, [collectionsChartData, isLoadingDashboardStats, data]);

    const totalStorage = useMemo(() => {
        // Check if data is loading before reducing
        if (isLoadingDashboardStats || !data) return 0;
        return storageChartData.reduce((acc, curr) => acc + curr.number, 0);
    }, [storageChartData, isLoadingDashboardStats, data]);

    if (isLoadingDashboardStats) {
        return (
            <section className="grid grid-cols-4 grid-rows-2 gap-4 h-full w-full max-xl:grid-cols-1 max-xl:grid-rows-auto">
                <Skeleton className="col-span-2 row-span-1 max-xl:col-span-1" />
                <div className="col-span-2 row-span-1 flex flex-col gap-2 max-xl:col-span-1">
                    <div className="flex flex-row gap-2 flex-1">
                        <Skeleton className="flex-1 h-full" />
                        <Skeleton className="flex-1 h-full" />
                    </div>
                    <Skeleton className="flex-1 h-full" />
                </div>
                <div className="col-span-1 row-span-1 flex flex-col gap-2 max-xl:col-span-1">
                    <Skeleton className="flex-1 h-full" />
                    <Skeleton className="flex-1 h-full" />
                </div>
                <Skeleton className="col-span-1 row-span-1 max-xl:col-span-1" />
                <div className="col-span-1 row-span-1 flex flex-col gap-2 max-xl:col-span-1">
                    <Skeleton className="flex-1 h-full" />
                    <Skeleton className="flex-1 h-full" />
                </div>
                <div className="col-span-1 row-span-1 flex flex-col gap-2 max-xl:col-span-1">
                    <Skeleton className="flex-1 h-full" />
                    <Skeleton className="flex-1 h-full" />
                </div>
            </section>
        )
    } else if (isErrorDashboardStats) {
        return (
            <div className="h-full grid place-items-center">
                <ErrorCard name="Dashboard Stats" />
            </div>
        )
    } else if (data) {
        return (
            <section className="grid grid-cols-4 grid-rows-2 gap-4 h-full w-full max-xl:grid-cols-1 max-xl:grid-rows-4">
                <div className="col-span-2 flex p-4 pb-0 font-bold bg-my-accent rounded-sm border border-my-secondary hover:border-my-primary hover:shadow-[0_0_10px] hover:shadow-my-primary transition-all duration-300">
                    <div className="flex-1/2 flex flex-col items-center">
                        <h2 className="w-fit flex gap-1 items-center">
                            <FaDatabase className="text-my-appwrite" size={24} />
                            Collections
                        </h2>
                        <ChartContainer config={collectionsChartConfig} className="mx-auto aspect-square flex-1">
                            <PieChart>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Pie
                                    data={collectionsChartData}
                                    dataKey="number"
                                    nameKey="collection"
                                    innerRadius={60}
                                    strokeWidth={5}
                                >
                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                    >
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            className="fill-foreground text-3xl font-bold"
                                                        >
                                                            {totalCollections.toLocaleString()}
                                                        </tspan>
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0) + 24}
                                                            className="fill-muted-foreground"
                                                        >
                                                            Documents
                                                        </tspan>
                                                    </text>
                                                )
                                            }
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </div>
                    <div className="flex-1/2 flex flex-col items-center">
                        <h2 className="w-fit flex gap-1 items-center">
                            <FaFolder className="text-my-appwrite" size={24} />
                            Storage
                        </h2>
                        <ChartContainer config={storageChartConfig} className="mx-auto aspect-square flex-1">
                            <PieChart>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Pie
                                    data={storageChartData}
                                    dataKey="number"
                                    nameKey="storage"
                                    innerRadius={60}
                                    strokeWidth={5}
                                >
                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                    >
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            className="fill-foreground text-3xl font-bold"
                                                        >
                                                            {totalStorage.toLocaleString()}
                                                        </tspan>
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0) + 24}
                                                            className="fill-muted-foreground"
                                                        >
                                                            Files
                                                        </tspan>
                                                    </text>
                                                )
                                            }
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </div>
                </div>
                <div className="col-span-2 flex flex-col gap-2 font-bold group">
                    <div className="flex flex-row gap-2 flex-1/2">
                        <div className="relative flex flex-col justify-between p-4 flex-1/2 bg-my-accent rounded-sm border border-my-secondary group-hover:border-my-primary group-hover:shadow-[0_0_10px] group-hover:shadow-my-primary transition-all duration-300">
                            <DatabaseItem
                                adminLink="/admin/main-skills"
                                name="Main Skills"
                                dbTotal={data?.dbTotalMainSkills}
                                dbLastUpdated={data?.dbLastUpdatedMainSkills}
                                collectionId={data?.skillsCollectionId}
                                collectionLink={data?.skillsCollectionLink}
                            />
                        </div>
                        <div className="relative flex flex-col justify-between p-4 flex-1/2 bg-my-accent rounded-sm border border-my-secondary group-hover:border-my-primary group-hover:shadow-[0_0_10px] group-hover:shadow-my-primary transition-all duration-300">
                            <DatabaseItem
                                adminLink="/admin/other-skills"
                                name="Other Skills"
                                dbTotal={data?.dbTotalOtherSkills}
                                dbLastUpdated={data?.dbLastUpdatedOtherSkills}
                                collectionId={data?.skillsCollectionId}
                                collectionLink={data?.skillsCollectionLink}
                            />
                        </div>
                    </div>
                    <div className="relative flex flex-col justify-between flex-1/2 w-full p-4 bg-my-accent rounded-sm border border-my-secondary group-hover:border-my-primary group-hover:shadow-[0_0_10px] group-hover:shadow-my-primary transition-all duration-300">
                        <StorageItem
                            name="Skills Storage"
                            storageTotal={data?.storageTotalSkills}
                            storageLastUpdated={data?.storageLastUpdatedSkills}
                            storageId={data?.storageSkillIconsId}
                            storageLink={data?.storageSkillsLink}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2 font-bold group">
                    <div className="relative flex flex-col justify-between flex-1/2 w-full p-4 bg-my-accent rounded-sm border border-my-secondary group-hover:border-my-primary group-hover:shadow-[0_0_10px] group-hover:shadow-my-primary transition-all duration-300">
                        <DatabaseItem
                            adminLink="/admin/tech-badges"
                            name="Tech Badges"
                            dbTotal={data?.dbTotalTechBadges}
                            dbLastUpdated={data?.dbLastUpdatedTechBadges}
                            collectionId={data?.techBadgesCollectionId}
                            collectionLink={data?.techBadgesCollectionLink}
                        />
                    </div>
                    <div className="relative flex flex-col justify-between flex-1/2 w-full p-4 bg-my-accent rounded-sm border border-my-secondary group-hover:border-my-primary group-hover:shadow-[0_0_10px] group-hover:shadow-my-primary transition-all duration-300">
                        <StorageItem
                            name="Tech Badges Storage"
                            storageTotal={data?.storageTotalTechBadges}
                            storageLastUpdated={data?.storageLastUpdatedTechBadges}
                            storageId={data?.storageTechBadgesIconsId}
                            storageLink={data?.storageTechBadgesLink}
                        />
                    </div>
                </div>
                <div className="relative flex flex-col justify-between p-4 font-bold bg-my-accent rounded-sm border border-my-secondary hover:border-my-primary hover:shadow-[0_0_10px] hover:shadow-my-primary transition-all duration-300">
                    <DatabaseItem
                        adminLink="/admin/projects"
                        name="Projects"
                        dbTotal={data?.dbTotalProjects}
                        dbLastUpdated={data?.dbLastUpdatedProjects}
                        collectionId={data?.projectCardsCollectionId}
                        collectionLink={data?.projectsCollectionLink}
                    />
                </div>
                <div className="flex flex-col gap-2 font-bold group">
                    <div className="relative flex flex-col justify-between flex-1/2 w-full p-4 bg-my-accent rounded-sm border border-my-secondary group-hover:border-my-primary group-hover:shadow-[0_0_10px] group-hover:shadow-my-primary transition-all duration-300">
                        <DatabaseItem
                            adminLink="/admin/education"
                            name="Education"
                            dbTotal={data?.dbTotalEducation}
                            dbLastUpdated={data?.dbLastUpdatedEducation}
                            collectionId={data?.resumeCollectionId}
                            collectionLink={data?.resumeCollectionLink}
                        />
                    </div>
                    <div className="relative flex flex-col justify-between flex-1/2 w-full p-4 bg-my-accent rounded-sm border border-my-secondary group-hover:border-my-primary group-hover:shadow-[0_0_10px] group-hover:shadow-my-primary transition-all duration-300">
                        <DatabaseItem
                            adminLink="/admin/work-experience"
                            name="Work Experience"
                            dbTotal={data?.dbTotalWork}
                            dbLastUpdated={data?.dbLastUpdatedWork}
                            collectionId={data?.resumeCollectionId}
                            collectionLink={data?.resumeCollectionLink}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2 font-bold group">
                    <div className="relative flex flex-col justify-between flex-1/2 w-full p-4 bg-my-accent rounded-sm border border-my-secondary group-hover:border-my-primary group-hover:shadow-[0_0_10px] group-hover:shadow-my-primary transition-all duration-300">
                        <DatabaseItem
                            adminLink="/admin/cv-file"
                            name="CV File"
                            dbTotal={data?.dbTotalCV}
                            dbLastUpdated={data?.dbLastUpdatedCV}
                            collectionId={data?.cvFileCollectionId}
                            collectionLink={data?.cvFileCollectionLink}
                        />
                    </div>
                    <div className="relative flex flex-col justify-between flex-1/2 w-full p-4 bg-my-accent rounded-sm border border-my-secondary group-hover:border-my-primary group-hover:shadow-[0_0_10px] group-hover:shadow-my-primary transition-all duration-300">
                        <StorageItem
                            name="CV File Storage"
                            storageTotal={data?.storageTotalCV}
                            storageLastUpdated={data?.storageLastUpdatedCV}
                            storageId={data?.storageCVFileId}
                            storageLink={data?.storageCVLink}
                        />
                    </div>
                </div>
            </section>
        )
    }
}

export default AdminHome

const DatabaseItem = ({ adminLink, name, dbTotal, dbLastUpdated, collectionId, collectionLink }: DatabaseItemProps) => {
    return (
        <>
            <Link href={adminLink || "/admin"} className="w-fit flex gap-1 items-center">
                <FaDatabase className="text-my-appwrite" size={24} />
                {name}
            </Link>
            <Link href={adminLink || "/admin"} className="text-sm font-normal w-fit">
                <p><b className="text-3xl text-my-appwrite">{dbTotal || 0}</b> Documents</p>
                <p>Last update: {dbLastUpdated ? format(dbLastUpdated, "MMM dd, yyyy, H:mm") : "..."}</p>
            </Link>
            <AppwriteButton
                containerClasses="absolute bottom-4 right-4"
                id={collectionId || 'error'}
                link={collectionLink || 'https://cloud.appwrite.io/console'}
            />
        </>
    )
}

const StorageItem = ({ name, storageTotal, storageLastUpdated, storageId, storageLink }: StorageItemProps) => {
    return (
        <>
            <p className="w-fit flex gap-1 items-center">
                <FaFolder className="text-my-appwrite" size={24} />
                {name}
            </p>
            <div className="text-sm font-normal w-fit">
                <p><b className="text-3xl text-my-appwrite">{storageTotal || 0}</b> Documents</p>
                <p>Last update: {storageLastUpdated ? format(storageLastUpdated, "MMM dd, yyyy, H:mm") : "..."}</p>
            </div>
            <AppwriteButton
                containerClasses="absolute bottom-4 right-4"
                id={storageId || 'error'}
                link={storageLink || 'https://cloud.appwrite.io/console'}
            />
        </>
    )
}

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