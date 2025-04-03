"use client";

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState, useEffect, useCallback } from 'react';
import { GripVertical } from 'lucide-react';
import { FaTrash, FaPlus, FaSave} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { FaRotate } from "react-icons/fa6";
import { AdminDropDown, AdminInput } from "@/components/AdminSmallComponents";
import { addResumeItem, deleteResumeItem, getResume, updateResumeItems } from "@/lib/actions/file.actions";
import { ResumeItemProps } from "@/types/interfaces";
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
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton";

const NUMBER_OF_SKELETONS = 8;

const AdminResume = ({ type }: { type: "education" | "work" }) => {
    // State to store the main skills and track their changes
    const [resumeData, setResumeData] = useState<Record<string, ResumeItemProps>>({});
    // State to track if the data is being saved
    const [isSaving, setIsSaving] = useState(false);
    // State to track if the data is being fetched
    const [isFetchingData, setIsFetchingData] = useState(false);
    // State to track the if the alert dialog is open
    const [alertOpen, setAlertOpen] = useState(false);
    // State to store the delete action
    const [deleteAction, setDeleteAction] = useState<(() => Promise<void>) | null>(null);

    const fetchResume = useCallback(async () => {
        setIsFetchingData(true);
        try {
            if (type === 'education') {
                const educationData = await getResume({ type: "school" });
                if (educationData) {
                    setResumeData(
                        educationData.reduce((acc, resumeItem) => {
                            acc[resumeItem.$id] = resumeItem;
                            return acc;
                        }, {} as Record<string, ResumeItemProps>)
                    );
                }
            } else {
                const workData = await getResume({ type: "work" });
                if (workData) {
                    setResumeData(
                        workData.reduce((acc, resumeItem) => {
                            acc[resumeItem.$id] = resumeItem;
                            return acc;
                        }, {} as Record<string, ResumeItemProps>)
                    );
                }
            }
        } catch (error) {
            console.error("Failed to fetch resume data:", error);
        } finally {
            setIsFetchingData(false);
        }
    }, [type]);

    // Fetches the resume data when the component mounts
    useEffect(() => {
        fetchResume();
    }, [fetchResume]);

    const handleRefresh = () => {
        fetchResume();
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDragEnd = (result: any) => {
        if (!result.destination) return; // Prevent errors if dropped outside the list

        const reorderedResumeItems = Object.values(resumeData);
        const [movedResumeItem] = reorderedResumeItems.splice(result.source.index, 1);
        reorderedResumeItems.splice(result.destination.index, 0, movedResumeItem);

        // Update the order property of each skill
        const updatedResumeItem = reorderedResumeItems.map((resumeItem, index) => ({
            ...resumeItem,
            order: index + 1 // Update order based on new position
        }));

        setResumeData(updatedResumeItem.reduce((acc, resumeItem) => {
            acc[resumeItem.$id] = resumeItem;
            return acc;
        }, {} as Record<string, ResumeItemProps>));
    }

    const handleDropDownChange = (resumeItemId: string, value: string) => {
        // Update the resume item with the new icon value
        setResumeData(prev => ({
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
        const resumeItem = resumeData[resumeItemId];
        if (!resumeItem) return;

        // Track the change
        setResumeData(prev => ({
            ...prev,
            [resumeItemId]: {
                ...prev[resumeItemId] || resumeItem,
                [field]: value
            }
        }));
    }

    const validateFields = (resumeItemId: string) => {
        const resumeItem = resumeData[resumeItemId];
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

    const handleUpdateResumeItems = async () => {
        setIsSaving(true);

        // First validate all skills
        let hasValidationErrors = false;
        for (const resumeItem of Object.values(resumeData)) {
            if (validateFields(resumeItem.$id)) {
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
            for (const resumeItem of Object.values(resumeData)) {
                try {
                    const response = await (resumeItem.new
                        ? addResumeItem({
                            icon: resumeItem.icon,
                            date: resumeItem.date,
                            text1: resumeItem.text1,
                            text2: resumeItem.text2,
                            order: resumeItem.order
                        })
                        : updateResumeItems({
                            $id: resumeItem.$id,
                            icon: resumeItem.icon,
                            date: resumeItem.date,
                            text1: resumeItem.text1,
                            text2: resumeItem.text2,
                            order: resumeItem.order,
                        })
                    );

                    if (!response) {
                        toast.error(`Failed to ${resumeItem.new ? 'add' : 'update'} resume item: ${resumeItem.text1}`);
                        hasProcessingErrors = true;
                        break;
                    }
                } catch (error) {
                    toast.error(`Error processing resume item: ${resumeItem.text1}`);
                    console.error("Error processing resume item:", error);
                    hasProcessingErrors = true;
                    break;
                }
            }
        } finally {
            setIsSaving(false);
        }

        if (!hasProcessingErrors) {
            await fetchResume();  // Refetch the resume items to update the UI
            toast.success("Resume items updated successfully");
        }
    }

    const handleAddNewResumeItem = () => {
        const tempId = `temp-${Date.now()}`; // Generate a temporary ID for the new resume item

        const newResumeItem: ResumeItemProps = {
            $id: tempId,
            icon: type === 'education' ? "school" : "work",
            date: "",
            text1: "",
            text2: "",
            order: 1,
            new: true
        }

        setResumeData(prev => ({
            [newResumeItem.$id]: newResumeItem,
            ...prev
        })); // Add the new project card to the state
    }

    const handleDeleteResumeItem = (resumeItemId: string, newResumeItem: boolean) => {
        // Create the delete function with the current resume item data captured in closure
        const executeDeleteResumeItem = async () => {
            try {
                // Remove the resume item from local state
                setResumeData(prev => {
                    const newState = { ...prev };
                    delete newState[resumeItemId];
                    return newState;
                });

                // Only calls if it's not a new resume item
                if (!newResumeItem) {
                    await deleteResumeItem(resumeItemId);
                }

                toast.success("Resume item deleted successfully");
            } catch (error) {
                console.error("Delete error:", error);
                toast.error("Failed to delete resume item");
            } finally {
                // Reset and close dialog
                setDeleteAction(null);
                setAlertOpen(false);
            }
        };

        // Store the delete function and open dialog
        setDeleteAction(() => executeDeleteResumeItem);
        setAlertOpen(true);
    };

    return (
        <>
            <section className="h-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl w-fit">{type === 'education' ? 'Education' : 'Work Experience'}</h2>
                    <div className="flex items-center gap-4">
                        <Button onClick={handleRefresh}>
                            <FaRotate />
                            Refresh
                        </Button>
                        <Button variant="primary" onClick={handleAddNewResumeItem}>
                            <FaPlus />
                            Add
                        </Button>
                        <Button variant="save" onClick={handleUpdateResumeItems} disabled={isSaving}>
                            {isSaving ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSave />}
                            Save
                        </Button>
                    </div>
                </div>
                {isFetchingData ? (
                    <div className="h-[calc(100%-36px-16px)] overflow-y-auto">
                        {Array(NUMBER_OF_SKELETONS).fill(0).map((_, index) => (
                            <Skeleton key={index} className="w-full h-15 rounded-md mb-2" />
                        ))}
                    </div>
                ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="h-[calc(100%-36px-16px)] overflow-y-auto">
                                    {Object.values(resumeData).map((resumeItem, index) => (
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