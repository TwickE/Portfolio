"use server";

import { createAdminClient, createPublicClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { ProjectCardType, ProjectCardDatabase } from "@/types/interfaces";
import { handleError } from "@/lib/utils";

export const getProjectCards = async ({ all, sortingOrder }: { all: boolean, sortingOrder?: string }) => {
    try {
        const { databases } = await createPublicClient();

        const queries = [];

        // Only keep sorting logic
        if (sortingOrder) {
            switch (sortingOrder) {
                case 'newest':
                    queries.push(Query.orderDesc('startDate'));
                    break;
                case 'oldest':
                    queries.push(Query.orderAsc('startDate'));
                    break;
                case 'relevance':
                default:
                    queries.push(Query.orderAsc('order'));
                    break;
            }
        } else {
            queries.push(Query.orderAsc('order'));
        }

        // Keep limit query
        queries.push(Query.limit(all ? 1000 : 4));

        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.projectCardsCollectionId,
            queries
        );

        // Transform the data to match the ProjectCardType interface
        return result.documents as unknown as ProjectCardType[];
    } catch (error) {
        handleError(error, "Failed to get Projects");
        return undefined;
    }
}

export const getProjectCardById = async (projectId: string) => {
    try {
        const { databases } = await createPublicClient();

        const result = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.projectCardsCollectionId,
            projectId
        );

        // Transform the data to match the ProjectCardType interface
        return result as unknown as ProjectCardType;
    } catch (error) {
        handleError(error, "Failed to get Project Card");
        return undefined;
    }
}

export const updateProjectCard = async (projectCard: ProjectCardType) => {
    try {
        const { databases } = await createAdminClient();

        const updatedData = {
            title: projectCard.title,
            startDate: projectCard.startDate,
            endDate: projectCard.endDate,
            description: projectCard.description,
            links: JSON.stringify(projectCard.links),
            techBadges: projectCard.techBadges.map(badge => badge.$id),
            images: JSON.stringify(projectCard.images),
            original: projectCard.original
        }

        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.projectCardsCollectionId,
            projectCard.$id,
            updatedData
        );

        return true;
    } catch (error) {
        console.log("Failed to update project card", error);
        return false;
    }
}

export const updateProjectCardsOrder = async (projectCards: ProjectCardType[]) => {
    try {
        const { databases } = await createAdminClient();

        // Create an array of update promises
        const updatePromises = projectCards.map(card => {
            return databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.projectCardsCollectionId,
                card.$id,
                { order: card.order }
            );
        });

        // Execute all updates in parallel
        await Promise.all(updatePromises);

        return true;
    } catch (error) {
        console.log("Failed to update project card order", error);
        return false;
    }
}

export const addProjectCard = async ({
    title,
    startDate,
    endDate,
    description,
    links,
    techBadges,
    images,
    order,
    original }: ProjectCardType) => {
    try {
        const { databases } = await createAdminClient();

        // Extract just the $id values from techBadges for proper Appwrite document references
        const techBadgeIds = techBadges.map(badge => badge.$id);

        const newProjectCard: Partial<ProjectCardDatabase> = {
            title,
            startDate,
            endDate,
            description,
            links: JSON.stringify(links),
            techBadges: techBadgeIds,
            images: JSON.stringify(images),
            order,
            original
        }

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.projectCardsCollectionId,
            ID.unique(),
            newProjectCard
        );

        return true;
    } catch (error) {
        console.log("Failed to add project card", error);
        return false;
    }
}

export const deleteProjectCard = async (projectId: string) => {
    try {
        const { databases } = await createAdminClient();

        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.projectCardsCollectionId,
            projectId
        );
    } catch (error) {
        handleError(error, 'Failed to delete project card');
    }
}