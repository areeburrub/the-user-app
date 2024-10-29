"use server"

import {createServerAction} from "zsa";
import z from "zod";
import prisma from "@/prisma";
import {verifySession} from "@/lib/dal";
import {User} from "@prisma/client"
import {hashPassword} from "@/utils/auth";

export const getAllUsers = createServerAction()
    .output(
        z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                username: z.string(),
                photo: z.string().optional(),
                email: z.string(),
                isAdmin: z.boolean(),
                createdAt: z.string(),
                updatedAt: z.string(),
            })
        )
    )
    .handler(async () => {

        const session = await verifySession();
        if (!session) throw "Please Login to continue."; // Wrap empty array in `users` object
        if (!session.isAdmin) throw "User not an Admin"

        const allUsers = await prisma.user.findMany();

        const transformedUsers = allUsers.map(user => ({
            id: user.id,
            name: user.name,
            username: user.username,
            photo: user.photo || '',
            email: user.email,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt.toISOString(), // Convert to string
            updatedAt: user.updatedAt.toISOString(), // Convert to string
        }));

        return transformedUsers;
    });

export const getUserById = createServerAction()
    .input(
        z.object({
            id: z.string(),
        })
    )
    .output(
            z.object({
                id: z.string(),
                name: z.string(),
                username: z.string(),
                photo: z.string().optional(),
                email: z.string(),
                isAdmin: z.boolean(),
                createdAt: z.string(),
                updatedAt: z.string(),
            })
    )
    .handler(async ({input}) => {
        const {id} = input

        const session = await verifySession();
        if (!session) throw "Please Login to continue."; // Wrap empty array in `users` object
        if (!session.isAdmin) throw "User not an Admin"

        const user = await prisma.user.findUnique({
            where: { id: id }
        });

        if (!user) throw "User not found"

        return {
            id: user.id,
            name: user.name,
            username: user.username,
            photo: user.photo || '',
            email: user.email,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt.toISOString(), // Convert to string
            updatedAt: user.updatedAt.toISOString(), // Convert to string
        };

    });

// Create User as Admin
export const createUser = createServerAction()
    .input(
        z.object({
            name: z.string(),
            username: z.string(),
            email: z.string().email(),
            photo: z.string().optional(),
            password: z.string().min(6), // Enforce minimum password length
            isAdmin: z.boolean().optional(), // Defaults to false if not provided
        })
    )
    .output(z.object({
        success: z.boolean(),
        userId: z.string().optional(),
    }))
    .handler(async ({ input }) => {
        const session = await verifySession();
        if (!session || !session.isAdmin) throw "User not an Admin";

        // Hash the password before storing
        const hashedPassword = await hashPassword(input.password);

        // Create the user in the database
        const newUser = await prisma.user.create({
            data: {
                name: input.name,
                username: input.username,
                email: input.email,
                photo: input.photo || '',
                password: hashedPassword,
                isAdmin: input.isAdmin || false,
            },
        });

        return { success: true, userId: newUser.id };
    });

export const updateUserAdmin = createServerAction()
    .input(
        z.object({
            userId: z.string(),
            data: z.object({
                name: z.string().optional(),
                username: z.string().optional(),
                email: z.string().optional(),
                photo: z.string().optional(),
                isAdmin: z.boolean().optional(),
            }).partial(), // Allows partial updates
        })
    )
    .output(z.object({
        success: z.boolean(),
    }))
    .handler(async ({ input }) => {
        const session = await verifySession();
        if (!session || !session.isAdmin) throw "User not an Admin";

        const { userId, data } = input;

        await prisma.user.update({
            where: { id: userId },
            data: {
                ...data,
            },
        });

        return { success: true };
    });


// Delete User as Admin
export const deleteUserAdmin = createServerAction()
    .input(
        z.object({
            userId: z.string(),
        })
    )
    .output(z.object({
        success: z.boolean(),
    }))
    .handler(async ({ input }) => {
        const session = await verifySession();
        if (!session || !session.isAdmin) throw "User not an Admin";

        await prisma.user.delete({
            where: { id: input.userId },
        });

        return { success: true };
    });

// Reset Password as Admin
export const resetPasswordAdmin = createServerAction()
    .input(
        z.object({
            userId: z.string(),
            newPassword: z.string().min(6),
        })
    )
    .output(z.object({
        success: z.boolean(),
    }))
    .handler(async ({ input }) => {
        const session = await verifySession();
        if (!session || !session.isAdmin) throw "User not an Admin";

        const hashedPassword = await hashPassword(input.newPassword);
        await prisma.user.update({
            where: { id: input.userId },
            data: { password: hashedPassword },
        });

        return { success: true };
    });
