"use server";

import { createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query } from "node-appwrite";
import { Skill } from "@/types/interfaces";

export const getSkills = async ({isMainSkill}: {isMainSkill: boolean}): Promise<Skill[] | undefined> => {
    try {
        const { databases } = await createSessionClient();

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

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
}