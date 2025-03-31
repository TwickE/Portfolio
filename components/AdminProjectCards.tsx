"use client";

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState, useEffect, useCallback } from 'react';
import { GripVertical } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { FaTrash, FaPlus, FaSave, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { FaRotate } from "react-icons/fa6";
import { AdminCheckBox, AdminDatePicker, AdminInput, AdminLink, AdminSearch, AdminTextArea } from "@/components/AdminSmallComponents";
import { getProjectCards } from "@/lib/actions/file.actions";
import { ProjectCardType, TechBadgeType } from "@/types/interfaces";
import { toast } from "sonner";
import TechBadge from "@/components/TechBadge";

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

    const handleAddTechBadge = (projectCardId: string, techBadge: TechBadgeType) => {
        const projectCard = projectCardsData[projectCardId];
        if (!projectCard) return;

        // Check if tech badge already exists
        if (projectCard.techBadges.some(tb => tb.$id === techBadge.$id)) {
            toast.error("Tech badge already added");
            return;
        }

        // Create a copy of the techBadges array
        const updatedTechBadges = [...projectCard.techBadges, techBadge];

        // Update the projectCard with the new techBadges array
        setProjectCardsData(prev => ({
            ...prev,
            [projectCardId]: {
                ...prev[projectCardId],
                techBadges: updatedTechBadges
            }
        }));
    };

    const handleDeleteTechBadge = (projectCardId: string, techBadgeId: string) => {
        const projectCard = projectCardsData[projectCardId];
        if (!projectCard || !projectCard.techBadges) return;

        // Find the tech badge to be deleted
        const techBadgeIndex = projectCard.techBadges.findIndex(tb => tb.$id === techBadgeId);

        // If tech badge not found, return
        if (techBadgeIndex === -1) {
            toast.error(`Tech badge with ID ${techBadgeId} not found in project card ${projectCardId}`);
            return;
        }

        // Create a copy of the tech badges array
        const updatedTechBadges = [...projectCard.techBadges];

        // Remove the tech badge at the found index
        updatedTechBadges.splice(techBadgeIndex, 1);

        // Update the project card with the new tech badges array
        setProjectCardsData(prev => ({
            ...prev,
            [projectCardId]: {
                ...prev[projectCardId],
                techBadges: updatedTechBadges
            }
        }));

        toast.success("Tech badge removed");
    };

    const handleChangeImageField = (projectCardId: string, imageIndex: number, field: string, value: string) => {
        const projectCard = projectCardsData[projectCardId];
        if (!projectCard || !projectCard.images) return;

        // Create a copy of the images array
        const updatedImages = [...projectCard.images];

        // Ensure the array has enough elements
        if (imageIndex >= updatedImages.length) {
            console.error(`Image index ${imageIndex} is out of bounds for project card ${projectCardId}`);
            return;
        }

        // Update the specific field of the image at the given index
        updatedImages[imageIndex] = {
            ...updatedImages[imageIndex],
            [field]: value
        };

        // Update the project card with the new images array
        setProjectCardsData(prev => ({
            ...prev,
            [projectCardId]: {
                ...prev[projectCardId],
                images: updatedImages
            }
        }));
    };

    const handleDeleteImage = (projectCardId: string, imageIndex: number) => {
        const projectCard = projectCardsData[projectCardId];
        if (!projectCard || !projectCard.images || projectCard.images.length <= imageIndex) return;

        // Create a copy of the images array
        const updatedImages = [...projectCard.images];

        // Remove the image at the specified index
        updatedImages.splice(imageIndex, 1);

        // Update the project card with the new images array
        setProjectCardsData(prev => ({
            ...prev,
            [projectCardId]: {
                ...prev[projectCardId],
                images: updatedImages
            }
        }));

        toast.success("Image removed");
    };

    // Add a new image to the top or bottom of the images array
    const handleAddImage = (projectCardId: string, top: boolean) => {
        const projectCard = projectCardsData[projectCardId];
        if (!projectCard) return;

        // Create a copy of the images array (ensuring it exists)
        const updatedImages = [...(projectCard.images || [])];

        if (top) {
            // Add a new empty image at the beginning of the array
            updatedImages.unshift({
                src: '',
                alt: ''
            });
        } else {
            // Add a new empty image at the end of the array
            updatedImages.push({
                src: '',
                alt: ''
            });
        }

        // Update the project card with the new images array
        setProjectCardsData(prev => ({
            ...prev,
            [projectCardId]: {
                ...prev[projectCardId],
                images: updatedImages
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

    const validateFields = (projectCardId: string) => {
        const projectCard = projectCardsData[projectCardId];
        if (!projectCard) return true;

        if (!projectCard.title) {
            toast.error("Please provide a title");
            return true;
        }

        if (!projectCard.description) {
            toast.error("Please provide a description");
            return true;
        }

        if (!projectCard.startDate) {
            toast.error("Please provide a starting date");
            return true;
        }

        if (!projectCard.endDate) {
            toast.error("Please provide an ending date");
            return true;
        }

        if (projectCard.links.some(link => !link.url)) {
            toast.error("Please provide a URL for all links");
            return true;
        }

        if (projectCard.links.some(link => !isValidURL(link.url))) {
            toast.error("Please provide valid URLs for all links");
            return true;
        }

        if (projectCard.links.some(link => link.text === "NoLink")) {
            toast.error("Please provide a link type for all links");
            return true;
        }

        if (projectCard.images.some(image => !image.alt)) {
            toast.error("Please provide alt text for all images");
            return true;
        }

        if (projectCard.images.some(image => !image.src)) {
            toast.error("Please provide a URL for all images");
            return true;
        }

        if (projectCard.images.some(image => !isValidURL(image.src))) {
            toast.error("Please provide a valid URL for all images");
            return true;
        }

        return false;
    }


    const handleUpdateProjectCards = async () => {
        //setIsSaving(true);

        // First validate all skills
        let hasValidationErrors = false;
        for (const projectCard of Object.values(projectCardsData)) {
            if (validateFields(projectCard.$id)) {
                hasValidationErrors = true;
                break;
            }
        }

        if (hasValidationErrors) {
            //setIsSaving(false);
            return;
        }
        toast.success("All fields are valid");

        // Then process all skills
        /* let hasProcessingErrors = false;
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
                            Add Project
                        </Button>
                        <Button variant="save" onClick={handleUpdateProjectCards} /* disabled={isSaving} */>
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
                                                    <p>{projectCard.order}</p>
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
                                                                linkType={projectCard.links?.[0]?.text || "NoLink"}
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
                                                                linkType={projectCard.links?.[1]?.text || "NoLink"}
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
                                                                linkType={projectCard.links?.[2]?.text || "NoLink"}
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
                                                        <div className='flex flex-col gap-4 w-full max-w-[806px] bg-my-background-200 border border-border rounded-md p-3'>
                                                            <div className='flex justify-between items-center'>
                                                                <h3>Tech Badges</h3>
                                                                <AdminSearch onTechBadgeSelect={(techBadge) => handleAddTechBadge(projectCard.$id, techBadge)} />
                                                            </div>
                                                            <div className='flex flex-wrap gap-3 w-full max-h-60 overflow-y-auto'>
                                                                {projectCard.techBadges.map(techBadge => (
                                                                    <div
                                                                        key={techBadge.$id}
                                                                        className='flex items-center rounded-s-[19px] rounded-e-md bg-destructive hover:bg-destructive/90'
                                                                    >
                                                                        <TechBadge
                                                                            imgSrc={techBadge.icon}
                                                                            text={techBadge.name}
                                                                        />
                                                                        <button
                                                                            className='cursor-pointer rounded-e-md w-full h-full px-3'
                                                                            onClick={() => handleDeleteTechBadge(projectCard.$id, techBadge.$id)}
                                                                        >
                                                                            <FaTrash size={16} className='text-white' />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className='flex flex-col gap-4 w-full max-w-[806px] bg-my-background-200 border border-border rounded-md p-3'>
                                                            <div className='flex justify-between items-center'>
                                                                <h3>Images</h3>
                                                                <div className='flex gap-4'>
                                                                    <Button
                                                                        variant="primary"
                                                                        onClick={() => handleAddImage(projectCard.$id, true)}
                                                                    >
                                                                        <FaArrowUp />
                                                                        Add Image Top
                                                                    </Button>
                                                                    <Button
                                                                        variant="primary"
                                                                        onClick={() => handleAddImage(projectCard.$id, false)}
                                                                    >
                                                                        <FaArrowDown />
                                                                        Add Image Bottom
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <div className='flex flex-wrap gap-3 w-full max-h-60 overflow-y-auto'>
                                                                {projectCard.images.map((image, index) => (
                                                                    <div key={index} className="p-3 w-full flex items-center gap-4 flex-wrap rounded-md mb-2 bg-my-accent">
                                                                        <div className="grid place-content-center rounded-xl bg-background w-[76px] h-[76px]">
                                                                            <SafeImage
                                                                                src={image.src}
                                                                                alt={image.alt}
                                                                            />
                                                                        </div>
                                                                        <AdminInput
                                                                            icon="link"
                                                                            placeholder="Image URL"
                                                                            inputValue={image.src}
                                                                            onChange={(value) => handleChangeImageField(projectCard.$id, index, 'src', value)}
                                                                        />
                                                                        <AdminInput
                                                                            icon="text"
                                                                            placeholder="Image alt text"
                                                                            inputValue={image.alt}
                                                                            onChange={(value) => handleChangeImageField(projectCard.$id, index, 'alt', value)}
                                                                        />
                                                                        <Button
                                                                            variant="destructive"
                                                                            className="ml-auto max-4xl:mx-auto"
                                                                            onClick={() => handleDeleteImage(projectCard.$id, index)}
                                                                        >
                                                                            <FaTrash />
                                                                            Delete
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
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

const isValidURL = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const SafeImage = ({ src, alt }: { src: string, alt: string }) => {
    const [, setImgSrc] = useState(src);
    const [error, setError] = useState(false);

    const fallbackSrc = "/images/noImage.webp";

    // Use either the provided source or the fallback
    const effectiveSrc = src && isValidURL(src) ? src : fallbackSrc;

    return (
        <Image
            src={error ? fallbackSrc : effectiveSrc}
            width={60}
            height={60}
            alt={alt}
            className="object-contain object-center max-w-[60px] max-h-[60px]"
            onError={() => {
                setError(true);
                setImgSrc(fallbackSrc);
            }}
        />
    );
};