export const appwriteConfig = {
    endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
    // Collections
    adminsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_ADMINS_COLLECTION!,
    skillsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_SKILLS_COLLECTION!,
    techBadgesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_TECH_BADGES_COLLECTION!,
    cardLinksCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CARD_LINKS_COLLECTION!,
    cardImagesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CARD_IMAGES_COLLECTION!,
    projectCardsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_CARDS_COLLECTION!,
    // Storage
    storageSkillIconsId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_SKILL_ICONS!,
    storageTechBadgesIconsId: process.env.NEXT_PUBLIC_APPWRITE_TECH_BADGES_ICONS!,
    storageProjectCardsImagesId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_CARDS_IMAGES!,

    secretKey: process.env.NEXT_APPWRITE_KEY!,
}