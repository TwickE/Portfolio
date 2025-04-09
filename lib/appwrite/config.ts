export const appwriteConfig = {
    endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
    // Collections
    adminsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_ADMINS_COLLECTION!,
    skillsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_SKILLS_COLLECTION!,
    techBadgesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_TECH_BADGES_COLLECTION!,
    projectCardsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_CARDS_COLLECTION!,
    resumeCollectionId: process.env.NEXT_PUBLIC_APPWRITE_RESUME_COLLECTION!,
    cvFileCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CV_FILE_COLLECTION!,
    // Storage
    storageSkillIconsId: process.env.NEXT_PUBLIC_APPWRITE_SKILL_ICONS_STORAGE!,
    storageTechBadgesIconsId: process.env.NEXT_PUBLIC_APPWRITE_TECH_BADGES_ICONS_STORAGE!,
    storageCVFileId: process.env.NEXT_PUBLIC_APPWRITE_CV_FILE_STORAGE!,
    
    secretKey: process.env.NEXT_APPWRITE_KEY!,
}