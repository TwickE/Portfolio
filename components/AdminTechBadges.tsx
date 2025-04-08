import { Button } from "@/components/ui/button";
import { FaCloudUploadAlt, FaTrash, FaPlus, FaSave } from "react-icons/fa";
import { FaRotate } from "react-icons/fa6";
import { useState, useEffect, useCallback } from "react";
import { getTechBadges, updateTechBadge, addTechBadge, deleteTechBadge } from "@/lib/actions/file.actions";
import { TechBadgeType } from "@/types/interfaces";
import Image from "next/image";
import { AdminInput } from "@/components/AdminSmallComponents";
import usePickImage from "@/hooks/usePickImage";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const NUMBER_OF_SKELETONS = 6;

const AdminTechBadges = () => {
    // State to store the tech badges and track their changes
    const [techBadgesData, setTechBadgesData] = useState<Record<string, TechBadgeType>>({});
    // State to track the saving status of each tech badge
    const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});
    // State to track the if the alert dialog is open
    const [alertOpen, setAlertOpen] = useState(false);
    // State to track if the data is being fetched
    const [isFetchingData, setIsFetchingData] = useState(false);
    // State to store the delete action
    const [deleteAction, setDeleteAction] = useState<(() => Promise<void>) | null>(null);

    // Custom hook to pick an image from the user's device
    const pickImage = usePickImage();

    // Gets the tech badges from the database
    const fetchTechBadges = useCallback(async () => {
        setIsFetchingData(true);
        try {
            const techBadges = await getTechBadges();

            if (techBadges) {
                setTechBadgesData(
                    techBadges.reduce((acc, techBadge) => {
                        acc[techBadge.$id] = techBadge;
                        return acc;
                    }, {} as Record<string, TechBadgeType>)
                );
                setIsSaving(
                    techBadges.reduce((acc, techBadge) => {
                        acc[techBadge.$id] = false;
                        return acc;
                    }, {} as Record<string, boolean>)
                );
            }
        } catch (error) {
            console.error("Failed to fetch tech badges:", error);
            toast.error("Failed to load tech badges");
        } finally {
            setIsFetchingData(false);
        }
    }, []);

    // Fetches the tech badges when the component mounts
    useEffect(() => {
        fetchTechBadges();
    }, [fetchTechBadges]);

    const handleRefresh = () => {
        fetchTechBadges();
    };

    const handleTechBadgeInputChange = (techBadgeId: string, value: string) => {
        const techBadge = techBadgesData[techBadgeId];
        if (!techBadge) return;

        // Track the change
        setTechBadgesData(prev => ({
            ...prev,
            [techBadgeId]: {
                ...prev[techBadgeId] || techBadge,
                ["name"]: value
            }
        }));
    }

    const checkEmptyFields = (techBadgeId: string) => {
        const techBadge = techBadgesData[techBadgeId];
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

    const handleUpdateTechBadge = async (techBadgeId: string) => {
        console.log("Updating tech badge", techBadgeId);
        setIsSaving(prev => ({
            ...prev,
            [techBadgeId]: true
        }));

        const techBadge = techBadgesData[techBadgeId];

        if (checkEmptyFields(techBadge.$id)) {
            setIsSaving(prev => ({
                ...prev,
                [techBadgeId]: false
            }));
            return;
        }

        try {
            // Check if the icon file is provided and within the size limit
            if (techBadge.iconFile) {
                if (techBadge.iconFile?.size > MAX_FILE_SIZE) {
                    toast.error("Image size should not exceed 50MB");
                    setIsSaving(prev => ({
                        ...prev,
                        [techBadgeId]: false
                    }));
                    return;
                }
            }

            if (techBadge.newTechBadge) {
                const response = await addTechBadge({
                    $id: techBadge.$id,
                    name: techBadge.name,
                    icon: techBadge.icon,
                    iconFile: techBadge.iconFile,
                    newTechBadge: techBadge.newTechBadge,
                    bucketFileId: techBadge.bucketFileId
                });

                if (!response) {
                    toast.error(`Failed to add tech badge: ${techBadge.name}`);
                    return; // This now exits the entire function
                }
            } else {
                const response = await updateTechBadge({
                    $id: techBadge.$id,
                    name: techBadge.name,
                    icon: techBadge.icon,
                    iconFile: techBadge.iconFile,
                    bucketFileId: techBadge.bucketFileId,
                    newTechBadge: techBadge.newTechBadge
                });

                if (!response) {
                    toast.error(`Failed to update tech badge: ${techBadge.name}`);
                    return; // This now exits the entire function
                }
            }
        } catch {
            toast.error(`Error updating tech badge: ${techBadge.name}`);
            return; // This now exits the entire function
        } finally {
            setIsSaving(prev => ({
                ...prev,
                [techBadgeId]: false
            }));
        }
        fetchTechBadges(); // Refetch the tech badges to update the UI
        toast.success("Tech Badge updated successfully");
    }

    const handleUpdateIcon = async (techBadgeId: string) => {
        const image = await pickImage();

        if (!image) return;

        // Update the preview icon of the skill
        setTechBadgesData(prev => ({
            ...prev,
            [techBadgeId]: {
                ...prev[techBadgeId],
                iconFile: image.file,
                icon: image.fileURL
            }
        }));
    }

    const handleAddNewTechBadge = () => {
        const tempId = `temp-${Date.now()}`; // Generate a temporary ID for the new tech badge

        const newTechBadge: TechBadgeType = {
            $id: tempId,
            name: "",
            icon: "",
            bucketFileId: "",
            newTechBadge: true
        }

        setTechBadgesData(prev => ({
            [newTechBadge.$id]: newTechBadge,
            ...prev
        })); // Add the new tech badge to the state
    }

    const handleDeleteTechBadge = (techBadgeId: string, bucketFileId: string, newTechBadge: boolean) => {
        // Create the delete function with the current skill data captured in closure
        const executeDeleteTechBadge = async () => {
            try {
                // Remove the skill from local state
                setTechBadgesData(prev => {
                    const newState = { ...prev };
                    delete newState[techBadgeId];
                    return newState;
                });

                const techBadge = techBadgesData[techBadgeId];

                // Only call the API if it's not a new skill
                if (!newTechBadge) {
                    await deleteTechBadge({
                        $id: techBadgeId,
                        bucketFileId,
                        newTechBadge: techBadge.newTechBadge,
                        icon: techBadge.icon,
                        iconFile: techBadge.iconFile,
                        name: techBadge.name
                    });
                }

                toast.success("Tech Badge deleted successfully");
            } catch (error) {
                console.error("Delete error:", error);
                toast.error("Failed to delete Tech Badge");
            } finally {
                // Reset and close dialog
                setDeleteAction(null);
                setAlertOpen(false);
            }
        };

        // Store the delete function and open dialog
        setDeleteAction(() => executeDeleteTechBadge);
        setAlertOpen(true);
    };

    return (
        <>
            <section className="h-full">
                <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl w-fit">Tech Badges</h2>
                    <div className="flex items-center gap-4">
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
                <div className="h-[calc(100%-36px-16px)] overflow-y-auto">
                    {isFetchingData ? (
                        Array(NUMBER_OF_SKELETONS).fill(0).map((_, index) => (
                            <Skeleton key={index} className="w-full h-25 rounded-md mb-2" />
                        ))
                    ) : (
                        Object.values(techBadgesData).map((techBadge, index) => (
                            <div key={index} className="p-3 flex items-center gap-4 flex-wrap rounded-md mb-2 bg-my-accent">
                                <div className="grid place-content-center rounded-xl bg-background w-[76px] h-[76px]">
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
                                <div className="flex items-center gap-4 ml-auto">
                                    <Button
                                        variant="save"
                                        onClick={() => handleUpdateTechBadge(techBadge.$id)}
                                        disabled={isSaving[techBadge.$id]}
                                    >
                                        {isSaving[techBadge.$id] ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSave />}
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