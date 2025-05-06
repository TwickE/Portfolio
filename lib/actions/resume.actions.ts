"use server";

import { createAdminClient, createPublicClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { ResumeItemProps } from "@/types/interfaces";
import { handleError } from "@/lib/utils";

export const getResume = async ({ type }: { type: "school" | "work" | "course" }) => {
    try {
        const { databases } = await createPublicClient();

        if (type === "school" || type === "course") {
            const result = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.resumeCollectionId,
                [
                    Query.equal('icon', ["school", "course"]),
                    Query.orderAsc('order'),
                    Query.limit(1000)
                ],
            );

            // Transform the data to match your Skill interface
            return result.documents as unknown as ResumeItemProps[];
        } else {
            const result = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.resumeCollectionId,
                [
                    Query.equal('icon', ["work"]),
                    Query.orderAsc('order'),
                    Query.limit(1000)
                ],
            );

            // Transform the data to match your Skill interface
            return result.documents as unknown as ResumeItemProps[];
        }
    } catch (error) {
        handleError(error, "Failed to get resume information");
        return undefined;
    }
}

export const updateResumeItems = async (resumeItems: ResumeItemProps[]) => {
    try {
        const { databases } = await createAdminClient();

        // Create an array of update promises
        const updatePromises = resumeItems.map(async (resumeItem) => {
            const updateData: Partial<ResumeItemProps> = {
                date: resumeItem.date,
                text1: resumeItem.text1,
                text2: resumeItem.text2,
                icon: resumeItem.icon,
                order: resumeItem.order
            };

            return databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.resumeCollectionId,
                resumeItem.$id,
                updateData
            );
        });

        // Execute all updates in parallel
        await Promise.all(updatePromises);

        return true;
    } catch (error) {
        console.log("Failed to update resume items", error);
        return false;
    }
}

export const addResumeItem = async ({ icon, date, text1, text2, order }: Partial<ResumeItemProps>) => {
    try {
        const { databases } = await createAdminClient();

        // Build the update object with only provided fields
        const newData: Partial<ResumeItemProps> = {};

        if (icon !== undefined) newData.icon = icon;
        if (date !== undefined) newData.date = date;
        if (text1 !== undefined) newData.text1 = text1;
        if (text2 !== undefined) newData.text2 = text2;
        if (order !== undefined) newData.order = order;

        // If no fields to update, return early
        if (Object.keys(newData).length === 0) {
            throw new Error("No new data provided for update");
        }

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.resumeCollectionId,
            ID.unique(),
            newData
        );

        return true;
    } catch (error) {
        console.log("Failed to add resume item", error);
        return false;
    }
}

export const deleteResumeItem = async (resumeItemId: string) => {
    try {
        const { databases } = await createAdminClient();

        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.resumeCollectionId,
            resumeItemId
        );
    } catch (error) {
        handleError(error, 'Failed to delete resume item');
    }
}