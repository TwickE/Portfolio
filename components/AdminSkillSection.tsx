"use client";

/* import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useState, useEffect, useCallback } from 'react';
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

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const NUMBER_OF_SKELETONS = 6;

const AdminSkillSection = ({ isMainSkill }: { isMainSkill: boolean }) => {
    const queryClient = useQueryClient();
    const pickImage = usePickImage();

    // Local state to hold edits before saving
    const [editedSkillData, setEditedSkillData] = useState<Record<string, AdminSkill>>({});
    // State for delete confirmation dialog
    const [alertOpen, setAlertOpen] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState<{ skillId: string; bucketFileId: string; newSkill: boolean } | null>(null);

    // --- React Query ---

    // Fetch Skills Query
    const {
        data: fetchedSkillData,
        isLoading: isFetchingData,
        isError: isFetchError,
        refetch
    } = useQuery({
        queryKey: ['skills', isMainSkill],
        queryFn: () => getSkills({ isMainSkill }),
        select: (data) => (data || []).reduce((acc, skill) => {
            acc[skill.$id] = skill;
            return acc;
        }, {} as Record<string, AdminSkill>),
        gcTime: 1000 * 60 * 60 * 12, // Cache for 12 hours
    });

    // Sync fetched data to local editable state
    useEffect(() => {
        if (fetchedSkillData) {
            setEditedSkillData(fetchedSkillData);
        }
    }, [fetchedSkillData]);

    // Add Skill Mutation
    const addMutation = useMutation({
        mutationFn: addSkill,
        onSuccess: (data, variables) => {
            // Optimistically update or invalidate
            queryClient.invalidateQueries({ queryKey: ['skills', isMainSkill] });
            toast.success(`Skill "${variables.name}" added successfully`);
        },
        onError: (error, variables) => {
            console.error("Add skill error:", error);
            toast.error(`Failed to add skill: ${variables.name}`);
        },
    });

    // Update Skill Mutation (handles both update and add for new items)
    const updateMutation = useMutation({
        mutationFn: async (skillsToUpdate: Record<string, AdminSkill>) => {
            const promises = [];
            for (const skill of Object.values(skillsToUpdate)) {
                // Validate fields before attempting mutation
                if (checkEmptyFields(skill.$id, skillsToUpdate)) { // Pass current state for validation
                     throw new Error(`Validation failed for skill: ${skill.name || 'New Skill'}`);
                }
                 // Check if the icon file is provided and within the size limit
                 if (skill.iconFile && skill.iconFile.size > MAX_FILE_SIZE) {
                    throw new Error(`Image size should not exceed 50MB for skill: ${skill.name}`);
                 }

                if (skill.newSkill) {
                    promises.push(addMutation.mutateAsync({ // Use mutateAsync to handle within Promise.all
                        $id: skill.$id, // Pass temp ID if needed by backend, or let backend generate
                        name: skill.name,
                        link: skill.link,
                        icon: skill.icon, // This might be a data URL initially
                        order: skill.order,
                        iconFile: skill.iconFile,
                        mainSkill: skill.mainSkill,
                        newSkill: skill.newSkill, // Flag for backend
                        bucketFileId: skill.bucketFileId // Should be empty for new
                    }));
                } else {
                    promises.push(updateSkill({ // Assuming updateSkill handles file update if iconFile exists
                        $id: skill.$id,
                        name: skill.name,
                        link: skill.link,
                        icon: skill.icon, // URL might be updated if iconFile is processed
                        order: skill.order,
                        iconFile: skill.iconFile, // Pass file if changed
                        bucketFileId: skill.bucketFileId, // Existing ID
                        mainSkill: skill.mainSkill,
                        newSkill: skill.newSkill // Should be false
                    }));
                }
            }
            // Wait for all updates/adds to complete
            await Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['skills', isMainSkill] });
            toast.success("Skills updated successfully");
        },
        onError: (error: Error) => {
            console.error("Update skills error:", error);
            // More specific error from mutationFn will be shown via toast there
             toast.error(`Failed to update skills: ${error.message}`);
        },
    });

    // Delete Skill Mutation
    const deleteMutation = useMutation({
        mutationFn: deleteSkill,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['skills', isMainSkill] });
            toast.success("Skill deleted successfully");
        },
        onError: (error) => {
            console.error("Delete skill error:", error);
            toast.error("Failed to delete skill");
        },
        onSettled: () => {
            setSkillToDelete(null);
            setAlertOpen(false);
        }
    });

    // --- Event Handlers ---

    const handleRefresh = () => {
        refetch();
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(Object.values(editedSkillData));
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const updatedSkills = items.reduce((acc, skill, index) => {
            acc[skill.$id] = { ...skill, order: index + 1 };
            return acc;
        }, {} as Record<string, AdminSkill>);

        setEditedSkillData(updatedSkills);
    };

    const handleSkillInputChange = (skillId: string, field: 'name' | 'link', value: string) => {
        setEditedSkillData(prev => ({
            ...prev,
            [skillId]: {
                ...prev[skillId],
                [field]: value
            }
        }));
    };

    const handleUpdateIcon = async (skillId: string) => {
        const image = await pickImage();
        if (!image) return;

        setEditedSkillData(prev => ({
            ...prev,
            [skillId]: {
                ...prev[skillId],
                iconFile: image.file,
                icon: image.fileURL // Update preview URL
            }
        }));
    };

    const handleAddNewSkill = () => {
        const tempId = `temp-${Date.now()}`;
        const currentSkills = Object.values(editedSkillData);
        const newOrder = currentSkills.length > 0 ? Math.max(...currentSkills.map(s => s.order)) + 1 : 1;


        const newSkill: AdminSkill = {
            $id: tempId,
            name: "",
            link: "",
            icon: "", // Placeholder/Default icon URL if available
            bucketFileId: "",
            mainSkill: isMainSkill,
            order: newOrder, // Add to the end
            newSkill: true, // Mark as new
            iconFile: undefined // No file initially
        };

        setEditedSkillData(prev => ({
            ...prev,
            [newSkill.$id]: newSkill
        }));
    };

     const checkEmptyFields = (skillId: string, dataToCheck: Record<string, AdminSkill>) => {
        const skill = dataToCheck[skillId];
        if (!skill) return false; // Should not happen

        if (!skill.name.trim()) {
            toast.error(`Please provide a name for the skill ${skill.order}`);
            return true;
        }
        if (!skill.link.trim()) {
            toast.error(`Please provide a link for the skill ${skill.name}`);
            return true;
        }
        if (!skill.icon) { // Check if icon URL exists (might be temp URL or existing)
            toast.error(`Please upload an icon for the skill ${skill.name}`);
            return true;
        }
        return false;
    };


    const handleUpdateSkills = () => {
        // Validation happens inside the mutationFn now
        updateMutation.mutate(editedSkillData);
    };

    const handleDeleteSkillClick = (skillId: string, bucketFileId: string, newSkill: boolean) => {
        if (newSkill) {
            // If it's a new skill not yet saved, just remove from local state
            setEditedSkillData(prev => {
                const newState = { ...prev };
                delete newState[skillId];
                // Re-order remaining items if necessary (optional)
                const items = Array.from(Object.values(newState));
                items.sort((a, b) => a.order - b.order);
                const updatedSkills = items.reduce((acc, skill, index) => {
                    acc[skill.$id] = { ...skill, order: index + 1 };
                    return acc;
                }, {} as Record<string, AdminSkill>);
                return updatedSkills;
            });
            toast.success("New skill removed");
        } else {
            // If it's an existing skill, open confirmation dialog
            setSkillToDelete({ skillId, bucketFileId, newSkill });
            setAlertOpen(true);
        }
    };

    const confirmDeleteSkill = () => {
        if (skillToDelete && !skillToDelete.newSkill) {
            deleteMutation.mutate({ skillId: skillToDelete.skillId, fileId: skillToDelete.bucketFileId });
        }
    };


    // --- Render Logic ---
    const skillsToRender = Object.values(editedSkillData).sort((a, b) => a.order - b.order);


    return (
        <>
            <section className="h-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl w-fit">{isMainSkill ? 'My Main Skills' : 'My Other Skills'}</h2>
                    <div className="flex items-center gap-4">
                        <Button onClick={handleRefresh} disabled={isFetchingData || updateMutation.isPending || deleteMutation.isPending}>
                            {isFetchingData ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaRotate />}
                            Refresh
                        </Button>
                        <Button variant="primary" onClick={handleAddNewSkill} disabled={updateMutation.isPending}>
                            <FaPlus />
                            Add
                        </Button>
                        <Button variant="save" onClick={handleUpdateSkills} disabled={updateMutation.isPending || isFetchingData}>
                            {updateMutation.isPending ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSave />}
                            Save
                        </Button>
                    </div>
                </div>

                {isFetchingData ? (
                    <div className="h-[calc(100%-36px-16px)] overflow-y-auto">
                        {Array(NUMBER_OF_SKELETONS).fill(0).map((_, index) => (
                            <Skeleton key={index} className="w-full h-[100px] rounded-md mb-2" /> // Adjusted height
                        ))}
                    </div>
                ) : isFetchError ? (
                     <div className="h-[calc(100%-36px-16px)] grid place-items-center">
                         <p className='text-red-500'>Error fetching skills. Please try refreshing.</p>
                     </div>
                ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="skillsDroppable">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="h-[calc(100%-36px-16px)] overflow-y-auto">
                                    {skillsToRender.map((skill, index) => (
                                        <Draggable key={skill.$id} draggableId={skill.$id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`p-3 flex items-center gap-4 rounded-md mb-2 bg-my-accent ${snapshot.isDragging ? "ring-2 ring-my-primary" : ""} ${deleteMutation.isPending && deleteMutation.variables?.skillId === skill.$id ? 'opacity-50' : ''}`} // Dim item being deleted
                                                >
                                                    <span {...provided.dragHandleProps} className="h-6 bg-my-secondary py-0.5 rounded-sm cursor-grab">
                                                        <GripVertical color='white' size={20} />
                                                    </span>
                                                    <div className="flex items-center gap-4 flex-wrap w-full">
                                                        <p className="text-black dark:text-white font-semibold w-6 text-center">{skill.order}</p>
                                                        <div className="grid place-content-center rounded-xl bg-[url(/lightTransparentPattern.svg)] dark:bg-[url(/darkTransparentPattern.svg)] w-[76px] h-[76px] border border-my-secondary">
                                                            <Image
                                                                src={skill.icon || "/noImage.webp"} // Use placeholder if icon is empty
                                                                width={60}
                                                                height={60}
                                                                alt={skill.name || "Skill Icon"}
                                                                className="object-contain object-center max-w-[60px] max-h-[60px]"
                                                                unoptimized={skill.icon?.startsWith('blob:')} // Prevent optimization for blob URLs
                                                            />
                                                        </div>
                                                        <Button variant="primary" onClick={() => handleUpdateIcon(skill.$id)} disabled={updateMutation.isPending}>
                                                            <FaCloudUploadAlt />
                                                            Upload Icon
                                                        </Button>
                                                        <AdminInput
                                                            icon="text"
                                                            placeholder="Skill Name"
                                                            inputValue={skill.name}
                                                            onChange={(value) => handleSkillInputChange(skill.$id, 'name', value)}
                                                            disabled={updateMutation.isPending}
                                                        />
                                                        <AdminInput
                                                            icon="link"
                                                            placeholder="Skill Link"
                                                            inputValue={skill.link}
                                                            onChange={(value) => handleSkillInputChange(skill.$id, 'link', value)}
                                                            disabled={updateMutation.isPending}
                                                        />
                                                        <Button
                                                            variant="destructive"
                                                            className="ml-auto max-4xl:mx-auto"
                                                            onClick={() => handleDeleteSkillClick(skill.$id, skill.bucketFileId, !!skill.newSkill)}
                                                            disabled={deleteMutation.isPending || updateMutation.isPending}
                                                        >
                                                            {deleteMutation.isPending && deleteMutation.variables?.skillId === skill.$id ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaTrash />}
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
                        <AlertDialogCancel onClick={() => setAlertOpen(false)} disabled={deleteMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteSkill}
                            className="bg-destructive text-white shadow-sm hover:bg-destructive/90"
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default AdminSkillSection; */


import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState, useEffect, useCallback } from 'react';
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
    // State to store the main skills and track their changes
    /* const [skillData, setSkillData] = useState<Record<string, AdminSkill>>({}); */
    // State to track if the data is being saved
    /* const [isSaving, setIsSaving] = useState(false); */
    // State to track if the data is being fetched
    /* const [isFetchingData, setIsFetchingData] = useState(false); */

    // State to track the if the alert dialog is open
    const [alertOpen, setAlertOpen] = useState(false);
    // State to store the delete action
    const [deleteAction, setDeleteAction] = useState<(() => Promise<void>) | null>(null);

    // Custom hook to pick an image from the user's device
    const pickImage = usePickImage();

    /* // Gets the skills from the database
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
    }; */

    const [localData, setLocalData] = useState<Record<string, AdminSkill>>({});

    const {
        data: skillsData,
        isLoading: isLoadingSkills,
        isError: isSkillsError
    } = useQuery({
        queryKey: ['skills', isMainSkill],
        queryFn: () => getSkills({ isMainSkill }),
        select: (data) => data?.reduce((acc, skill) => {
            acc[skill.$id] = skill;
            return acc;
        }, {} as Record<string, AdminSkill>),
        gcTime: 1000 * 60 * 60 * 12, // Cache for 12 hours
    });

    useEffect(() => {
        if (skillsData) setLocalData(skillsData);
    }, [skillsData]);


    // Improve this to not lose unsaved changes
    const handleRefresh = async () => {
        if (skillsData) setLocalData(skillsData);
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

    const handleUpdateSkills = async () => { // THIS IS WHAT TO DO NEXT
        /* setIsSaving(true);

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
        } */
    };

    const handleDeleteSkill = (skillId: string, bucketFileId: string, newSkill: boolean) => {
        // Create the delete function with the current skill data captured in closure
        /* const executeDeleteSkill = async () => {
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
        setAlertOpen(true); */
    }



    const handleAddNewSkill = () => {
        /* const tempId = `temp-${Date.now()}`; // Generate a temporary ID for the new skill

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
        })); // Add the new skill to the state */
    }

    const checkEmptyFields = (skillId: string) => {
        /* const skill = skillData[skillId];
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

        return false; // If all required fields are filled, return false (no empty fields) */
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
                        <Button variant="save" onClick={handleUpdateSkills} /* disabled={isSaving} */>
                            {/* {isSaving ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSave />} */}
                            Save
                        </Button>
                    </div>
                </div>
                {isLoadingSkills ? (
                    <div className="h-[calc(100%-36px-16px)] overflow-y-auto">
                        {Array(NUMBER_OF_SKELETONS).fill(0).map((_, index) => (
                            <Skeleton key={index} className="w-full h-25 rounded-md mb-2" />
                        ))}
                    </div>
                ) : isSkillsError ? (
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



/* import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState, useEffect, useCallback } from 'react';
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
    }

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

export default AdminSkillSection */