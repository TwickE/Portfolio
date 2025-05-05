"use client";

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { FaTrash, FaPlus, FaSave, FaPen, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { FaRotate } from "react-icons/fa6";
import { deleteProjectCard, getProjectCards, getProjectCardById } from "@/lib/actions/projects.actions";
import { ProjectCardType } from "@/types/interfaces";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ErrorCard from '@/components/ErrorCard';
import { useParams } from "next/navigation";
import { AdminCheckBox, AdminDatePicker, AdminInput, AdminLink, AdminSearch, AdminTextArea } from "@/components/AdminSmallComponents";
import TechBadge from '@/components/TechBadge';

const AdminProjectCard = () => {
    // State to store the project cards and track their changes
    const [localData, setLocalData] = useState<ProjectCardType>();
    // State to track the if the alert dialog is open
    const [alertOpen, setAlertOpen] = useState(false);
    // State to store the delete action
    const [deleteAction, setDeleteAction] = useState<(() => Promise<void>) | null>(null);
    // React Query Client
    const queryClient = useQueryClient();
    // Project Card ID from the URL params
    const { id } = useParams();

    // Fetch projects from the backend
    const {
        data: projectCardData,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['projectCard', id],
        queryFn: () => getProjectCardById(id as string),
        gcTime: 1000 * 60 * 60 * 12, // Cache for 12 hours
        // Process the data to parse stringified fields and convert to the correct type
        select: (data) => {
            if (!data) return {};

            const projectCard = data as ProjectCardType;

            // Process the single project card
            const processedData = {
                ...projectCard,
                images: typeof projectCard.images === 'string' ? JSON.parse(projectCard.images) : projectCard.images,
                links: typeof projectCard.links === 'string' ? JSON.parse(projectCard.links) : projectCard.links,
            };

            console.log("Processed Data:", processedData);
            return processedData;
        }
    });

    // Effect to set the local data when projectCardsData changes
    useEffect(() => {
        if (projectCardData) setLocalData(projectCardData);
    }, [projectCardData]);

    const handleRefresh = async () => {
        if (projectCardData && localData !== projectCardData) {
            setLocalData(projectCardData);
        }
    }

    return (
        <>
            <section className="flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between max-xl:flex-wrap max-xl:gap-2 max-md:justify-center">
                    <h2 className="text-2xl w-fit">Project Cards</h2>
                    <div className="flex items-center gap-4 max-md:flex-wrap max-md:justify-center">
                        <Button onClick={handleRefresh}>
                            <FaRotate />
                            Refresh
                        </Button>
                        <Button
                            variant="destructive"
                        /* onClick={() => handleDeleteProjectCard(projectCard.$id, projectCard.new)} */
                        >
                            <FaTrash />
                            Delete
                        </Button>
                        <Button variant="save" /* onClick={handleUpdateProjectCardsOrder} */ /* disabled={isPending} */>
                            {/* {isPending ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSave />} */}
                            <FaSave />
                            Save
                        </Button>
                    </div>
                </div>
                {isLoading ? (
                    <div className="h-full overflow-y-auto">
                        <Skeleton className="w-full h-full rounded-md" />
                    </div>
                ) : isError ? (
                    <div className='h-full grid place-items-center'>
                        <ErrorCard name="Project Card" />
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto">
                        <div className="flex flex-col gap-4 w-full">
                            <div className='flex gap-4 flex-wrap max-md:justify-center'>
                                <AdminInput
                                    icon="text"
                                    placeholder="Title"
                                    inputValue={localData?.title || ""}
                                    onChange={() => console.log("Title changed")} /* (value) => handleChangeInput(localData.$id, 'title', value) */
                                />
                                <AdminDatePicker
                                    placeholder="Starting Date"
                                    inputValue={localData?.startDate || new Date()}
                                    onChange={() => console.log("AdminLink changed")} /* (value) => handleChangeInput(localData.$id, 'startDate', value) */
                                />
                                <AdminDatePicker
                                    placeholder="Ending Date"
                                    inputValue={localData?.endDate || new Date()}
                                    onChange={() => console.log("AdminLink changed")} /* (value) => handleChangeInput(projectCard.$id, 'endDate', value) */
                                />
                                <AdminCheckBox
                                    checked={localData?.original || false}
                                    onChange={() => console.log("AdminLink changed")} /* (checked) => handleChangeAdminCheckBox(projectCard.$id, checked) */
                                    id={localData?.$id}
                                />
                            </div>
                            <AdminTextArea
                                icon="text"
                                placeholder="Description"
                                inputValue={localData?.description || ""}
                                onChange={() => console.log("Description changed")} /* (value) => handleChangeInput(localData.$id, 'description', value) */
                            />
                            <div className='flex gap-4 max-2xl:flex-wrap'>
                                <AdminLink
                                    linkType={localData?.links?.[0]?.text || "NoLink"}
                                    inputValue={localData?.links?.[0]?.url || ""}
                                    onChange={() => console.log("AdminLink changed")} /* (url, linkType) => handleChangeAdminLink(localData[Object.keys(localData)[0]]?.$id, 0, url, linkType) */
                                    onRemove={() => console.log("AdminLink removed")} /* () => handleRemoveAdminLink(localData[Object.keys(localData)[0]]?.$id, 0) */
                                />
                                <AdminLink
                                    linkType={localData?.links?.[1]?.text || "NoLink"}
                                    inputValue={localData?.links?.[1]?.url || ""}
                                    onChange={() => console.log("AdminLink changed")} /* (url, linkType) => handleChangeAdminLink(localData.$id, 1, url, linkType) */
                                    onRemove={() => console.log("AdminLink removed")} /* () => handleRemoveAdminLink(projectCard.$id, 1) */
                                />
                                <AdminLink
                                    linkType={localData?.links?.[2]?.text || "NoLink"}
                                    inputValue={localData?.links?.[2]?.url || ""}
                                    onChange={() => console.log("AdminLink changed")} /* (url, linkType) => handleChangeAdminLink(projectCard.$id, 2, url, linkType) */
                                    onRemove={() => console.log("AdminLink removed")} /* () => handleRemoveAdminLink(projectCard.$id, 2) */
                                />
                            </div>
                            <div className='flex flex-col gap-4 w-full bg-my-background-200 border border-border rounded-md p-3'>
                                <div className='flex justify-between items-center max-[500px]:flex-wrap max-[500px]:justify-center max-[500px]:gap-2'>
                                    <h3>Tech Badges</h3>
                                    <AdminSearch onTechBadgeSelect={() => console.log("AdminLink changed")} /> {/* (techBadge) => handleAddTechBadge(localData.$id, techBadge) */}
                                </div>
                                <div className='flex flex-wrap gap-3 w-full max-h-60 overflow-y-auto max-md:justify-center'>
                                    {localData?.techBadges.map(techBadge => (
                                        <div
                                            key={techBadge.$id}
                                            className='flex items-center rounded-s-[19px] rounded-e-md bg-destructive hover:bg-destructive/90'
                                        >
                                            <TechBadge
                                                imgSrc={techBadge.icon}
                                                text={techBadge.name}
                                            />
                                            <button
                                                className='cursor-pointer rounded-e-md w-full h-full px-3'
                                                onClick={() => console.log("AdminLink changed")} /* () => handleDeleteTechBadge(projectCard.$id, techBadge.$id) */
                                            >
                                                <FaTrash size={16} className='text-white' />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='flex flex-col gap-4 w-full bg-my-background-200 border border-border rounded-md p-3'>
                                <div className='flex justify-between items-center'>
                                    <h3>Images</h3>
                                    <div className='flex gap-4'>
                                        <Button
                                            variant="primary"
                                            onClick={() => console.log("AdminLink changed")} /* () => handleAddImage(projectCard.$id, true) */
                                        >
                                            <FaArrowUp />
                                            Add Image Top
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={() => console.log("AdminLink changed")} /* () => handleAddImage(projectCard.$id, false) */
                                        >
                                            <FaArrowDown />
                                            Add Image Bottom
                                        </Button>
                                    </div>
                                </div>
                                <div className='flex flex-wrap gap-3 w-full max-h-60 overflow-y-auto'>
                                    {localData?.images.map((image, index) => (
                                        <div key={index} className="p-3 w-full flex items-center gap-4 flex-wrap rounded-md mb-2 bg-my-accent">
                                            <div className="grid place-content-center rounded-xl bg-[url(/lightTransparentPattern.svg)] dark:bg-[url(/darkTransparentPattern.svg)] w-[76px] h-[76px]">
                                                <SafeImage
                                                    src={image.src}
                                                    alt={image.alt}
                                                />
                                            </div>
                                            <AdminInput
                                                icon="link"
                                                placeholder="Image URL"
                                                inputValue={image.src}
                                                onChange={() => console.log("AdminLink changed")} /* (value) => handleChangeImageField(projectCard.$id, index, 'src', value) */
                                            />
                                            <AdminInput
                                                icon="text"
                                                placeholder="Image alt text"
                                                inputValue={image.alt}
                                                onChange={() => console.log("AdminLink changed")} /* (value) => handleChangeImageField(projectCard.$id, index, 'alt', value) */
                                            />
                                            <Button
                                                variant="destructive"
                                                className="ml-auto max-4xl:mx-auto"
                                                onClick={() => console.log("AdminLink changed")} /* () => handleDeleteImage(projectCard.$id, index) */
                                            >
                                                <FaTrash />
                                                Delete
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section >
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent className="bg-my-accent border-my-secondary">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project Card</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this project card? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setDeleteAction(null);
                                setAlertOpen(false);
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteAction && deleteAction()}
                            className="bg-destructive text-white shadow-sm hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default AdminProjectCard

const isValidURL = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const SafeImage = ({ src, alt }: { src: string, alt: string }) => {
    const [, setImgSrc] = useState(src);
    const [error, setError] = useState(false);

    const fallbackSrc = "/noImage.webp";

    // Use either the provided source or the fallback
    const effectiveSrc = src && isValidURL(src) ? src : fallbackSrc;

    return (
        <Image
            src={error ? fallbackSrc : effectiveSrc}
            width={60}
            height={60}
            alt={alt}
            className="object-contain object-center max-w-[60px] max-h-[60px]"
            onError={() => {
                setError(true);
                setImgSrc(fallbackSrc);
            }}
        />
    );
};