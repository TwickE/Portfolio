"use server";

import { createAdminClient, createPublicClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { AdminSkill, DeleteProps } from "@/types/interfaces";
import { constructFileUrl, handleError } from "@/lib/utils";

export const getSkills = async ({ isMainSkill }: { isMainSkill: boolean }): Promise<AdminSkill[] | undefined> => {
    try {
        const { databases } = await createPublicClient();

        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.skillsCollectionId,
            [
                Query.equal('mainSkill', [isMainSkill]),
                Query.orderAsc('order'),
                Query.limit(1000)
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

export const deleteSkill = async ({ id, fileId }: DeleteProps) => {
    try {
        const { databases, storage } = await createAdminClient();

        const deletedSkill = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.skillsCollectionId,
            id
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