import { Account, Client, Databases, Storage } from 'node-appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { cookies } from 'next/headers';

export const createSessionClient = async () => {
    const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId);

    const session = (await cookies()).get('appwrite-session');

    if (!session || !session.value) {
        return {
            hasSession: false,
            get account() {
                throw new Error('No active session');
            },
            get databases() {
                throw new Error('No active session');
            }
        };
    }

    client.setSession(session.value);

    return {
        hasSession: true,
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        }
    };
}

export const createAdminClient = async () => {
    const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId)
        .setKey(appwriteConfig.secretKey);

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
        get storage() {
            return new Storage(client);
        }
    }
}

export const createPublicClient = () => {
    const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId);

    return {
        get databases() {
            return new Databases(client);
        },
        get storage() {
            return new Storage(client);
        }
    }
}