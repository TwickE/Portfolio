"use client";

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { FaCloudUploadAlt, FaTrash, FaPlus, FaSave } from "react-icons/fa";
import { FaRotate } from "react-icons/fa6";
import { AdminInput } from "@/components/AdminSmallComponents";
import { getSkills, updateSkill, deleteSkill, addSkill } from "@/lib/actions/skills.actions";
import { AdminSkill } from "@/types/interfaces";
import { toast } from "sonner";
import usePickImage from "@/hooks/usePickImage";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ErrorCard from '@/components/ErrorCard';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const NUMBER_OF_SKELETONS = 6;

const AdminSkillSection = ({ isMainSkill }: { isMainSkill: boolean }) => {
    // State to track the if the alert dialog is open
    const [alertOpen, setAlertOpen] = useState(false);
    // State to store the delete action
    const [deleteAction, setDeleteAction] = useState<(() => Promise<void>) | null>(null);
    // Custom hook to pick an image from the user's device
    const pickImage = usePickImage();
    // Sate to track the changes to the skills
    const [localData, setLocalData] = useState<Record<string, AdminSkill>>({});
    // React Query Client
    const queryClient = useQueryClient();

    // Fetch Skills Query
    const {
        data: skillsData,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['skills', isMainSkill],
        queryFn: () => getSkills({ isMainSkill }),
        select: (data) => data?.reduce((acc, skill) => {
            acc[skill.$id] = skill;
            return acc;
        }, {} as Record<string, AdminSkill>),
        gcTime: 1000 * 60 * 60 * 12, // Cache for 12 hours
    });

    // Effect to set the local data when skillsData changes
    useEffect(() => {
        if (skillsData) setLocalData(skillsData);
    }, [skillsData]);

    // Refresh function to update the local data with the latest skills data
    const handleRefresh = async () => {
        if (skillsData && localData !== skillsData) {
            setLocalData(skillsData);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDragEnd = (result: any) => {
        if (!result.destination) return; // Prevent errors if dropped outside the list

        const reorderedSkills = Object.values(localData);
        const [movedSkill] = reorderedSkills.splice(result.source.index, 1);
        reorderedSkills.splice(result.destination.index, 0, movedSkill);

        // Update the order property of each skill
        const updatedSkills = reorderedSkills.map((skill, index) => ({
            ...skill,
            order: index + 1 // Update order based on new position
        }));

        setLocalData(updatedSkills.reduce((acc, skill) => {
            acc[skill.$id] = skill;
            return acc;
        }, {} as Record<string, AdminSkill>));
    }

    // Function to handle updating the icon of a skill
    const handleUpdateIcon = async (skillId: string) => {
        const image = await pickImage();

        if (!image) return;

        // Update the preview icon of the skill
        setLocalData(prev => ({
            ...prev,
            [skillId]: {
                ...prev[skillId],
                iconFile: image.file,
                icon: image.fileURL
            }
        }));
    }

    // Function to handle input changes for skill name and link
    const handleSkillInputChange = (skillId: string, field: 'name' | 'link', value: string) => {
        const skill = localData[skillId];
        if (!skill) return;

        // Track the change
        setLocalData(prev => ({
            ...prev,
            [skillId]: {
                ...prev[skillId] || skill,
                [field]: value
            }
        }));
    }

    // Function to check if any required fields are empty
    const checkEmptyFields = (skillId: string) => {
        const skill = localData[skillId];
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

    // Mutation to update and or add skills
    const {
        mutateAsync: updateMutation,
        isPending
    } = useMutation({
        mutationFn: async (skills: AdminSkill[]) => {
            for (const skill of skills) {
                // Validate file size
                if (skill.iconFile && skill.iconFile.size > MAX_FILE_SIZE) {
                    throw new Error(`Image file too large for ${skill.name}`);
                }

                const response = skill.newSkill
                    ? await addSkill(skill)
                    : await updateSkill(skill);

                if (!response) {
                    throw new Error(`Failed to ${skill.newSkill ? "add" : "update"} skills`);
                }
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['skills', isMainSkill] });
            toast.success("Skills updated successfully");
        },
        onError: (err: unknown) => {
            console.error("Mutation failed:", err);
            toast.error((err as Error).message || "Failed to update skills");
        },
    });

    // Function to handle updating and or adding skills
    const handleUpdateSkills = async () => {
        // First validate all skills
        for (const skill of Object.values(localData)) {
            if (checkEmptyFields(skill.$id)) {
                return;
            }
        }

        await updateMutation(Object.values(localData));
    };

    // Mutation to delete a skill
    const deleteMutation = useMutation({
        mutationFn: async ({ skillId, fileId }: { skillId: string; fileId: string }) => {
            return await deleteSkill({ skillId, fileId });
        },
        onSuccess: () => {
            toast.success("Skill deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['skills', isMainSkill] });
        },
        onError: (error) => {
            console.error("Delete error:", error);
            toast.error("Failed to delete skill");
        },
    });

    // Function to handle deleting a skill
    const handleDeleteSkill = (skillId: string, bucketFileId: string, newSkill: boolean) => {
        const executeDeleteSkill = async () => {
            // Always remove from local state immediately
            setLocalData(prev => {
                const newState = { ...prev };
                delete newState[skillId];
                return newState;
            });

            // Only call the backend if it's not a new (unsaved) skill
            if (!newSkill) {
                await deleteMutation.mutateAsync({
                    skillId,
                    fileId: bucketFileId
                });
            }

            // Reset and close the dialog
            setDeleteAction(null);
            setAlertOpen(false);
        };

        setDeleteAction(() => executeDeleteSkill);
        setAlertOpen(true);
    };

    // Function to handle adding a new skill
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

        setLocalData(prev => {
            const updatedSkills: Record<string, AdminSkill> = {};

            // Add the new skill first
            updatedSkills[newSkill.$id] = newSkill;

            // Increment the order of all existing skills
            Object.values(prev).forEach(skill => {
                updatedSkills[skill.$id] = {
                    ...skill,
                    order: skill.order + 1 // Increment order
                };
            });

            return updatedSkills;
        });
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
                        <Button variant="save" onClick={handleUpdateSkills} disabled={isPending}>
                            {isPending ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSave />}
                            Save
                        </Button>
                    </div>
                </div>
                {isLoading ? (
                    <div className="h-[calc(100%-36px-16px)] overflow-y-auto">
                        {Array(NUMBER_OF_SKELETONS).fill(0).map((_, index) => (
                            <Skeleton key={index} className="w-full h-25 rounded-md mb-2" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className='h-full grid place-items-center'>
                        <ErrorCard name="Skills" />
                    </div>
                ) : skillsData && (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="h-[calc(100%-36px-16px)] overflow-y-auto">
                                    {Object.values(localData).map((skill, index) => (
                                        <Draggable key={skill.$id} draggableId={skill.$id} index={index}>
                                            {(provided, snapshot) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} className={`p-3 flex items-center gap-4 rounded-md mb-2 bg-my-accent ${snapshot.isDragging ? "ring-2 ring-my-primary" : ""}`}>
                                                    <span {...provided.dragHandleProps} className="h-6 bg-my-secondary py-0.5 rounded-sm">
                                                        <GripVertical color='white' size={20} />
                                                    </span>
                                                    <div className="flex items-center gap-4 flex-wrap w-full">
                                                        <p className="text-black dark:text-white">{skill.order}</p>
                                                        <div className="grid place-content-center rounded-xl bg-[url(/lightTransparentPattern.svg)] dark:bg-[url(/darkTransparentPattern.svg)] w-[76px] h-[76px]">
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