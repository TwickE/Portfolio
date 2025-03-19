"use server";

import { createAdminClient, createPublicClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { AdminSkill, DeleteSkillProps } from "@/types/interfaces";
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

export const updateSkill = async ({ $id, skillName, link, order, iconFile, bucketFileId }: AdminSkill) => {
    try {
        const { databases, storage } = await createAdminClient();

        // Build the update object with only provided fields
        const updateData: Partial<AdminSkill> = {};

        if (skillName !== undefined) updateData.skillName = skillName;
        if (link !== undefined) updateData.link = link;
        if (order !== undefined) updateData.order = order;

        if (iconFile !== undefined && bucketFileId !== undefined) {
            await storage.deleteFile(
                appwriteConfig.storageImagesId,
                bucketFileId
            );

            const bucketFile = await storage.createFile(
                appwriteConfig.storageImagesId,
                ID.unique(),
                iconFile
            );

            updateData.bucketFileId = bucketFile.$id;
            updateData.icon = constructFileUrl(bucketFile.$id);
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
                appwriteConfig.storageImagesId,
                fileId
            )
        }
    } catch (error) {
        handleError(error, 'Failed to delete skill');
    }
}

export const addSkill = async ({ skillName, link, order, iconFile, mainSkill }: AdminSkill) => {
    try {
        const { databases, storage } = await createAdminClient();

        const bucketFile = await storage.createFile(
            appwriteConfig.storageImagesId,
            ID.unique(),
            iconFile!
        );

        const newSkill: Partial<AdminSkill> = {
            skillName,
            link,
            icon: constructFileUrl(bucketFile.$id),
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