"use server";

import { createAdminClient, createPublicClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query } from "node-appwrite";
import { Skill } from "@/types/interfaces";

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
}

export const getSkills = async ({ isMainSkill }: { isMainSkill: boolean }): Promise<Skill[] | undefined> => {
    try {
        const { databases } = await createPublicClient();

        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.skillsCollectionId,
            [Query.equal('mainSkill', [isMainSkill])],
        );

        // Transform the data to match your Skill interface
        return result.documents as unknown as Skill[];
    } catch (error) {
        handleError(error, `Failed to get ${isMainSkill ? 'main' : 'other'} skills`);
        return undefined;
    }
}

export const addSkill = async () => {

}

export const updateSkill = async ({ $id, skillName, link, icon, order }: Skill): Promise<Skill | undefined> => {
    try {
        const { databases } = await createAdminClient();

        // Build the update object with only provided fields
        const updateData: Partial<Skill> = {};

        if (skillName !== undefined) updateData.skillName = skillName;
        if (icon !== undefined) updateData.icon = icon;
        if (link !== undefined) updateData.link = link;
        if (order !== undefined) updateData.order = order;

        // If no fields to update, return early
        if (Object.keys(updateData).length === 0) {
            throw new Error("No new data provided for update");
        }

        const updatedSkill = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.skillsCollectionId,
            $id,
            updateData
        );
        console.log(updatedSkill); //Comentário a ser removido
        return updatedSkill as unknown as Skill;
    } catch (error) {
        handleError(error, 'Failed to update skill');
        return undefined;
    }
}

export const deleteSkill = async (id: string) => {
    try {
        const { databases } = await createAdminClient();

        const deletedSkill = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.skillsCollectionId,
            id
        );

        console.log(deletedSkill); //Comentário a ser removido
    } catch (error) {
        handleError(error, 'Failed to delete skill');
    }
}