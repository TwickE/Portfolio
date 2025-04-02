"use client";

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState, useEffect, useCallback } from 'react';
import { GripVertical } from 'lucide-react';
import { FaCloudUploadAlt, FaTrash, FaPlus, FaSave, FaGraduationCap, FaBriefcase } from "react-icons/fa";
import { PiCertificateFill } from "react-icons/pi";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { FaRotate } from "react-icons/fa6";
import { AdminDropDown, AdminInput } from "@/components/AdminSmallComponents";
import { getResume } from "@/lib/actions/file.actions";
import { ResumeItemProps } from "@/types/interfaces";
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

const AdminResume = ({ type }: { type: "education" | "work" }) => {
    // State to store the main skills and track their changes
    const [resumeData, setResumeData] = useState<Record<string, ResumeItemProps>>({});

    // Fetches the resume data when the component mounts
    useEffect(() => {
        const fetchResume = async () => {
            //setIsLoading(true);
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
                //setIsLoading(false);
            }
        };
        fetchResume();
    }, []);

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
                ...(prev[resumeItemId].new ? {} : { modified: true })
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

    return (
        <>
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl w-fit">{type === 'education' ? 'Education' : 'Work Experience'}</h2>
                    <div className="flex items-center gap-4">
                        <Button /* onClick={handleRefresh} */>
                            <FaRotate />
                            Refresh
                        </Button>
                        <Button variant="primary" /* onClick={handleAddNewSkill} */>
                            <FaPlus />
                            Add
                        </Button>
                        <Button variant="save" /* onClick={handleUpdateSkills} disabled={isSaving} */>
                            {/* {isSaving ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSave />} */}
                            <FaSave />
                            Save
                        </Button>
                    </div>
                </div>
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
                                                        onClick={() => console.log("Delete item")} // () => handleDeleteSkill(skill.$id, skill.bucketFileId, skill.newSkill)
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
            </section>
        </>
    )
}

export default AdminResume