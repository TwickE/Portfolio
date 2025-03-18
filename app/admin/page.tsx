'use client';

import AdminNavbar from "@/components/AdminNavbar";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { FaCloudUploadAlt, FaTrash, FaPlus, FaSave } from "react-icons/fa";
import { AdminInput } from "@/components/AdminSmallComponents";
import { getSkills, updateSkill, deleteSkill } from "@/lib/actions/file.actions";
import { Skill } from "@/types/interfaces";

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
    // State to store the main skills
    const [mainSkills, setMainSkills] = useState<Skill[]>([]);
    // Track edited skills
    const [editedSkills, setEditedSkills] = useState<Record<string, Skill>>({});

    // Fetches the main skills when the component mounts
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const skills = await getSkills({ isMainSkill: true });
                if (skills) {
                    setMainSkills([...skills].sort((a, b) => a.order - b.order));
                }
            } catch (error) {
                console.error("Failed to fetch skills:", error);
            }
        };
        fetchSkills();
    }, []);

    const handleDragEnd = (result: any) => {
        if (!result.destination) return; // Prevent errors if dropped outside the list

        const reorderedSkills = Array.from(mainSkills);
        const [movedSkill] = reorderedSkills.splice(result.source.index, 1);
        reorderedSkills.splice(result.destination.index, 0, movedSkill);

        // Update the order property of each skill
        const updatedSkills = reorderedSkills.map((skill, index) => ({
            ...skill,
            order: index + 1 // Update order based on new position
        }));

        setMainSkills(updatedSkills);

        // Track changes for each skill that had its order changed
        const newEditedSkills = { ...editedSkills };
        updatedSkills.forEach(skill => {
            if (skill.order !== editedSkills[skill.$id]?.order) {
                newEditedSkills[skill.$id] = { ...skill };
            }
        });
        setEditedSkills(newEditedSkills);
    };

    // Update skill name or link when input changes
    const handleSkillChange = (skillId: string, field: 'skillName' | 'link', value: string) => {
        const skill = mainSkills.find(s => s.$id === skillId);
        if (!skill) return;

        // Track the change
        setEditedSkills(prev => ({
            ...prev,
            [skillId]: {
                ...prev[skillId] || skill,
                [field]: value
            }
        }));
    };

    const handleSaveNewOrder = async () => {
        
    }

    const handleUpdateSkill = async (skillId: string) => {
        try {
            const editedSkill = editedSkills[skillId];
            if (!editedSkill) {
                console.log("No changes to save");
                return;
            }

            console.log("Saving updated skill:", editedSkill);

            // Call the updateSkill function with the edited data
            const updated = await updateSkill({
                $id: skillId,
                skillName: editedSkill.skillName,
                link: editedSkill.link,
                icon: editedSkill.icon,
                order: editedSkill.order
            });

            if (updated) {
                // Update the main skills list with the returned data
                setMainSkills(prev => prev.map(skill =>
                    skill.$id === skillId ? { ...skill, ...updated } : skill
                ));

                // Clear the edited state for this skill
                setEditedSkills(prev => {
                    const newState = { ...prev };
                    delete newState[skillId];
                    return newState;
                });

                console.log("Skill updated successfully:", updated);
            }
        } catch (error) {
            console.error("Failed to update skill:", error);
        }
    };

    const handleDeleteSkill = async (skillId: string) => {
        if (!skillId) {
            console.error("No skill ID provided for deletion");
            return;
        }
    
        // Optional: Add confirmation before deletion
        if (!confirm("Are you sure you want to delete this skill? This action cannot be undone.")) {
            return;
        }
    
        try {
            console.log("Deleting skill with ID:", skillId);
            
            // Call the server action to delete the skill
            await deleteSkill(skillId); 
            
            // Remove the skill from local state
            setMainSkills(prev => prev.filter(skill => skill.$id !== skillId));
            
            // Clean up any edited state for this skill
            if (editedSkills[skillId]) {
                setEditedSkills(prev => {
                    const newState = { ...prev };
                    delete newState[skillId];
                    return newState;
                });
            }
            
            console.log("Skill deleted successfully");
        } catch (error) {
            console.error("Failed to delete skill:", error);
        }
    };

    const handleAddNewSkill = () => {
        console.log("Add new skill");
    }

    const changeIcon = () => {
        console.log("Change icon")
    }

    return (
        <section className="text-white">
            <div className="flex items-start justify-between">
                <h2 className="text-3xl font-bold text-gradient w-fit mb-4">My Main Skills</h2>
                <div className="flex items-center gap-4">
                <Button variant="save" onClick={handleSaveNewOrder}>
                    <FaSave />
                    Save New Order
                </Button>
                    <Button onClick={handleAddNewSkill}>
                    <FaPlus />
                    Add New Skill
                </Button>
                </div>
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="list">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {mainSkills.map((skill, index) => (
                                <Draggable key={skill.$id} draggableId={skill.$id} index={index}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} className={`p-3 flex items-center gap-4 rounded-md mb-2 bg-tertiary-light dark:bg-tertiary-dark ${snapshot.isDragging ? "ring-2 ring-primary" : ""}`}>
                                            <span {...provided.dragHandleProps} className="h-6 bg-secondary py-0.5 rounded-sm">
                                                <GripVertical size={20} />
                                            </span>
                                            <p>{skill.order}</p>
                                            <div className="p-2 rounded-xl bg-light-mode-100 dark:bg-dark-mode-100">
                                                <Image
                                                    src={skill.icon || "/assets/images/react.svg"} // Use skill image if available
                                                    width={60}
                                                    height={60}
                                                    alt="Skill Icon"
                                                />
                                            </div>
                                            <Button onClick={changeIcon}>
                                                <FaCloudUploadAlt size={16} />
                                                Upload Icon
                                            </Button>
                                            <AdminInput
                                                icon="text"
                                                inputValue={editedSkills[skill.$id]?.skillName || skill.skillName}
                                                onChange={(value) => handleSkillChange(skill.$id, 'skillName', value)}
                                            />
                                            <AdminInput
                                                icon="link"
                                                inputValue={editedSkills[skill.$id]?.link || skill.link}
                                                onChange={(value) => handleSkillChange(skill.$id, 'link', value)}
                                            />
                                            <div className="flex items-center gap-4 ml-auto">
                                                <Button
                                                    variant="save"
                                                    onClick={() => handleUpdateSkill(skill.$id)}
                                                    disabled={!editedSkills[skill.$id]}
                                                >
                                                    <FaSave />
                                                    Save Changes
                                                </Button>
                                                <Button variant="destructive" onClick={() => handleDeleteSkill(skill.$id)}>
                                                    <FaTrash />
                                                    Delete Skill
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
    )
}
