import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { decryptAccessToken } from '@/lib/session';
import { logout } from "@/_actions/auth";
import prisma from "@/prisma";

export const verifySession = cache(async () => {
    const accessToken = cookies().get('falcon-assignment-access-token')?.value;
    let session;

    if (accessToken) {
        session = await decryptAccessToken(accessToken);
        if (!session?.userId) {
            await logout();
        }
    }

    return { isAuth: !!session?.userId, userId: session?.userId, isAdmin: !!session?.isAdmin };
});

export const getUser = cache(async () => {
    const session = await verifySession();
    if (!session) return null;

    try {
        const data = await prisma.user.findMany({
            where: {
                id: session.userId
            }
        });

        const user = data[0];
        return user;
    } catch (error) {
        console.log('Failed to fetch user');
        return null;
    }
});
