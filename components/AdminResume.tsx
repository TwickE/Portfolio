"use client";

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import { FaTrash, FaPlus, FaSave } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { FaRotate } from "react-icons/fa6";
import { AdminDropDown, AdminInput } from "@/components/AdminSmallComponents";
import { addResumeItem, deleteResumeItem, getResume, updateResumeItems } from "@/lib/actions/resume.actions";
import { ResumeItemProps } from "@/types/interfaces";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ErrorCard from '@/components/ErrorCard';

const NUMBER_OF_SKELETONS = 8;

const AdminResume = ({ type }: { type: "school" | "work" }) => {
    // State to store the main skills and track their changes
    const [localData, setLocalData] = useState<Record<string, ResumeItemProps>>({});
    // State to track the if the alert dialog is open
    const [alertOpen, setAlertOpen] = useState(false);
    // State to store the delete action
    const [deleteAction, setDeleteAction] = useState<(() => Promise<void>) | null>(null);
    // React Query Client
    const queryClient = useQueryClient();

    // Fetch Resume Items from the backend
    const {
        data: resumeData,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['resume', type],
        queryFn: () => getResume({ type }),
        select: (data) => data?.reduce((acc, resumeItem) => {
            acc[resumeItem.$id] = resumeItem;
            return acc;
        }, {} as Record<string, ResumeItemProps>),
        gcTime: 1000 * 60 * 60 * 12, // Cache for 12 hours
    });

    // Effect to set the local data when the resume items changes
    useEffect(() => {
        if (resumeData) setLocalData(resumeData);
    }, [resumeData]);

    const handleRefresh = async () => {
        if (resumeData && localData !== resumeData) {
            setLocalData(resumeData);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDragEnd = (result: any) => {
        if (!result.destination) return; // Prevent errors if dropped outside the list

        const reorderedResumeItems = Object.values(localData);
        const [movedResumeItem] = reorderedResumeItems.splice(result.source.index, 1);
        reorderedResumeItems.splice(result.destination.index, 0, movedResumeItem);

        // Update the order property of each skill
        const updatedResumeItem = reorderedResumeItems.map((resumeItem, index) => ({
            ...resumeItem,
            order: index + 1 // Update order based on new position
        }));

        setLocalData(updatedResumeItem.reduce((acc, resumeItem) => {
            acc[resumeItem.$id] = resumeItem;
            return acc;
        }, {} as Record<string, ResumeItemProps>));
    }

    const handleDropDownChange = (resumeItemId: string, value: string) => {
        // Update the resume item with the new icon value
        setLocalData(prev => ({
            ...prev,
            [resumeItemId]: {
                ...prev[resumeItemId],
                icon: value,
                // Set modified flag if this is not a new item
                ...(prev[resumeItemId].new ? {} : { modified: true }) // Review this line later
            }
        }));
    }

    const handleInputChange = (resumeItemId: string, field: string, value: string) => {
        const resumeItem = localData[resumeItemId];
        if (!resumeItem) return;

        // Track the change
        setLocalData(prev => ({
            ...prev,
            [resumeItemId]: {
                ...prev[resumeItemId] || resumeItem,
                [field]: value
            }
        }));
    }

    const checkEmptyFields = (resumeItemId: string) => {
        const resumeItem = localData[resumeItemId];

        if (!resumeItem) return true;
        if (!resumeItem.date) {
            toast.error("Please provide a date");
            return true;
        }
        if (!resumeItem.text1 || !resumeItem.text2) {
            toast.error("Please fill all text fields");
            return true;
        }
    }

    // Mutation to update and or add skills
    const {
        mutateAsync: updateMutation,
        isPending
    } = useMutation({
        mutationFn: async (resumeItems: ResumeItemProps[]) => {
            for (const resumeItem of resumeItems) {
                const response = resumeItem.new
                    ? await addResumeItem(resumeItem)
                    : await updateResumeItems(resumeItem);

                if (!response) {
                    throw new Error(`Failed to ${resumeItem.new ? "add" : "update"} resume item`);
                }
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['resume', type] });
            toast.success("Resume Items updated successfully");
        },
        onError: (err: unknown) => {
            console.error("Mutation failed:", err);
            toast.error((err as Error).message || "Failed to update resume items");
        },
    });

    const handleUpdateResumeItems = async () => {
        // First validate all resume items
        for (const resumeItem of Object.values(localData)) {
            if (checkEmptyFields(resumeItem.$id)) {
                return;
            }
        }

        await updateMutation(Object.values(localData));
    };

    // Mutation to delete a skill
    const deleteMutation = useMutation({
        mutationFn: async (resumeItemId: string) => {
            return await deleteResumeItem(resumeItemId);
        },
        onSuccess: () => {
            toast.success("Resume Item deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['resume', type] });
        },
        onError: (error) => {
            console.error("Delete error:", error);
            toast.error("Failed to delete resume item");
        },
    });

    const handleDeleteResumeItem = (resumeItemId: string, newResumeItem: boolean) => {
        const executeDeleteSkill = async () => {
            // Always remove from local state immediately
            setLocalData(prev => {
                const newState = { ...prev };
                delete newState[resumeItemId];
                return newState;
            });

            // Only call the backend if it's not a new (unsaved) skill
            if (!newResumeItem) {
                await deleteMutation.mutateAsync(resumeItemId);
            }

            // Reset and close the dialog
            setDeleteAction(null);
            setAlertOpen(false);
        };

        setDeleteAction(() => executeDeleteSkill);
        setAlertOpen(true);
    };

    const handleAddNewResumeItem = () => {
        const tempId = `temp-${Date.now()}`; // Generate a temporary ID for the new resume item

        const newResumeItem: ResumeItemProps = {
            $id: tempId,
            icon: type === 'school' ? "school" : "work",
            date: "",
            text1: "",
            text2: "",
            order: 1,
            new: true
        }

        setLocalData(prev => {
            const updatedResumeItems: Record<string, ResumeItemProps> = {};

            // Add the new resume item first
            updatedResumeItems[newResumeItem.$id] = newResumeItem;

            // Increment the order of all existing resume items
            Object.values(prev).forEach(resumeItem => {
                updatedResumeItems[resumeItem.$id] = {
                    ...resumeItem,
                    order: resumeItem.order + 1 // Increment order
                };
            });

            return updatedResumeItems;
        });
    }

    return (
        <>
            <section className="h-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl w-fit">{type === 'school' ? 'Education' : 'Work Experience'}</h2>
                    <div className="flex items-center gap-4">
                        <Button onClick={handleRefresh}>
                            <FaRotate />
                            Refresh
                        </Button>
                        <Button variant="primary" onClick={handleAddNewResumeItem}>
                            <FaPlus />
                            Add
                        </Button>
                        <Button variant="save" onClick={handleUpdateResumeItems} disabled={isPending}>
                            {isPending ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSave />}
                            Save
                        </Button>
                    </div>
                </div>
                {isLoading ? (
                    <div className="h-[calc(100%-36px-16px)] overflow-y-auto">
                        {Array(NUMBER_OF_SKELETONS).fill(0).map((_, index) => (
                            <Skeleton key={index} className="w-full h-15 rounded-md mb-2" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className='h-full grid place-items-center'>
                        <ErrorCard name="Resume Items" />
                    </div>
                ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="h-[calc(100%-36px-16px)] overflow-y-auto">
                                    {Object.values(localData).map((resumeItem, index) => (
                                        <Draggable key={resumeItem.$id} draggableId={resumeItem.$id} index={index}>
                                            {(provided, snapshot) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} className={`p-3 flex items-center gap-4 rounded-md mb-2 bg-my-accent ${snapshot.isDragging ? "ring-2 ring-my-primary" : ""}`}>
                                                    <span {...provided.dragHandleProps} className="h-6 bg-my-secondary py-0.5 rounded-sm">
                                                        <GripVertical color='white' size={20} />
                                                    </span>
                                                    <div className="flex items-center gap-4 flex-wrap w-full">
                                                        <p className="text-black dark:text-white">{resumeItem.order}</p>
                                                        <AdminDropDown
                                                            selectedValue={resumeItem.icon || "school"}
                                                            type={type}
                                                            onChange={(value) => handleDropDownChange(resumeItem.$id, value)}
                                                        />
                                                        <AdminInput
                                                            icon="date"
                                                            placeholder="Date"
                                                            inputValue={resumeItem.date}
                                                            onChange={(value) => handleInputChange(resumeItem.$id, "date", value)}
                                                        />
                                                        <AdminInput
                                                            icon="text"
                                                            placeholder="Text 1"
                                                            inputValue={resumeItem.text1}
                                                            onChange={(value) => handleInputChange(resumeItem.$id, "text1", value)}
                                                        />
                                                        <AdminInput
                                                            icon="text"
                                                            placeholder="Text 2"
                                                            inputValue={resumeItem.text2}
                                                            onChange={(value) => handleInputChange(resumeItem.$id, "text2", value)}
                                                        />
                                                        <Button
                                                            variant="destructive"
                                                            className="ml-auto max-4xl:mx-auto"
                                                            onClick={() => handleDeleteResumeItem(resumeItem.$id, resumeItem.new)}
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
                        <AlertDialogTitle>Delete Resume Item</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this resume item? This action cannot be undone.
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

export default AdminResume