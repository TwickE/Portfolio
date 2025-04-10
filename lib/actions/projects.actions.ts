"use server";

import { createAdminClient, createPublicClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { ProjectCardType, ProjectCardDatabase } from "@/types/interfaces";
import { handleError } from "@/lib/utils";

export const getProjectCards = async (all: boolean) => {
    try {
        const { databases } = await createPublicClient();

        let result;
        if (!all) {
            result = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.projectCardsCollectionId,
                [
                    Query.orderAsc('order'),
                    Query.limit(4)
                ],
            );
        } else {
            result = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.projectCardsCollectionId,
                [
                    Query.orderAsc('order')
                ],
            );
        }

        // Transform the data to match the ProjectCardType interface
        return result.documents as unknown as ProjectCardType[];
    } catch (error) {
        handleError(error, "Failed to get Projects");
        return undefined;
    }
}

export const updateProjectCard = async ({
    $id,
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

        // Build the update object with only provided fields
        const updateData: Partial<ProjectCardDatabase> = {};

        if (title !== undefined) updateData.title = title;
        if (startDate !== undefined) updateData.startDate = startDate;
        if (endDate !== undefined) updateData.endDate = endDate;
        if (description !== undefined) updateData.description = description;
        if (links !== undefined) updateData.links = JSON.stringify(links);
        if (techBadges !== undefined) {
            // Extract just the $id values from techBadges for proper Appwrite document references
            const techBadgeIds = techBadges.map(badge => badge.$id);
            updateData.techBadges = techBadgeIds;
        }
        if (images !== undefined) updateData.images = JSON.stringify(images);
        if (order !== undefined) updateData.order = order;
        if (original !== undefined) updateData.original = original;

        // If no fields to update, return early
        if (Object.keys(updateData).length === 0) {
            throw new Error("No new data provided for update");
        }

        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.projectCardsCollectionId,
            $id,
            updateData
        );

        return true;
    } catch (error) {
        console.log("Failed to update project card", error);
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