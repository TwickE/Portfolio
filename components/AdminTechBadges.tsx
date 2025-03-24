import { Button } from "@/components/ui/button";
import { FaCloudUploadAlt, FaTrash, FaPlus, FaSave } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getTechBadges, updateTechBadge, addTechBadge } from "@/lib/actions/file.actions";
import { TechBadgeType } from "@/types/interfaces";
import Image from "next/image";
import { AdminInput } from "@/components/AdminSmallComponents";
import usePickImage from "@/hooks/usePickImage";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const AdminTechBadges = () => {
    // State to store the tech badges and track their changes
    const [techBadgesData, setTechBadgesData] = useState<Record<string, TechBadgeType>>({});
    // State to track the saving status of each tech badge
    const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});

    // Custom hook to pick an image from the user's device
    const pickImage = usePickImage();

    useEffect(() => {
        const fetchTechBadges = async () => {
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
            }
        };
        fetchTechBadges();
    }, []);

    const handleTechBadgeInputChange = (techBadgeId: string, value: string) => {
        const techBadge = techBadgesData[techBadgeId];
        if (!techBadge) return;

        // Track the change
        setTechBadgesData(prev => ({
            ...prev,
            [techBadgeId]: {
                ...prev[techBadgeId] || techBadge,
                ["techBadgeName"]: value
            }
        }));
    }

    const checkEmptyFields = (techBadgeId: string) => {
        const techBadge = techBadgesData[techBadgeId];
        if (!techBadge) return false;

        if (!techBadge.techBadgeName.trim()) {
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
                    techBadgeName: techBadge.techBadgeName,
                    icon: techBadge.icon,
                    iconFile: techBadge.iconFile,
                    newTechBadge: techBadge.newTechBadge,
                    bucketFileId: techBadge.bucketFileId
                });

                if (!response) {
                    toast.error(`Failed to add skill: ${techBadge.techBadgeName}`);
                    return; // This now exits the entire function
                }
            } else {
                const response = await updateTechBadge({
                    $id: techBadge.$id,
                    techBadgeName: techBadge.techBadgeName,
                    icon: techBadge.icon,
                    iconFile: techBadge.iconFile,
                    bucketFileId: techBadge.bucketFileId,
                    newTechBadge: techBadge.newTechBadge
                });

                if (!response) {
                    toast.error(`Failed to update tech badge: ${techBadge.techBadgeName}`);
                    return; // This now exits the entire function
                }
            }
        } catch {
            toast.error(`Error updating tech badge: ${techBadge.techBadgeName}`);
            return; // This now exits the entire function
        } finally {
            setIsSaving(prev => ({
                ...prev,
                [techBadgeId]: false
            }));
        }

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
            techBadgeName: "",
            icon: "",
            bucketFileId: "",
            newTechBadge: true
        }

        setTechBadgesData(prev => ({
            [newTechBadge.$id]: newTechBadge,
            ...prev
        })); // Add the new tech badge to the state
    }

    return (
        <section className="h-full">
            <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl w-fit">Tech Badges</h2>
                <Button onClick={handleAddNewTechBadge}>
                    <FaPlus />
                    Add Tech Badge
                </Button>
            </div>
            <div className="h-[calc(100%-36px-16px)] overflow-y-auto">
                {Object.values(techBadgesData).map((techBadge, index) => (
                    <div key={index} className="p-3 flex items-center gap-4 flex-wrap rounded-md mb-2 bg-my-accent">
                        <div className="grid place-content-center rounded-xl bg-background w-[76px] h-[76px]">
                            <Image
                                src={techBadge.icon || "/images/noImage.webp"}
                                width={60}
                                height={60}
                                alt="Skill Icon"
                                className="object-contain object-center max-w-[60px] max-h-[60px]"
                            />
                        </div>
                        <Button onClick={() => handleUpdateIcon(techBadge.$id)}>
                            <FaCloudUploadAlt size={16} />
                            Upload Icon
                        </Button>
                        <AdminInput
                            icon="text"
                            inputValue={techBadge.techBadgeName}
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
                            /* onClick={() => handleDeleteSkill(skill.$id, skill.bucketFileId, skill.newSkill)} */
                            >
                                <FaTrash />
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default AdminTechBadges