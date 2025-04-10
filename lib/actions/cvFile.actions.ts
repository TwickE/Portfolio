"use server";

import { createAdminClient, createPublicClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID } from "node-appwrite";
import { constructFileUrl, handleError } from "@/lib/utils";

export const getCVFile = async () => {
    try {
        const { databases } = await createPublicClient();

        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.cvFileCollectionId
        )

        if(result) {
            return result.documents[0];
        }
    } catch (error) {
        handleError(error, 'Failed to get CV file');
    }
}

export const updateCVFile = async (file: File) => {
    try {
        const { databases, storage } = await createAdminClient();

        // Gets the current CV file
        const oldFile = await getCVFile();
        if(!oldFile) return;

        // Deletes the old CV file from the storage
        await storage.deleteFile(
            appwriteConfig.storageCVFileId,
            oldFile.bucketFileId
        );

        // Creates a new file in the storage
        const bucketFile = await storage.createFile(
            appwriteConfig.storageCVFileId,
            ID.unique(),
            file
        );

        // Creates a variable with the new file data
        const newCVFile = {
            bucketFileId: bucketFile.$id,
            fileURL: constructFileUrl(appwriteConfig.storageCVFileId, bucketFile.$id)
        }

        // Updates the CV file in the database with the new file data
        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.cvFileCollectionId,
            oldFile.$id,
            newCVFile
        );
    } catch (error) {
        handleError(error, 'Failed to update CV file');
    }
}