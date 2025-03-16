export const appwriteConfig = {
    endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
    adminsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_ADMINS_COLLECTION!,
    skillsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_SKILLS_COLLECTION!,
    storageImagesId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_IMAGES!,

    secretKey: process.env.NEXT_APPWRITE_KEY!,
}