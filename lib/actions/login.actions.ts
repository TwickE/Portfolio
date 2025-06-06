"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { parseStringify, handleError } from "@/lib/utils";
import { ID, Query } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getAdminByEmail = async (email: string) => {
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.adminsCollectionId,
        [Query.equal('email', [email])],
    );

    return result.total > 0 ? result.documents[0] : null;
}

export const sendEmailOTP = async ({ email }: { email: string; }) => {
    const { account } = await createAdminClient();
    try {
        const session = await account.createEmailToken(ID.unique(), email);

        return session.userId;
    } catch (error) {
        handleError(error, "Failed to send email OTP");
    }
}

export const verifySecret = async ({ accountId, password }: { accountId: string; password: string; }) => {
    try {
        const { account } = await createAdminClient();

        const session = await account.createSession(accountId, password);

        (await cookies()).set('appwrite-session', session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
        });

        return parseStringify({ sessionId: session.$id });
    } catch (error) {
        handleError(error, "Failed to verify OTP");
    }
}

export const logInAdmin = async ({ email }: { email: string }) => {
    try {
        const existingAdmin = await getAdminByEmail(email);

        if (existingAdmin) {
            await sendEmailOTP({ email });
            return parseStringify({ accountId: existingAdmin.accountId });
        }

        return parseStringify({ accountId: null, error: "Admin not found" });
    } catch (error) {
        handleError(error, "Failed to log in admin");
    }
}

export const logOutAdmin = async () => {
    const { account } = await createSessionClient();

    try {
        if (account) {
            await account.deleteSession('current');
        }
        (await cookies()).delete('appwrite-session');
    } catch (error) {
        handleError(error, "Failed to log out admin");
    } finally {
        redirect("/");
    }
}

export const checkAdminAuth = async () => {
    try {
        const client = await createSessionClient();

        if (!client.hasSession) {
            return false
        } else {
            return true
        }
    } catch (error) {
        handleError(error, 'Failed to check authentication');
        return false
    }
};
