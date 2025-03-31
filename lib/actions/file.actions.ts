"use server";

import { createAdminClient, createPublicClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { AdminSkill, DeleteSkillProps, TechBadgeType, ProjectCardType, ProjectCardDatabase } from "@/types/interfaces";
import { constructFileUrl } from "@/lib/utils";

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
}

export const getSkills = async ({ isMainSkill }: { isMainSkill: boolean }): Promise<AdminSkill[] | undefined> => {
    try {
        const { databases } = await createPublicClient();

        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.skillsCollectionId,
            [
                Query.equal('mainSkill', [isMainSkill]),
                Query.orderAsc('order')
            ],
        );

        // Transform the data to match your Skill interface
        return result.documents as unknown as AdminSkill[];
    } catch (error) {
        handleError(error, `Failed to get ${isMainSkill ? 'main' : 'other'} skills`);
        return undefined;
    }
}

export const updateSkill = async ({ $id, name, link, order, iconFile, bucketFileId }: AdminSkill) => {
    try {
        const { databases, storage } = await createAdminClient();

        // Build the update object with only provided fields
        const updateData: Partial<AdminSkill> = {};

        if (name !== undefined) updateData.name = name;
        if (link !== undefined) updateData.link = link;
        if (order !== undefined) updateData.order = order;

        if (iconFile !== undefined && bucketFileId !== undefined) {
            await storage.deleteFile(
                appwriteConfig.storageSkillIconsId,
                bucketFileId
            );

            const bucketFile = await storage.createFile(
                appwriteConfig.storageSkillIconsId,
                ID.unique(),
                iconFile
            );

            updateData.bucketFileId = bucketFile.$id;
            updateData.icon = constructFileUrl(appwriteConfig.storageSkillIconsId, bucketFile.$id);
        }

        // If no fields to update, return early
        if (Object.keys(updateData).length === 0) {
            throw new Error("No new data provided for update");
        }

        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.skillsCollectionId,
            $id,
            updateData
        );

        return true;
    } catch (error) {
        console.log("Failed to update skill", error);
        return false;
    }
}

export const deleteSkill = async ({ skillId, fileId }: DeleteSkillProps) => {
    try {
        const { databases, storage } = await createAdminClient();

        const deletedSkill = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.skillsCollectionId,
            skillId
        );

        if (deletedSkill) {
            await storage.deleteFile(
                appwriteConfig.storageSkillIconsId,
                fileId
            )
        }
    } catch (error) {
        handleError(error, 'Failed to delete skill');
    }
}

export const addSkill = async ({ name, link, order, iconFile, mainSkill }: AdminSkill) => {
    try {
        const { databases, storage } = await createAdminClient();

        const bucketFile = await storage.createFile(
            appwriteConfig.storageSkillIconsId,
            ID.unique(),
            iconFile!
        );

        const newSkill: Partial<AdminSkill> = {
            name,
            link,
            icon: constructFileUrl(appwriteConfig.storageSkillIconsId, bucketFile.$id),
            order,
            bucketFileId: bucketFile.$id,
            mainSkill
        }

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.skillsCollectionId,
            ID.unique(),
            newSkill
        );

        return true;
    } catch (error) {
        console.log("Failed to update skill", error);
        return false;
    }
}

export const getTechBadges = async () => {
    try {
        const { databases } = await createPublicClient();

        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.techBadgesCollectionId,
            [
                Query.orderDesc('$updatedAt')
            ],
        );

        // Transform the data to match your Skill interface
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

export const deleteTechBadge = async ({ $id, bucketFileId }: TechBadgeType) => {
    try {
        const { databases, storage } = await createAdminClient();

        const deletedTechBadge = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.techBadgesCollectionId,
            $id
        );

        if (deletedTechBadge) {
            await storage.deleteFile(
                appwriteConfig.storageTechBadgesIconsId,
                bucketFileId
            )
        }
    } catch (error) {
        handleError(error, 'Failed to delete Tech Badge');
    }
}

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

export const getTechBadgesByName = async (query: string) => {
    try {
        const { databases } = await createPublicClient();

        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.techBadgesCollectionId,
            [
                Query.contains('name', query)
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