"use server";

import { createPublicClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query } from "node-appwrite";
import { AdminHomeData } from "@/types/interfaces";
import { handleError } from "@/lib/utils";

export const getDashboardStats = async (): Promise<AdminHomeData | undefined> => {
    try {
        const { databases, storage } = await createPublicClient();
        
        // Parallel requests for better performance
        const [
            mainSkills, 
            otherSkills, 
            skillsStorage,
            projects,
            techBadges,
            techBadgesStorage,
            education,
            work,
            cv,
            cvStorage
        ] = await Promise.all([
            // Main skills collection
            databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.skillsCollectionId,
                [Query.equal('mainSkill', [true]), Query.orderDesc('$updatedAt'), Query.limit(1)]
            ),
            // Other skills collection
            databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.skillsCollectionId,
                [Query.equal('mainSkill', [false]), Query.orderDesc('$updatedAt'), Query.limit(1)]
            ),
            // Skills storage
            storage.listFiles(
                appwriteConfig.storageSkillIconsId,
                [Query.orderDesc('$updatedAt'), Query.limit(1)]
            ),
            // Projects collection
            databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.projectCardsCollectionId,
                [Query.orderDesc('$updatedAt'), Query.limit(1)]
            ),
            // Tech badges collection
            databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.techBadgesCollectionId,
                [Query.orderDesc('$updatedAt'), Query.limit(1)]
            ),
            // Tech badges storage
            storage.listFiles(
                appwriteConfig.storageTechBadgesIconsId,
                [Query.orderDesc('$updatedAt'), Query.limit(1)]
            ),
            // Education collection
            databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.resumeCollectionId,
                [Query.equal('icon', ['school', 'course']), Query.orderDesc('$updatedAt'), Query.limit(1)]
            ),
            // Work experience collection
            databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.resumeCollectionId,
                [Query.equal('icon', ['work']), Query.orderDesc('$updatedAt'), Query.limit(1)]
            ),
            // CV file collection
            databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.cvFileCollectionId,
                [Query.orderDesc('$updatedAt'), Query.limit(1)]
            ),
            // CV file storage
            storage.listFiles(
                appwriteConfig.storageCVFileId,
                [Query.orderDesc('$updatedAt'), Query.limit(1)]
            )
        ]);

        const result = {
            dbTotalMainSkills: mainSkills.total,
            dbLastUpdatedMainSkills: mainSkills.documents[0]?.$updatedAt ? new Date(mainSkills.documents[0].$updatedAt) : new Date(),
            dbTotalOtherSkills: otherSkills.total,
            dbLastUpdatedOtherSkills: otherSkills.documents[0]?.$updatedAt ? new Date(otherSkills.documents[0].$updatedAt) : new Date(),
            skillsCollectionId: appwriteConfig.skillsCollectionId,
            skillsCollectionLink: "https://cloud.appwrite.io/console/project-67d41af6001a9ceab425/databases/database-67d41bfd00189a22bc22/collection-67d70a7000092adcf98e",
            storageTotalSkills: skillsStorage.total,
            storageLastUpdatedSkills: skillsStorage.files[0]?.$updatedAt ? new Date(skillsStorage.files[0].$updatedAt) : new Date(),
            storageSkillIconsId: appwriteConfig.storageSkillIconsId,
            storageSkillsLink: "https://cloud.appwrite.io/console/project-67d41af6001a9ceab425/storage/bucket-67d420a50002fd92b9ff",
        
            dbTotalProjects: projects.total,
            dbLastUpdatedProjects: projects.documents[0]?.$updatedAt ? new Date(projects.documents[0].$updatedAt) : new Date(),
            projectCardsCollectionId: appwriteConfig.projectCardsCollectionId,
            projectsCollectionLink: "https://cloud.appwrite.io/console/project-67d41af6001a9ceab425/databases/database-67d41bfd00189a22bc22/collection-67e28339000c613a9b11",
        
            dbTotalTechBadges: techBadges.total,
            dbLastUpdatedTechBadges: techBadges.documents[0]?.$updatedAt ? new Date(techBadges.documents[0].$updatedAt) : new Date(),
            techBadgesCollectionId: appwriteConfig.techBadgesCollectionId,
            techBadgesCollectionLink: "https://cloud.appwrite.io/console/project-67d41af6001a9ceab425/databases/database-67d41bfd00189a22bc22/collection-67dd702b000ee7f96b04",
            storageTotalTechBadges: techBadgesStorage.total,
            storageLastUpdatedTechBadges: techBadgesStorage.files[0]?.$updatedAt ? new Date(techBadgesStorage.files[0].$updatedAt) : new Date(),
            storageTechBadgesIconsId: appwriteConfig.storageTechBadgesIconsId,
            storageTechBadgesLink: "https://cloud.appwrite.io/console/project-67d41af6001a9ceab425/storage/bucket-67dd7f9d0039afcadec8",
        
            dbTotalEducation: education.total,
            dbLastUpdatedEducation: education.documents[0]?.$updatedAt ? new Date(education.documents[0].$updatedAt) : new Date(),
            dbTotalWork: work.total,
            dbLastUpdatedWork: work.documents[0]?.$updatedAt ? new Date(work.documents[0].$updatedAt) : new Date(),
            resumeCollectionId: appwriteConfig.resumeCollectionId,
            resumeCollectionLink: "https://cloud.appwrite.io/console/project-67d41af6001a9ceab425/databases/database-67d41bfd00189a22bc22/collection-67ebfd7b0002034c3cca",
        
            dbTotalCV: cv.total,
            dbLastUpdatedCV: cv.documents[0]?.$updatedAt ? new Date(cv.documents[0].$updatedAt) : new Date(),
            cvFileCollectionId: appwriteConfig.cvFileCollectionId,
            cvFileCollectionLink: "https://cloud.appwrite.io/console/project-67d41af6001a9ceab425/databases/database-67d41bfd00189a22bc22/collection-67f6412d000a9b3dd543",
            storageTotalCV: cvStorage.total, 
            storageLastUpdatedCV: cvStorage.files[0]?.$updatedAt ? new Date(cvStorage.files[0].$updatedAt) : new Date(),
            storageCVFileId: appwriteConfig.storageCVFileId,
            storageCVLink: "https://cloud.appwrite.io/console/project-67d41af6001a9ceab425/storage/bucket-67f6407e0031d1a4186b"
        }
        
        // Return formatted data
        return result as AdminHomeData;
    } catch (error) {
        handleError(error, "Failed to get dashboard statistics");
        return undefined;
    }
};