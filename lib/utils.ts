import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { appwriteConfig } from "@/lib/appwrite/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseStringify = (value: unknown) => {
    return JSON.parse(JSON.stringify(value));
}

export const constructFileUrl = (imageBucket: string,bucketFileId: string) => {
    return `${appwriteConfig.endpointUrl}/storage/buckets/${imageBucket}/files/${bucketFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};
