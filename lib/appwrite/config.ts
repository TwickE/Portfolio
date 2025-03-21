export const appwriteConfig = {
    endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
    adminsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_ADMINS_COLLECTION!,
    skillsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_SKILLS_COLLECTION!,
    techBadgesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_TECH_BADGES_COLLECTION!,
    storageSkillIconsId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_SKILL_ICONS!,
    storageTechBadgesIconsId: process.env.NEXT_PUBLIC_APPWRITE_TECH_BADGES_ICONS!,

    secretKey: process.env.NEXT_APPWRITE_KEY!,
}