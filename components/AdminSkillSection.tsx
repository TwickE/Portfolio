import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState, useEffect, useCallback } from 'react';
import { GripVertical } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { FaCloudUploadAlt, FaTrash, FaPlus, FaSave } from "react-icons/fa";
import { FaRotate } from "react-icons/fa6";
import { AdminInput } from "@/components/AdminSmallComponents";
import { getSkills, updateSkill, deleteSkill, addSkill } from "@/lib/actions/file.actions";
import { AdminSkill } from "@/types/interfaces";
import { toast } from "sonner";
import usePickImage from "@/hooks/usePickImage";
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
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const NUMBER_OF_SKELETONS = 6;

const AdminSkillSection = ({ isMainSkill }: { isMainSkill: boolean }) => {
    // State to store the main skills and track their changes
    const [skillData, setSkillData] = useState<Record<string, AdminSkill>>({});
    // State to track if the data is being saved
    const [isSaving, setIsSaving] = useState(false);
    // State to track the if the alert dialog is open
    const [alertOpen, setAlertOpen] = useState(false);
    // State to track if the data is being fetched
    const [isFetchingData, setIsFetchingData] = useState(false);
    // State to store the delete action
    const [deleteAction, setDeleteAction] = useState<(() => Promise<void>) | null>(null);

    // Custom hook to pick an image from the user's device
    const pickImage = usePickImage();

    // Gets the skills from the database
    const fetchSkills = useCallback(async () => {
        setIsFetchingData(true);
        try {
            const skills = await getSkills({ isMainSkill });
            if (skills) {
                setSkillData(
                    skills.reduce((acc, skill) => {
                        acc[skill.$id] = skill;
                        return acc;
                    }, {} as Record<string, AdminSkill>)
                );
            }
        } catch (error) {
            console.error("Failed to fetch skills:", error);
            toast.error("Failed to fetch skills");
        } finally {
            setIsFetchingData(false);
        }
    }, [isMainSkill]);

    // Fetches the skills when the component mounts
    useEffect(() => {
        fetchSkills();
    }, [fetchSkills]);

    const handleRefresh = () => {
        fetchSkills();
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDragEnd = (result: any) => {
        if (!result.destination) return; // Prevent errors if dropped outside the list

        const reorderedSkills = Object.values(skillData);
        const [movedSkill] = reorderedSkills.splice(result.source.index, 1);
        reorderedSkills.splice(result.destination.index, 0, movedSkill);

        // Update the order property of each skill
        const updatedSkills = reorderedSkills.map((skill, index) => ({
            ...skill,
            order: index + 1 // Update order based on new position
        }));

        setSkillData(updatedSkills.reduce((acc, skill) => {
            acc[skill.$id] = skill;
            return acc;
        }, {} as Record<string, AdminSkill>));
    }

    const handleSkillInputChange = (skillId: string, field: 'name' | 'link', value: string) => {
        const skill = skillData[skillId];
        if (!skill) return;

        // Track the change
        setSkillData(prev => ({
            ...prev,
            [skillId]: {
                ...prev[skillId] || skill,
                [field]: value
            }
        }));
    }

    const handleUpdateSkills = async () => {
        setIsSaving(true);

        // First validate all skills
        let hasValidationErrors = false;
        for (const skill of Object.values(skillData)) {
            if (checkEmptyFields(skill.$id)) {
                hasValidationErrors = true;
                break;
            }
        }

        if (hasValidationErrors) {
            setIsSaving(false);
            return;
        }

        // Then process all skills
        let hasProcessingErrors = false;
        try {
            for (const skill of Object.values(skillData)) {
                try {
                    // Check if the icon file is provided and within the size limit
                    if (skill.iconFile && skill.iconFile.size > MAX_FILE_SIZE) {
                        toast.error("Image size should not exceed 50MB");
                        hasProcessingErrors = true;
                        break;
                    }

                    // Process the skill
                    const response = await (skill.newSkill
                        ? addSkill({
                            $id: skill.$id,
                            name: skill.name,
                            link: skill.link,
                            icon: skill.icon,
                            order: skill.order,
                            iconFile: skill.iconFile,
                            mainSkill: skill.mainSkill,
                            newSkill: skill.newSkill,
                            bucketFileId: skill.bucketFileId
                        })
                        : updateSkill({
                            $id: skill.$id,
                            name: skill.name,
                            link: skill.link,
                            icon: skill.icon,
                            order: skill.order,
                            iconFile: skill.iconFile,
                            bucketFileId: skill.bucketFileId,
                            mainSkill: skill.mainSkill,
                            newSkill: skill.newSkill
                        })
                    );

                    if (!response) {
                        toast.error(`Failed to ${skill.newSkill ? 'add' : 'update'} skill: ${skill.name}`);
                        hasProcessingErrors = true;
                        break;
                    }
                } catch (error) {
                    toast.error(`Error processing skill: ${skill.name}`);
                    console.error("Error processing skill:", error);
                    hasProcessingErrors = true;
                    break;
                }
            }
        } finally {
            setIsSaving(false);
        }

        if (!hasProcessingErrors) {
            await fetchSkills();  // Refetch the skills to update the UI
            toast.success("Skills updated successfully");
        }
    };

    const handleDeleteSkill = (skillId: string, bucketFileId: string, newSkill: boolean) => {
        // Create the delete function with the current skill data captured in closure
        const executeDeleteSkill = async () => {
            try {
                // Remove the skill from local state
                setSkillData(prev => {
                    const newState = { ...prev };
                    delete newState[skillId];
                    return newState;
                });

                // Only call the API if it's not a new skill
                if (!newSkill) {
                    await deleteSkill({
                        skillId,
                        fileId: bucketFileId
                    });
                }

                toast.success("Skill deleted successfully");
            } catch (error) {
                console.error("Delete error:", error);
                toast.error("Failed to delete skill");
            } finally {
                // Reset and close dialog
                setDeleteAction(null);
                setAlertOpen(false);
            }
        };

        // Store the delete function and open dialog
        setDeleteAction(() => executeDeleteSkill);
        setAlertOpen(true);
    };

    const handleUpdateIcon = async (skillId: string) => {
        const image = await pickImage();

        if (!image) return;

        // Update the preview icon of the skill
        setSkillData(prev => ({
            ...prev,
            [skillId]: {
                ...prev[skillId],
                iconFile: image.file,
                icon: image.fileURL
            }
        }));
    }

    const handleAddNewSkill = () => {
        const tempId = `temp-${Date.now()}`; // Generate a temporary ID for the new skill

        const newSkill: AdminSkill = {
            $id: tempId,
            name: "",
            link: "",
            icon: "",
            bucketFileId: "",
            mainSkill: isMainSkill,
            order: 1,
            newSkill: true
        }

        setSkillData(prev => ({
            [newSkill.$id]: newSkill,
            ...prev
        })); // Add the new skill to the state
    }

    const checkEmptyFields = (skillId: string) => {
        const skill = skillData[skillId];
        if (!skill) return false;

        if (!skill.name.trim()) {
            toast.error("Please provide a name for the skill");
            return true;
        }

        if (!skill.link.trim()) {
            toast.error("Please provide a link for the skill");
            return true;
        }

        if (!skill.icon) {
            toast.error("Please upload an icon for the skill");
            return true;
        }

        return false; // If all required fields are filled, return false (no empty fields)
    }

    return (
        <>
            <section className="h-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl w-fit">{isMainSkill ? 'My Main Skills' : 'My Other Skills'}</h2>
                    <div className="flex items-center gap-4">
                        <Button onClick={handleRefresh}>
                            <FaRotate />
                            Refresh
                        </Button>
                        <Button variant="primary" onClick={handleAddNewSkill}>
                            <FaPlus />
                            Add
                        </Button>
                        <Button variant="save" onClick={handleUpdateSkills} disabled={isSaving}>
                            {isSaving ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSave />}
                            Save
                        </Button>
                    </div>
                </div>
                {isFetchingData ? (
                    <div className="h-[calc(100%-36px-16px)] overflow-y-auto">
                        {Array(NUMBER_OF_SKELETONS).fill(0).map((_, index) => (
                            <Skeleton key={index} className="w-full h-25 rounded-md mb-2" />
                        ))}
                    </div>
                ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="h-[calc(100%-36px-16px)] overflow-y-auto">
                                    {Object.values(skillData).map((skill, index) => (
                                        <Draggable key={skill.$id} draggableId={skill.$id} index={index}>
                                            {(provided, snapshot) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} className={`p-3 flex items-center gap-4 rounded-md mb-2 bg-my-accent ${snapshot.isDragging ? "ring-2 ring-my-primary" : ""}`}>
                                                    <span {...provided.dragHandleProps} className="h-6 bg-my-secondary py-0.5 rounded-sm">
                                                        <GripVertical color='white' size={20} />
                                                    </span>
                                                    <div className="flex items-center gap-4 flex-wrap w-full">
                                                        <p className="text-black dark:text-white">{skill.order}</p>
                                                        <div className="grid place-content-center rounded-xl bg-background w-[76px] h-[76px]">
                                                            <Image
                                                                src={skill.icon || "/noImage.webp"}
                                                                width={60}
                                                                height={60}
                                                                alt="Skill Icon"
                                                                className="object-contain object-center max-w-[60px] max-h-[60px]"
                                                            />
                                                        </div>
                                                        <Button variant="primary" onClick={() => handleUpdateIcon(skill.$id)}>
                                                            <FaCloudUploadAlt />
                                                            Upload Icon
                                                        </Button>
                                                        <AdminInput
                                                            icon="text"
                                                            placeholder="Skill Name"
                                                            inputValue={skill.name}
                                                            onChange={(value) => handleSkillInputChange(skill.$id, 'name', value)}
                                                        />
                                                        <AdminInput
                                                            icon="link"
                                                            placeholder="Skill Link"
                                                            inputValue={skill.link}
                                                            onChange={(value) => handleSkillInputChange(skill.$id, 'link', value)}
                                                        />
                                                        <Button
                                                            variant="destructive"
                                                            className="ml-auto max-4xl:mx-auto"
                                                            onClick={() => handleDeleteSkill(skill.$id, skill.bucketFileId, skill.newSkill)}
                                                        >
                                                            <FaTrash />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
            </section>
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent className="bg-my-accent border-my-secondary">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Skill</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this skill? This action cannot be undone.
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

export default AdminSkillSection