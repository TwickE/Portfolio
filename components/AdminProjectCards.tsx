"use client";

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState, useEffect, useCallback } from 'react';
import { GripVertical } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { FaTrash, FaPlus, FaSave } from "react-icons/fa";
import { FaRotate } from "react-icons/fa6";
import { AdminCheckBox, AdminDatePicker, AdminInput, AdminLink, AdminTextArea } from "@/components/AdminSmallComponents";
import { getProjectCards } from "@/lib/actions/file.actions";
import { ProjectCardType } from "@/types/interfaces";
import { toast } from "sonner";

const AdminProjectCards = () => {
    // State to store the project cards and track their changes
    const [projectCardsData, setProjectCardsData] = useState<Record<string, ProjectCardType>>({});

    // Gets the tech badges from the database
    const fetchProjectCards = useCallback(async () => {
        try {
            const projectCards = await getProjectCards();

            if (projectCards) {
                const processedData = projectCards.map(card => {
                    // Create a new object to avoid mutating the original
                    return {
                        ...card,
                        // Parse the images JSON string to an array of image objects
                        images: typeof card.images === 'string'
                            ? JSON.parse(card.images)
                            : card.images,
                        // Parse the links JSON string to an array of link objects
                        links: typeof card.links === 'string'
                            ? JSON.parse(card.links)
                            : card.links,
                    };
                });
                // Set the state with the processed data
                setProjectCardsData(
                    processedData.reduce((acc, projectCard) => {
                        acc[projectCard.$id] = projectCard;
                        return acc;
                    }, {} as Record<string, ProjectCardType>)
                );
            }
        } catch (error) {
            console.error("Failed to fetch tech badges:", error);
            toast.error("Failed to load tech badges");
        }
    }, []);

    // Fetches the tech badges when the component mounts
    useEffect(() => {
        fetchProjectCards();
    }, [fetchProjectCards]);

    const handleRefresh = () => {
        fetchProjectCards();
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChangeInput = (projectCardId: string, field: string, value: any) => {
        const projectCard = projectCardsData[projectCardId];
        if (!projectCard) return;

        // Track the change
        setProjectCardsData(prev => ({
            ...prev,
            [projectCardId]: {
                ...prev[projectCardId] || projectCard,
                [field]: value
            }
        }));
    }

    const handleChangeAdminLink = (projectCardId: string, linkIndex: number, url: string, linkType: string) => {
        const projectCard = projectCardsData[projectCardId];
        if (!projectCard) return;

        // Create a copy of the links array (ensuring it exists)
        const updatedLinks = [...(projectCard.links || [])];

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
        setProjectCardsData(prev => ({
            ...prev,
            [projectCardId]: {
                ...prev[projectCardId],
                links: updatedLinks
            }
        }));
    };

    const handleRemoveAdminLink = (projectCardId: string, linkIndex: number) => {
        const projectCard = projectCardsData[projectCardId];
        if (!projectCard || !projectCard.links || projectCard.links.length <= linkIndex) return;

        // Create a copy of the links array
        const updatedLinks = [...projectCard.links];

        // Remove the link at the specified index
        updatedLinks.splice(linkIndex, 1);

        // Update the project card with the new links array
        setProjectCardsData(prev => ({
            ...prev,
            [projectCardId]: {
                ...prev[projectCardId],
                links: updatedLinks
            }
        }));
    };

    const handleChangeAdminCheckBox = (projectCardId: string, checked: boolean) => {
        const projectCard = projectCardsData[projectCardId];
        if (!projectCard) return;

        // Update the project card with the new original value
        setProjectCardsData(prev => ({
            ...prev,
            [projectCardId]: {
                ...prev[projectCardId],
                original: checked
            }
        }));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDragProjectCard = (result: any) => {
        if (!result.destination) return; // Prevent errors if dropped outside the list

        const reorderedProjectCards = Object.values(projectCardsData);
        const [movedProjectCard] = reorderedProjectCards.splice(result.source.index, 1);
        reorderedProjectCards.splice(result.destination.index, 0, movedProjectCard);

        // Update the order property of each skill
        const updatedProjectCards = reorderedProjectCards.map((projectCard, index) => ({
            ...projectCard,
            order: index + 1 // Update order based on new position
        }));

        setProjectCardsData(updatedProjectCards.reduce((acc, projectCard) => {
            acc[projectCard.$id] = projectCard;
            return acc;
        }, {} as Record<string, ProjectCardType>));
    }

    return (
        <>
            <section className="h-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl w-fit">Project Cards</h2>
                    <div className="flex items-center gap-4">
                        <Button onClick={handleRefresh}>
                            <FaRotate />
                            Refresh
                        </Button>
                        <Button variant="primary" /* onClick={handleAddNewSkill} */>
                            <FaPlus />
                            Add Skill
                        </Button>
                        <Button variant="save" /* onClick={handleUpdateSkills} disabled={isSaving} */>
                            {/* {isSaving ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSave />} */}
                            <FaSave />
                            Save
                        </Button>
                    </div>
                </div>
                <DragDropContext onDragEnd={handleDragProjectCard}>
                    <Droppable droppableId="list">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="h-[calc(100%-36px-16px)] overflow-y-auto">
                                {Object.values(projectCardsData).map((projectCard, index) => (
                                    <Draggable key={projectCard.$id} draggableId={projectCard.$id} index={index}>
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} className={`p-3 flex items-center gap-4 rounded-md mb-2 bg-my-accent ${snapshot.isDragging ? "ring-2 ring-my-primary" : ""}`}>
                                                <span {...provided.dragHandleProps} className="h-6 bg-my-secondary py-0.5 rounded-sm">
                                                    <GripVertical color='white' size={20} />
                                                </span>
                                                <div className="flex items-center gap-4 flex-wrap w-full">
                                                    <p className="text-black dark:text-white">{projectCard.order}</p>
                                                    <div className='flex flex-col gap-4'>
                                                        <div className="grid grid-cols-3 grid-rows-3 gap-4">
                                                            <AdminInput
                                                                icon="text"
                                                                placeholder="Title"
                                                                inputValue={projectCard.title}
                                                                onChange={(value) => handleChangeInput(projectCard.$id, 'title', value)}
                                                            />
                                                            <AdminTextArea
                                                                icon="text"
                                                                placeholder="Description"
                                                                inputValue={projectCard.description}
                                                                onChange={(value) => handleChangeInput(projectCard.$id, 'description', value)}
                                                            />
                                                            <AdminLink
                                                                linkType={projectCard.links?.[0]?.text || "Github"}
                                                                inputValue={projectCard.links?.[0]?.url || ""}
                                                                onChange={(url, linkType) => handleChangeAdminLink(projectCard.$id, 0, url, linkType)}
                                                                onRemove={() => handleRemoveAdminLink(projectCard.$id, 0)}
                                                            />
                                                            <AdminDatePicker
                                                                placeholder="Starting Date"
                                                                inputValue={projectCard.startDate}
                                                                onChange={(value) => handleChangeInput(projectCard.$id, 'startDate', value)}
                                                            />
                                                            <AdminLink
                                                                linkType={projectCard.links?.[1]?.text || "Website"}
                                                                inputValue={projectCard.links?.[1]?.url || ""}
                                                                onChange={(url, linkType) => handleChangeAdminLink(projectCard.$id, 1, url, linkType)}
                                                                onRemove={() => handleRemoveAdminLink(projectCard.$id, 1)}
                                                            />
                                                            <AdminDatePicker
                                                                placeholder="Ending Date"
                                                                inputValue={projectCard.endDate}
                                                                onChange={(value) => handleChangeInput(projectCard.$id, 'endDate', value)}
                                                            />
                                                            <AdminLink
                                                                linkType={projectCard.links?.[2]?.text || "Figma"}
                                                                inputValue={projectCard.links?.[2]?.url || ""}
                                                                onChange={(url, linkType) => handleChangeAdminLink(projectCard.$id, 2, url, linkType)}
                                                                onRemove={() => handleRemoveAdminLink(projectCard.$id, 2)}
                                                            />
                                                        </div>
                                                        <AdminCheckBox
                                                            checked={projectCard.original}
                                                            onChange={(checked) => handleChangeAdminCheckBox(projectCard.$id, checked)}
                                                            id={projectCard.$id}
                                                        />
                                                        
                                                    </div>
                                                    <Button
                                                        variant="destructive"
                                                        className="ml-auto max-4xl:mx-auto"
                                                        onClick={() => console.log("Delete project card")} // handleDeleteSkill(skill.$id, skill.bucketFileId, skill.newSkill)
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

export default AdminProjectCards