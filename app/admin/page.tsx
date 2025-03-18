'use client';

import AdminNavbar from "@/components/AdminNavbar";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState } from 'react';
import { GripVertical } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import { AdminInput } from "@/components/AdminSmallComponents";
import { FaSave } from "react-icons/fa";

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
    const [items, setItems] = useState(Array.from({ length: 10 }, (_, i) => ({ id: i.toString(), number: i + 1 })));

    const handleDragEnd = (result) => {
        if (!result.destination) return; // Prevent errors if dropped outside the list

        const reorderedItems = Array.from(items);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setItems(reorderedItems);
    }

    return (
        <section>
            <h2 className="text-3xl font-bold text-gradient w-fit mb-4">My Main Skills</h2>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="list">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} className={`p-3 flex items-center gap-4 rounded-md mb-2 bg-tertiary-light dark:bg-tertiary-dark ${snapshot.isDragging ? 'ring-2 ring-primary' : ''}`}>
                                            <span {...provided.dragHandleProps} className="h-6 bg-secondary py-0.5 rounded-sm">
                                                <GripVertical size={20} />
                                            </span>
                                            <div className="p-2 rounded-xl bg-light-mode-100 dark:bg-dark-mode-100">
                                                <Image
                                                    src="/assets/images/react.svg"
                                                    width={60}
                                                    height={60}
                                                    alt="Skill Icon"
                                                />
                                            </div>
                                            <Button>
                                                <FaCloudUploadAlt size={16} />
                                                Upload Icon
                                            </Button>
                                            <AdminInput
                                                icon="text"
                                                inputValue="React"
                                            />
                                            <AdminInput
                                                icon="link"
                                                inputValue="linkkkkk"
                                            />
                                            <span className="text-white">#{index + 1}</span> {/* Position-based number */}
                                            <span className="text-gray-300">{item.number}</span> {/* Original number */}
                                            <div className="flex items-center gap-4 ml-auto">
                                                <Button>
                                                    <FaSave />
                                                    Save Changes
                                                </Button>
                                                <Button variant="destructive">
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
