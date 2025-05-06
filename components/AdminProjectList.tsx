"use client";

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { FaTrash, FaPlus, FaSave, FaPen } from "react-icons/fa";
import { FaRotate } from "react-icons/fa6";
import { deleteProjectCard, getProjectCards, updateProjectCardsOrder } from "@/lib/actions/projects.actions";
import { ProjectCardType } from "@/types/interfaces";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ErrorCard from '@/components/ErrorCard';
import { useRouter } from 'next/navigation';

const NUMBER_OF_SKELETONS = 6;

const AdminProjectCards = () => {
    // State to store the project cards and track their changes
    const [localData, setLocalData] = useState<Record<string, ProjectCardType>>({});
    // State to track the if the alert dialog is open
    const [alertOpen, setAlertOpen] = useState(false);
    // State to store the delete action
    const [deleteAction, setDeleteAction] = useState<(() => Promise<void>) | null>(null);
    // React Query Client
    const queryClient = useQueryClient();

    const router = useRouter();

    // Fetch projects from the backend
    const {
        data: projectCardsData,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['projectCards', false, 'relevance'],
        queryFn: () => getProjectCards({ all: true }),
        gcTime: 1000 * 60 * 60 * 12, // Cache for 12 hours
        // Process the data to parse stringified fields and convert to the correct type
        select: (data) => {
            const processedData = (data as ProjectCardType[] | undefined)?.map(card => ({
                ...card,
                images: typeof card.images === 'string' ? JSON.parse(card.images) : card.images,
                links: typeof card.links === 'string' ? JSON.parse(card.links) : card.links,
            }));

            return processedData?.reduce((acc, projectCard) => {
                acc[projectCard.$id] = projectCard;
                return acc;
            }, {} as Record<string, ProjectCardType>);
        }
    });

    // Effect to set the local data when projectCardsData changes
    useEffect(() => {
        if (projectCardsData) setLocalData(projectCardsData);
    }, [projectCardsData]);

    const handleRefresh = async () => {
        if (projectCardsData && localData !== projectCardsData) {
            setLocalData(projectCardsData);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDragProjectCard = (result: any) => {
        if (!result.destination) return; // Prevent errors if dropped outside the list

        const reorderedProjectCards = Object.values(localData);
        const [movedProjectCard] = reorderedProjectCards.splice(result.source.index, 1);
        reorderedProjectCards.splice(result.destination.index, 0, movedProjectCard);

        // Update the order property of each skill
        const updatedProjectCards = reorderedProjectCards.map((projectCard, index) => ({
            ...projectCard,
            order: index + 1 // Update order based on new position
        }));

        setLocalData(updatedProjectCards.reduce((acc, projectCard) => {
            acc[projectCard.$id] = projectCard;
            return acc;
        }, {} as Record<string, ProjectCardType>));
    }

    // Mutation to update the order of the project cards
    const {
        mutateAsync: updateMutation,
        isPending
    } = useMutation({
        mutationFn: async (projectCards: ProjectCardType[]) => {
            const response = await updateProjectCardsOrder(projectCards);

            if (!response) {
                throw new Error("Failed to update project cards order");
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['projectCards', false, 'relevance'] });
            toast.success("Project Cards updated successfully");
        },
        onError: (err: unknown) => {
            console.error("Mutation failed:", err);
            toast.error((err as Error).message || "Failed to update project cards");
        },
    });

    const handleUpdateProjectCardsOrder = async () => {
        await updateMutation(Object.values(localData));
    };

    // Mutation to delete a project card
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return await deleteProjectCard(id);
        },
        onSuccess: () => {
            toast.success("Project Card deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['projectCards', false, 'relevance'] });
        },
        onError: (error) => {
            console.error("Delete error:", error);
            toast.error("Failed to delete project card");
        },
    });

    const handleDeleteProjectCard = (projectCardId: string, newProjectCard: boolean) => {
        const executeDeleteSkill = async () => {
            // Always remove from local state immediately
            setLocalData(prev => {
                const newState = { ...prev };
                delete newState[projectCardId];
                return newState;
            });

            // Only call the backend if it's not a new (unsaved) skill
            if (!newProjectCard) {
                await deleteMutation.mutateAsync(projectCardId);
            }

            // Reset and close the dialog
            setDeleteAction(null);
            setAlertOpen(false);
        };

        setDeleteAction(() => executeDeleteSkill);
        setAlertOpen(true);
    };

    const handleAddNewProjectCard = () => {
        router.push('/admin/project-cards/new');
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
                        <Button variant="primary" onClick={handleAddNewProjectCard}>
                            <FaPlus />
                            Add
                        </Button>
                        <Button variant="save" onClick={handleUpdateProjectCardsOrder} disabled={isPending}>
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
                        <ErrorCard name="Project Cards" />
                    </div>
                ) : (
                    <DragDropContext onDragEnd={handleDragProjectCard}>
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="h-[calc(100%-36px-16px)] overflow-y-auto">
                                    {Object.values(localData).map((projectCard, index) => (
                                        <Draggable key={projectCard.$id} draggableId={projectCard.$id} index={index}>
                                            {(provided, snapshot) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} className={`p-3 flex items-center gap-4 rounded-md mb-2 bg-my-accent ${snapshot.isDragging ? "ring-2 ring-my-primary" : ""}`}>
                                                    <span {...provided.dragHandleProps} className="h-6 bg-my-secondary py-0.5 rounded-sm">
                                                        <GripVertical color='white' size={20} />
                                                    </span>
                                                    <div className="flex items-center gap-4 flex-wrap w-full">
                                                        <p>{projectCard.order}</p>
                                                        <div className="grid place-content-center rounded-xl bg-[url(/lightTransparentPattern.svg)] dark:bg-[url(/darkTransparentPattern.svg)] w-[76px] h-[76px]">
                                                            <Image
                                                                src={projectCard.images[0].src || "/noImage.webp"}
                                                                width={60}
                                                                height={60}
                                                                //fill Modificar isto para tirar o warning de width e height
                                                                alt={projectCard.images[0].alt || "Image 1"}
                                                                className="object-contain object-center max-w-[60px] max-h-[60px]"
                                                            />
                                                        </div>
                                                        <h3>{projectCard.title}</h3>
                                                        <div className='flex items-center gap-4 ml-auto max-4xl:mx-auto'>
                                                            <Link href={`/admin/project-cards/${projectCard.$id}`}>
                                                                <Button
                                                                    variant="primary"
                                                                >
                                                                    <FaPen />
                                                                    Edit Project
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => handleDeleteProjectCard(projectCard.$id, projectCard.new)}
                                                            >
                                                                <FaTrash />
                                                                Delete
                                                            </Button>
                                                        </div>
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
                        <AlertDialogTitle>Delete Project Card</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this project card? This action cannot be undone.
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

export default AdminProjectCards