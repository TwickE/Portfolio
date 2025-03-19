'use client';

import AdminNavbar from "@/components/AdminNavbar";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { FaCloudUploadAlt, FaTrash, FaPlus, FaSave } from "react-icons/fa";
import { AdminInput } from "@/components/AdminSmallComponents";
import { getSkills, updateSkill, deleteSkill, addSkill } from "@/lib/actions/file.actions";
import { AdminSkill } from "@/types/interfaces";
import { toast } from "sonner";
import usePickImage from "@/hooks/usePickImage";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Admin = () => {
    return (
        <>
            <AdminNavbar />
            <div className='flex flex-col mt-12 responsive-container'>
                <SkillSection />
            </div>
        </>
    )
}

export default Admin;

const SkillSection = () => {
    // State to store the main skills and tracks their changes
    const [mainSkills, setMainSkills] = useState<Record<string, AdminSkill>>({});
    // State to track if the data is being saved
    const [isSaving, setIsSaving] = useState(false);

    // Custom hook to pick an image from the user's device
    const pickImage = usePickImage();

    // Fetches the main skills when the component mounts
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const skills = await getSkills({ isMainSkill: true });
                if (skills) {
                    setMainSkills(
                        skills.reduce((acc, skill) => {
                            acc[skill.$id] = skill;
                            return acc;
                        }, {} as Record<string, AdminSkill>)
                    );
                }
            } catch {
                toast.error("Failed to fetch skills");
            }
        };
        fetchSkills();
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDragEnd = (result: any) => {
        if (!result.destination) return; // Prevent errors if dropped outside the list

        const reorderedSkills = Object.values(mainSkills);
        const [movedSkill] = reorderedSkills.splice(result.source.index, 1);
        reorderedSkills.splice(result.destination.index, 0, movedSkill);

        // Update the order property of each skill
        const updatedSkills = reorderedSkills.map((skill, index) => ({
            ...skill,
            order: index + 1 // Update order based on new position
        }));

        setMainSkills(updatedSkills.reduce((acc, skill) => {
            acc[skill.$id] = skill;
            return acc;
        }, {} as Record<string, AdminSkill>));
    }

    const handleSkillInputChange = (skillId: string, field: 'skillName' | 'link', value: string) => {
        const skill = mainSkills[skillId];
        if (!skill) return;

        // Track the change
        setMainSkills(prev => ({
            ...prev,
            [skillId]: {
                ...prev[skillId] || skill,
                [field]: value
            }
        }));
    }

    const handleUpdateSkills = async () => {
        setIsSaving(true);
        for (const skill of Object.values(mainSkills)) {
            if (checkEmptyFields(skill.$id)) {
                setIsSaving(false);
                return;
            }

            try {
                if (skill.newSkill) {
                    const response = await addSkill({
                        $id: skill.$id,
                        skillName: skill.skillName,
                        link: skill.link,
                        icon: skill.icon,
                        order: skill.order,
                        iconFile: skill.iconFile,
                        mainSkill: skill.mainSkill,
                        newSkill: skill.newSkill,
                        bucketFileId: skill.bucketFileId
                    });

                    if (!response) {
                        toast.error(`Failed to add skill: ${skill.skillName}`);
                        return; // This now exits the entire function
                    }
                } else {
                    const response = await updateSkill({
                        $id: skill.$id,
                        skillName: skill.skillName,
                        link: skill.link,
                        icon: skill.icon,
                        order: skill.order,
                        iconFile: skill.iconFile,
                        bucketFileId: skill.bucketFileId,
                        mainSkill: skill.mainSkill,
                        newSkill: skill.newSkill
                    });

                    if (!response) {
                        toast.error(`Failed to update skill: ${skill.skillName}`);
                        return; // This now exits the entire function
                    }
                }
            } catch {
                toast.error(`Error updating skill: ${skill.skillName}`);
                return; // This now exits the entire function
            } finally {
                setIsSaving(false);
            }
        }

        toast.success("Skills updated successfully");
    }

    const handleDeleteSkill = async (skillId: string, bucketFileId: string, newSkill: boolean) => {
        // Optional: Add confirmation before deletion
        if (!confirm("Are you sure you want to delete this skill? This action cannot be undone.")) {
            return;
        }

        try {
            setMainSkills(prev => {
                const newState = { ...prev };
                delete newState[skillId];
                return newState;
            }); // Remove the skill from local state

            if (newSkill) {
                toast.success("Skill deleted successfully");
                return; // If the skill is new, there's no need to delete from the database
            }

            await deleteSkill({ skillId, fileId: bucketFileId });

            toast.success("Skill deleted successfully");
        } catch {
            toast.error("Failed to delete skill");
        }
    }

    const handleUpdateIcon = async (skillId: string) => {
        const image = await pickImage();

        if (!image) return;

        // Update the preview icon of the skill
        setMainSkills(prev => ({
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
            skillName: "",
            link: "",
            icon: "",
            bucketFileId: "",
            mainSkill: true,
            order: 1,
            newSkill: true
        }

        setMainSkills(prev => ({
            [newSkill.$id]: newSkill,
            ...prev
        })); // Add the new skill to the state
    }

    const checkEmptyFields = (skillId: string) => {
        const skill = mainSkills[skillId];
        if (!skill) return false;

        if (!skill.skillName.trim()) {
            toast.error(`Please provide a name for the skill`);
            return true;
        }

        if (!skill.link.trim()) {
            toast.error(`Please provide a link for the skill`);
            return true;
        }

        if (!skill.icon) {
            toast.error("Please upload an icon for the skill");
            return true;
        }

        // If all required fields are filled, return false (no empty fields)
        return false;
    }

    return (
        <section className="text-white">
            <div className="flex items-start justify-between">
                <h2 className="text-3xl font-bold text-gradient w-fit mb-4">My Main Skills</h2>
                <div className="flex items-center gap-4">
                    <Button onClick={handleAddNewSkill}>
                        <FaPlus />
                        Add New Skill
                    </Button>
                    <Button variant="save" onClick={handleUpdateSkills} disabled={isSaving}>
                        {isSaving ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSave />}
                        Save Changes
                    </Button>
                </div>
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="list">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {Object.values(mainSkills).map((skill, index) => (
                                <Draggable key={skill.$id} draggableId={skill.$id} index={index}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} className={`p-3 flex items-center gap-4 rounded-md mb-2 bg-tertiary-light dark:bg-tertiary-dark ${snapshot.isDragging ? "ring-2 ring-primary" : ""}`}>
                                            <span {...provided.dragHandleProps} className="h-6 bg-secondary py-0.5 rounded-sm">
                                                <GripVertical size={20} />
                                            </span>
                                            <p>{skill.order}</p>
                                            <div className="grid place-content-center rounded-xl bg-light-mode-100 dark:bg-dark-mode-100 w-[76px] h-[76px]">
                                                <Image
                                                    src={skill.icon || "/assets/images/noImage.webp"}
                                                    width={60}
                                                    height={60}
                                                    alt="Skill Icon"
                                                    className="object-contain object-center max-w-[60px] max-h-[60px]"
                                                />
                                            </div>
                                            <Button onClick={() => handleUpdateIcon(skill.$id)}>
                                                <FaCloudUploadAlt size={16} />
                                                Upload Icon
                                            </Button>
                                            <AdminInput
                                                icon="text"
                                                inputValue={skill.skillName}
                                                onChange={(value) => handleSkillInputChange(skill.$id, 'skillName', value)}
                                            />
                                            <AdminInput
                                                icon="link"
                                                inputValue={skill.link}
                                                onChange={(value) => handleSkillInputChange(skill.$id, 'link', value)}
                                            />
                                            <Button variant="destructive" className="ml-auto" onClick={() => handleDeleteSkill(skill.$id, skill.bucketFileId, skill.newSkill)}>
                                                <FaTrash />
                                                Delete Skill
                                            </Button>
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
    )
}