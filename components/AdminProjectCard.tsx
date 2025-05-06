"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { FaTrash, FaSave, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { FaRotate } from "react-icons/fa6";
import { addProjectCard, deleteProjectCard, getProjectCardById, updateProjectCard } from "@/lib/actions/projects.actions";
import { ProjectCardType, TechBadgeType } from "@/types/interfaces";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ErrorCard from '@/components/ErrorCard';
import { useParams, useRouter } from "next/navigation";
import { AdminCheckBox, AdminDatePicker, AdminInput, AdminLink, AdminSearch, AdminTextArea } from "@/components/AdminSmallComponents";
import TechBadge from '@/components/TechBadge';

const AdminProjectCard = () => {
    // Define a default empty state matching ProjectCardType
    const defaultProjectCard: ProjectCardType = {
        $id: '',
        order: 1,
        title: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(),
        original: false,
        images: [{ src: '', alt: '' }],
        links: [],
        techBadges: [],
        new: true,
    };
    // State to store the project cards and track their changes
    const [localData, setLocalData] = useState<ProjectCardType>(defaultProjectCard);
    // State to track the if the alert dialog is open
    const [alertOpen, setAlertOpen] = useState(false);
    // State to store the delete action
    const [deleteAction, setDeleteAction] = useState<(() => Promise<void>) | null>(null);
    // React Query Client
    const queryClient = useQueryClient();
    // Project Card ID from the URL params
    const { id } = useParams();

    const router = useRouter();

    // Fetch projects from the backend
    const {
        data: projectCardData,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['projectCard', id],
        queryFn: async () => {
            if (id === 'new') {
                return defaultProjectCard;
            }
            const data = await getProjectCardById(id as string);
            if (!data) {
                throw new Error("Project not found");
            }

            return data;
        },
        gcTime: 1000 * 60 * 60 * 12, // Cache for 12 hours
        refetchOnWindowFocus: false,
        // Process the data to parse stringified fields and convert to the correct type
        select: (data) => {
            const projectCard = data as ProjectCardType;

            // Process the single project card
            const processedData = {
                ...projectCard,
                images: typeof projectCard.images === 'string' ? JSON.parse(projectCard.images) : projectCard.images,
                links: typeof projectCard.links === 'string' ? JSON.parse(projectCard.links) : projectCard.links,
            };

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChangeInput = (field: string, value: any) => {
        setLocalData(prev => {
            return {
                ...prev,
                [field]: value
            };
        });
    }

    const handleChangeAdminLink = (linkIndex: number, url: string, linkType: string) => {
        // Create a copy of the links array (ensuring it exists)
        const updatedLinks = [...(localData.links || [])];

        // Ensure the array has enough elements
        while (updatedLinks.length <= linkIndex) {
            updatedLinks.push({ text: "Website", url: "" });
        }

        // Update the specific link at the given index
        updatedLinks[linkIndex] = {
            ...updatedLinks[linkIndex],
            text: linkType,
            url: url
        };

        // Update the project card with the new links array
        setLocalData(prev => ({
            ...prev,
            links: updatedLinks
        }));
    }

    const handleRemoveAdminLink = (linkIndex: number) => {
        if (!localData.links || localData.links.length <= linkIndex) return;

        // Create a copy of the links array
        const updatedLinks = [...localData.links];

        // Remove the link at the specified index
        updatedLinks.splice(linkIndex, 1);

        // Update the project card with the new links array
        setLocalData(prev => ({
            ...prev,
            links: updatedLinks
        }));
    }

    const handleAddTechBadge = (techBadge: TechBadgeType) => {
        // Check if tech badge already exists
        if (localData.techBadges.some(tb => tb.$id === techBadge.$id)) {
            toast.error("Tech badge already added");
            return;
        }

        // Create a copy of the techBadges array
        const updatedTechBadges = [...localData.techBadges, techBadge];

        // Update the projectCard with the new techBadges array
        setLocalData(prev => ({
            ...prev,
            techBadges: updatedTechBadges
        }));
    }

    const handleDeleteTechBadge = (techBadgeId: string) => {
        if (!localData.techBadges) return;

        // Find the tech badge to be deleted
        const techBadgeIndex = localData.techBadges.findIndex(tb => tb.$id === techBadgeId);

        // If tech badge not found, return
        if (techBadgeIndex === -1) {
            toast.error(`Tech badge with ID ${techBadgeId} not found`);
            return;
        }

        // Create a copy of the tech badges array
        const updatedTechBadges = [...localData.techBadges];

        // Remove the tech badge at the found index
        updatedTechBadges.splice(techBadgeIndex, 1);

        // Update the project card with the new tech badges array
        setLocalData(prev => ({
            ...prev,
            techBadges: updatedTechBadges
        }));

        toast.success("Tech badge removed");
    }

    const handleChangeImageField = (imageIndex: number, field: string, value: string) => {
        if (!localData.images) return;

        // Create a copy of the images array
        const updatedImages = [...localData.images];

        // Ensure the array has enough elements
        if (imageIndex >= updatedImages.length) {
            console.error(`Image index ${imageIndex} is out of bounds`);
            return;
        }

        // Update the specific field of the image at the given index
        updatedImages[imageIndex] = {
            ...updatedImages[imageIndex],
            [field]: value
        };

        // Update the project card with the new images array
        setLocalData(prev => ({
            ...prev,
            images: updatedImages
        }));
    }

    const handleDeleteImage = (imageIndex: number) => {
        if (!localData.images || localData.images.length <= imageIndex) return;

        // Create a copy of the images array
        const updatedImages = [...localData.images];

        // Remove the image at the specified index
        updatedImages.splice(imageIndex, 1);

        // Update the project card with the new images array
        setLocalData(prev => ({
            ...prev,
            images: updatedImages
        }));

        toast.success("Image removed");
    }

    // Add a new image to the top or bottom of the images array
    const handleAddImage = (top: boolean) => {
        // Create a copy of the images array (ensuring it exists)
        const updatedImages = [...(localData.images || [])];

        if (top) {
            // Add a new empty image at the beginning of the array
            updatedImages.unshift({
                src: '',
                alt: ''
            });
        } else {
            // Add a new empty image at the end of the array
            updatedImages.push({
                src: '',
                alt: ''
            });
        }

        // Update the project card with the new images array
        setLocalData(prev => ({
            ...prev,
            images: updatedImages
        }));
    }

    const validateFields = () => {
        if (!localData) return true;
        if (!localData.title) {
            toast.error("Please provide a title");
            return true;
        }
        if (!localData.description) {
            toast.error("Please provide a description");
            return true;
        }
        if (!localData.startDate) {
            toast.error("Please provide a starting date");
            return true;
        }
        if (!localData.endDate) {
            toast.error("Please provide an ending date");
            return true;
        }
        if (localData.links.length === 0) {
            toast.error("Please provide at least one link");
            return true;
        }
        if (localData.links.some(link => !link.url)) {
            toast.error("Please provide a URL for all links");
            return true;
        }
        if (localData.links.some(link => !isValidURL(link.url))) {
            toast.error("Please provide valid URLs for all links");
            return true;
        }
        if (localData.links.some(link => link.text === "NoLink")) {
            toast.error("Please provide a link type for all links");
            return true;
        }
        if (localData.images.length === 0) {
            toast.error("Please provide at least one image");
            return true;
        }
        if (localData.images.some(image => !image.alt)) {
            toast.error("Please provide alt text for all images");
            return true;
        }
        if (localData.images.some(image => !image.src)) {
            toast.error("Please provide a URL for all images");
            return true;
        }
        if (localData.images.some(image => !isValidURL(image.src))) {
            toast.error("Please provide a valid URL for all images");
            return true;
        }

        return false;
    }

    // Mutation to update the the project card
    const {
        mutateAsync: updateMutation,
        isPending: updateIsPending
    } = useMutation({
        mutationFn: async (projectCard: ProjectCardType) => {
            if (validateFields()) return;
            const response = await updateProjectCard(projectCard);

            if (!response) {
                throw new Error("Failed to update project card");
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['projectCard', id] });
            toast.success("Project Card updated successfully");
        },
        onError: (err: unknown) => {
            console.error("Mutation failed:", err);
            toast.error((err as Error).message || "Failed to update project cards");
        },
    });

    // Mutation to add a project card
    const {
        mutateAsync: addMutation,
        isPending: addIsPending
    } = useMutation({
        mutationFn: async (projectCard: ProjectCardType) => {
            if (validateFields()) return;
            const response = await addProjectCard(projectCard);

            if (!response) {
                throw new Error("Failed to add project card");
            }
        },
        onSuccess: async () => {
            if (localData.new) {
                router.push("/admin/project-cards");
            }
            await queryClient.invalidateQueries({ queryKey: ['projectCard', id] });
            toast.success("Project Card added successfully");
        },
        onError: (err: unknown) => {
            console.error("Mutation failed:", err);
            toast.error((err as Error).message || "Failed to add project cards");
        },
    });

    const handleUpdateProjectCard = async () => {
        // First validate the fields
        if (validateFields()) {
            return;
        }
        if (localData.new) {
            await addMutation(localData);
        } else {
            await updateMutation(localData);
        }

    }

    // Mutation to delete a skill
    const deleteMutation = useMutation({
        mutationFn: async (projectId: string) => {
            if (localData.new) {
                return setLocalData(defaultProjectCard);
            }
            return await deleteProjectCard(projectId);
        },
        onSuccess: () => {
            toast.success("Project deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['projectCard', id] });
            if (!localData.new) {
                router.push("/admin/project-cards");
            }
        },
        onError: (error) => {
            console.error("Delete error:", error);
            toast.error("Failed to delete project card");
        },
    });

    const handleDeleteProjectCard = () => {
        const executeDeleteSkill = async () => {
            await deleteMutation.mutateAsync(id as string);

            // Reset and close the dialog
            setDeleteAction(null);
            setAlertOpen(false);
        };

        setDeleteAction(() => executeDeleteSkill);
        setAlertOpen(true);
    }

    return (
        <>
            <section className="flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between mb-4 max-xl:flex-col max-xl:gap-2">
                    <h2 className="text-2xl">Project Card</h2>
                    <div className="flex items-center gap-4 flex-wrap justify-center">
                        <Button onClick={handleRefresh}>
                            <FaRotate />
                            Refresh
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleDeleteProjectCard()}
                        >
                            <FaTrash />
                            Delete
                        </Button>
                        <Button variant="save" onClick={handleUpdateProjectCard} disabled={updateIsPending || addIsPending}>
                            {updateIsPending || addIsPending ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSave />}
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
                ) : localData && (
                    <div className="h-full overflow-y-auto">
                        <div className="flex flex-col gap-4 w-full">
                            <div className='flex gap-4 flex-wrap max-xl:flex-col items-center'>
                                <AdminInput
                                    icon="text"
                                    placeholder="Title"
                                    inputValue={localData.title}
                                    onChange={(value) => handleChangeInput('title', value)}
                                />
                                <AdminDatePicker
                                    placeholder="Starting Date"
                                    inputValue={localData.startDate}
                                    onChange={(value) => handleChangeInput('startDate', value)}
                                />
                                <AdminDatePicker
                                    placeholder="Ending Date"
                                    inputValue={localData.endDate}
                                    onChange={(value) => handleChangeInput('endDate', value)}
                                />
                                <AdminCheckBox
                                    checked={localData.original}
                                    onChange={(value) => handleChangeInput('original', value)}
                                    id={localData?.$id}
                                />
                            </div>
                            <AdminTextArea
                                icon="text"
                                placeholder="Description"
                                inputValue={localData.description}
                                onChange={(value) => handleChangeInput('description', value)}
                            />
                            <div className='flex gap-4 max-2xl:flex-wrap'>
                                <AdminLink
                                    linkType={localData.links?.[0]?.text || "NoLink"}
                                    inputValue={localData.links?.[0]?.url || ""}
                                    onChange={(url, linkType) => handleChangeAdminLink(0, url, linkType)}
                                    onRemove={() => handleRemoveAdminLink(0)}
                                />
                                <AdminLink
                                    linkType={localData.links?.[1]?.text || "NoLink"}
                                    inputValue={localData.links?.[1]?.url || ""}
                                    onChange={(url, linkType) => handleChangeAdminLink(1, url, linkType)}
                                    onRemove={() => handleRemoveAdminLink(1)}
                                />
                                <AdminLink
                                    linkType={localData.links?.[2]?.text || "NoLink"}
                                    inputValue={localData.links?.[2]?.url || ""}
                                    onChange={(url, linkType) => handleChangeAdminLink(2, url, linkType)}
                                    onRemove={() => handleRemoveAdminLink(2)}
                                />
                            </div>
                            <div className='flex flex-col gap-4 w-full bg-my-background-200 border border-border rounded-md p-3'>
                                <div className='flex justify-between items-center max-[500px]:flex-wrap max-[500px]:justify-center max-[500px]:gap-2'>
                                    <h3>Tech Badges</h3>
                                    <AdminSearch onTechBadgeSelect={(techBadge) => handleAddTechBadge(techBadge)} />
                                </div>
                                <div className='flex flex-wrap gap-3 w-full max-xl:justify-center'>
                                    {localData.techBadges.map(techBadge => (
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
                                                onClick={() => handleDeleteTechBadge(techBadge.$id)}
                                            >
                                                <FaTrash size={16} className='text-white' />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='flex flex-col gap-4 w-full bg-my-background-200 border border-border rounded-md p-3'>
                                <div className='flex justify-between items-center max-lg:flex-wrap max-xl:gap-2 max-xl:flex-col'>
                                    <h3>Images</h3>
                                    <div className='flex gap-4 flex-wrap max-xl:justify-center'>
                                        <Button
                                            variant="primary"
                                            onClick={() => handleAddImage(true)}
                                        >
                                            <FaArrowUp />
                                            Add Image Top
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={() => handleAddImage(false)}
                                        >
                                            <FaArrowDown />
                                            Add Image Bottom
                                        </Button>
                                    </div>
                                </div>
                                <div className='flex flex-wrap gap-3 w-full'>
                                    {localData.images.map((image, index) => (
                                        <div key={index} className="p-3 w-full flex items-center gap-4 rounded-md mb-2 bg-my-accent max-3xl:flex-wrap max-xl:justify-center">
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
                                                onChange={(value) => handleChangeImageField(index, 'src', value)}
                                            />
                                            <AdminInput
                                                icon="text"
                                                placeholder="Image alt text"
                                                inputValue={image.alt}
                                                onChange={(value) => handleChangeImageField(index, 'alt', value)}
                                            />
                                            <Button
                                                variant="destructive"
                                                className="ml-auto max-3xl:ml-0"
                                                onClick={() => handleDeleteImage(index)}
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