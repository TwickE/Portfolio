"use server";

import { createAdminClient, createPublicClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { DeleteProps, TechBadgeType } from "@/types/interfaces";
import { constructFileUrl, handleError } from "@/lib/utils";

export const getTechBadges = async () => {
    try {
        const { databases } = await createPublicClient();

        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.techBadgesCollectionId,
            [
                Query.orderDesc('$updatedAt'),
                Query.limit(1000)
            ],
        );

        // Transform the data to match your Skill interface
        return result.documents as unknown as TechBadgeType[];
    } catch (error) {
        handleError(error, "Failed to get Tech Badges");
        return undefined;
    }
}

export const getTechBadgesOrderedByName = async () => {
    try {
        const { databases } = await createPublicClient();

        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.techBadgesCollectionId,
            [
                Query.orderAsc('name'),
                Query.limit(1000)
            ],
        );

        // Transform the data to match your Skill interface
        return result.documents as unknown as TechBadgeType[];
    } catch (error) {
        handleError(error, "Failed to get Tech Badges");
        return undefined;
    }
}

export const getTechBadgesByName = async (query: string) => {
    try {
        const { databases } = await createPublicClient();

        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.techBadgesCollectionId,
            [
                Query.contains('name', query),
                Query.limit(1000)
            ],
        );

        if (result.documents.length <= 0) return [];

        // Transform the data to match the TechBadgeType interface
        return result.documents as unknown as TechBadgeType[];
    } catch (error) {
        handleError(error, "Failed to get Tech Badges");
        return undefined;
    }
}

export const updateTechBadge = async ({ $id, name, iconFile, bucketFileId }: TechBadgeType) => {
    try {
        const { databases, storage } = await createAdminClient();

        // Build the update object with only provided fields
        const updateData: Partial<TechBadgeType> = {};

        if (name !== undefined) updateData.name = name;

        if (iconFile !== undefined && bucketFileId !== undefined) {
            await storage.deleteFile(
                appwriteConfig.storageTechBadgesIconsId,
                bucketFileId
            );

            const bucketFile = await storage.createFile(
                appwriteConfig.storageTechBadgesIconsId,
                ID.unique(),
                iconFile
            );

            updateData.bucketFileId = bucketFile.$id;
            updateData.icon = constructFileUrl(appwriteConfig.storageTechBadgesIconsId, bucketFile.$id);
        }

        // If no fields to update, return early
        if (Object.keys(updateData).length === 0) {
            throw new Error("No new data provided for update");
        }

        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.techBadgesCollectionId,
            $id,
            updateData
        );

        return true;
    } catch (error) {
        console.log("Failed to update tech badge", error);
        return false;
    }
}

export const addTechBadge = async ({ name, iconFile }: TechBadgeType) => {
    try {
        const { databases, storage } = await createAdminClient();

        const bucketFile = await storage.createFile(
            appwriteConfig.storageTechBadgesIconsId,
            ID.unique(),
            iconFile!
        );

        const newTechBadge: Partial<TechBadgeType> = {
            name,
            icon: constructFileUrl(appwriteConfig.storageTechBadgesIconsId, bucketFile.$id),
            bucketFileId: bucketFile.$id
        }

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.techBadgesCollectionId,
            ID.unique(),
            newTechBadge
        );

        return true;
    } catch (error) {
        console.log("Failed to update skill", error);
        return false;
    }
}

export const deleteTechBadge = async ({ id, fileId }: DeleteProps) => {
    try {
        const { databases, storage } = await createAdminClient();

        const deletedTechBadge = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.techBadgesCollectionId,
            id
        );

        if (deletedTechBadge) {
            await storage.deleteFile(
                appwriteConfig.storageTechBadgesIconsId,
                fileId
            )
        }
    } catch (error) {
        handleError(error, 'Failed to delete Tech Badge');
    }
}