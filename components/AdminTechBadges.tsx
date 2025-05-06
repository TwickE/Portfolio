"use client";

import { Button } from "@/components/ui/button";
import { FaCloudUploadAlt, FaTrash, FaPlus, FaSave } from "react-icons/fa";
import { FaRotate } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { getTechBadges, updateTechBadge, addTechBadge, deleteTechBadge } from "@/lib/actions/techBadges.actions";
import { TechBadgeType } from "@/types/interfaces";
import Image from "next/image";
import { AdminInput } from "@/components/AdminSmallComponents";
import usePickImage from "@/hooks/usePickImage";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ErrorCard from '@/components/ErrorCard';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const NUMBER_OF_SKELETONS = 6;

const AdminTechBadges = () => {
    // State to store the tech badges and track their changes
    const [localData, setLocalData] = useState<Record<string, TechBadgeType>>({});
    // State to track the if the alert dialog is open
    const [alertOpen, setAlertOpen] = useState(false);
    // State to store the delete action
    const [deleteAction, setDeleteAction] = useState<(() => Promise<void>) | null>(null);
    // Custom hook to pick an image from the user's device
    const pickImage = usePickImage();
    // React Query Client
    const queryClient = useQueryClient();

    // Fetch tech badges from the backend
    const {
        data: techBadgesData,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['techBadges'],
        queryFn: getTechBadges,
        // Transform data into the desired Record format
        select: (data) => (data as TechBadgeType[] | undefined)?.reduce((acc, techBadge) => {
            acc[techBadge.$id] = techBadge;
            return acc;
        }, {} as Record<string, TechBadgeType>) ?? {}, // Provide default empty object
        gcTime: 1000 * 60 * 60 * 12, // Cache for 12 hours
    });

    // Effect to set the local data when techBadgesData changes
    useEffect(() => {
        if (techBadgesData) setLocalData(techBadgesData);
    }, [techBadgesData]);

    const handleRefresh = () => {
        if (techBadgesData && localData !== techBadgesData) {
            setLocalData(techBadgesData);
        }
    }

    const handleTechBadgeInputChange = (techBadgeId: string, value: string) => {
        const techBadge = localData[techBadgeId];
        if (!techBadge) return;

        // Track the change
        setLocalData(prev => ({
            ...prev,
            [techBadgeId]: {
                ...prev[techBadgeId] || techBadge,
                ["name"]: value
            }
        }));
    }

    const handleUpdateIcon = async (techBadgeId: string) => {
        const image = await pickImage();

        if (!image) return;

        // Update the preview icon of the skill
        setLocalData(prev => ({
            ...prev,
            [techBadgeId]: {
                ...prev[techBadgeId],
                iconFile: image.file,
                icon: image.fileURL
            }
        }));
    }

    const checkEmptyFields = (techBadgeId: string) => {
        const techBadge = localData[techBadgeId];
        if (!techBadge) return false;

        if (!techBadge.name.trim()) {
            toast.error("Please provide a name for the tech badge");
            return true;
        }

        if (!techBadge.icon) {
            toast.error("Please upload an icon for the tech badge");
            return true;
        }

        return false; // If all required fields are filled, return false (no empty fields)
    }

    // Mutation to update and or add skills
    const {
        mutateAsync: updateMutation,
        isPending,
        variables
    } = useMutation({
        mutationFn: async (techBadgeId: string) => {
            const techBadge = localData[techBadgeId];

            // Validate file size
            if (techBadge.iconFile && techBadge.iconFile.size > MAX_FILE_SIZE) {
                throw new Error(`Image file too large for ${techBadge.name}`);
            }

            const response = techBadge.newTechBadge
                ? await addTechBadge(techBadge)
                : await updateTechBadge(techBadge);

            if (!response) {
                throw new Error(`Failed to ${techBadge.newTechBadge ? "add" : "update"} tech badge`);
            }

        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['techBadges'] });
            toast.success("Tech Badge updated successfully");
        },
        onError: (err: unknown) => {
            console.error("Mutation failed:", err);
            toast.error((err as Error).message || "Failed to update Tech Badge");
        },
    });

    const handleUpdateTechBadge = async (techBadgeId: string) => {
        // First validate the fields
        if (checkEmptyFields(techBadgeId)) {
            return;
        }

        await updateMutation(techBadgeId);
    };

    // Mutation to delete a tech badge
    const deleteMutation = useMutation({
        mutationFn: async ({ id, fileId }: { id: string; fileId: string }) => {
            return await deleteTechBadge({ id, fileId });
        },
        onSuccess: () => {
            toast.success("Tech Badge deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['techBadges'] });
        },
        onError: (error) => {
            console.error("Delete error:", error);
            toast.error("Failed to delete tech badge");
        },
    });

    const handleDeleteTechBadge = (techBadgeId: string, bucketFileId: string, newTechBadge: boolean) => {
        const executeDeleteTechBadge = async () => {
            // Always remove from local state immediately
            setLocalData(prev => {
                const newState = { ...prev };
                delete newState[techBadgeId];
                return newState;
            });

            // Only call the backend if it's not a new (unsaved) skill
            if (!newTechBadge) {
                await deleteMutation.mutateAsync({
                    id: techBadgeId,
                    fileId: bucketFileId
                });
            }

            // Reset and close the dialog
            setDeleteAction(null);
            setAlertOpen(false);
        };

        setDeleteAction(() => executeDeleteTechBadge);
        setAlertOpen(true);
    };

    const handleAddNewTechBadge = () => {
        const tempId = `temp-${Date.now()}`; // Generate a temporary ID for the new tech badge

        const newTechBadge: TechBadgeType = {
            $id: tempId,
            name: "",
            icon: "",
            bucketFileId: "",
            newTechBadge: true
        }

        setLocalData(prev => ({
            [newTechBadge.$id]: newTechBadge,
            ...prev
        })); // Add the new tech badge to the state
    }

    return (
        <>
            <section className="flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between max-xl:flex-col max-xl:gap-2">
                    <h2 className="text-2xl w-fit">Tech Badges</h2>
                    <div className="flex items-center gap-4 flex-wrap justify-center">
                        <Button onClick={handleRefresh}>
                            <FaRotate />
                            Refresh
                        </Button>
                        <Button variant="primary" onClick={handleAddNewTechBadge}>
                            <FaPlus />
                            Add
                        </Button>
                    </div>
                </div>
                <div className="h-full overflow-y-auto">
                    {isLoading ? (
                        Array(NUMBER_OF_SKELETONS).fill(0).map((_, index) => (
                            <Skeleton key={index} className="w-full h-25 rounded-md mb-2" />
                        ))
                    ) : isError ? (
                        <div className='h-full grid place-items-center'>
                            <ErrorCard name="Tech Badges" />
                        </div>
                    ) : (
                        Object.values(localData).map((techBadge, index) => (
                            <div key={index} className="p-3 flex items-center gap-4 flex-wrap rounded-md mb-2 bg-my-accent max-xl:flex-col">
                                <div className="grid place-content-center rounded-xl bg-[url(/lightTransparentPattern.svg)] dark:bg-[url(/darkTransparentPattern.svg)] w-[76px] h-[76px]">
                                    <Image
                                        src={techBadge.icon || "/noImage.webp"}
                                        width={60}
                                        height={60}
                                        alt="Tech Badge Icon"
                                        className="object-contain object-center max-w-[60px] max-h-[60px]"
                                    />
                                </div>
                                <Button variant="primary" onClick={() => handleUpdateIcon(techBadge.$id)}>
                                    <FaCloudUploadAlt />
                                    Upload Icon
                                </Button>
                                <AdminInput
                                    icon="text"
                                    placeholder="Tech Badge Name"
                                    inputValue={techBadge.name}
                                    onChange={(value) => handleTechBadgeInputChange(techBadge.$id, value)}
                                />
                                <div className="flex items-center max-xl:flex-wrap justify-center gap-4 ml-auto max-3xl:ml-0">
                                    <Button
                                        variant="save"
                                        onClick={() => handleUpdateTechBadge(techBadge.$id)}
                                        disabled={isPending && variables === techBadge.$id}
                                    >
                                        {isPending && variables === techBadge.$id ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSave />}
                                        Save
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="ml-auto max-4xl:mx-auto"
                                        onClick={() => handleDeleteTechBadge(techBadge.$id, techBadge.bucketFileId, techBadge.newTechBadge)}
                                    >
                                        <FaTrash />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent className="bg-my-accent border-my-secondary">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Skill</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this tech badge? This action cannot be undone.
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

export default AdminTechBadges