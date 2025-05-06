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

export const updateSkills = async (skills: AdminSkill[]) => {
    try {
        const { databases, storage } = await createAdminClient();

        // Create an array of update promises
        const updatePromises = skills.map(async (skill) => {
            const updateData: Partial<AdminSkill> = {
                name: skill.name,
                link: skill.link,
                order: skill.order,
                mainSkill: skill.mainSkill
            };

            // Checks if the iconFile is provided and if the skill is not new to delete the old file and upload the new one
            if (skill.iconFile !== undefined && skill.bucketFileId !== undefined && skill.newSkill !== true) {
                await storage.deleteFile(
                    appwriteConfig.storageSkillIconsId,
                    skill.bucketFileId
                );

                const bucketFile = await storage.createFile(
                    appwriteConfig.storageSkillIconsId,
                    ID.unique(),
                    skill.iconFile
                );

                updateData.bucketFileId = bucketFile.$id;
                updateData.icon = constructFileUrl(appwriteConfig.storageSkillIconsId, bucketFile.$id);
            }

            return databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.skillsCollectionId,
                skill.$id,
                updateData
            );
        });

        // Execute all updates in parallel
        await Promise.all(updatePromises);

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