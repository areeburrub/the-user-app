"use server"

import {createServerAction} from "zsa";
import z from "zod";
import prisma from "@/prisma";
import {comparePassword, hashPassword} from "@/utils/auth";
import {encryptAccessToken} from "@/lib/session";
import {cookies} from "next/headers"
import {verifySession} from "@/lib/dal";

export const signup = createServerAction()
    .input(
        z.object({
            name: z.string(),
            email: z.string().email(),
            username: z.string().min(3),
            password: z.string().min(6),
            photo: z.string().optional()
        })
    )
    .output(z.object({
        userId: z.string(),
    }))
    .handler(async ({input}) => {
        const {name, email, username, password, photo} = input;

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{email}, {username}]
            }
        });

        if (existingUser) {
            throw new Error("User already exists.");
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create the user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                username,
                password: hashedPassword,
                isAdmin: false,
                photo
            },
        });

        return {userId: user.id};
    });

export const login = createServerAction()
    .input(
        z.object({
            identifier: z.string(), // Email or username
            password: z.string().min(6),
        })
    )
    .output(
        z.object({
            status: z.boolean(),
        })
    )
    .handler(async ({input}) => {
        const {identifier, password} = input;

        // Find user by email or username
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {email: identifier},
                    {username: identifier},
                ],
            },
        });

        if (!user) {
            throw new Error("No such user exists.");
        }

        if (!user || !(await comparePassword(password, user.password))) {
            throw new Error("Invalid credentials.");
        }

        // Generate access token
        const accessToken = await encryptAccessToken({userId: user.id, isAdmin: user.isAdmin});


        // Store the access token as cookie
        cookies().set('falcon-assignment-access-token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        return {status: true};
    });

export const logout = createServerAction()
    .handler(async () => {
        try {
            // Get access token from cookies
            const accessToken = cookies().get('falcon-assignment-access-token')?.value;

            if (!accessToken) {
                throw new Error("No access token found.");
            }

            // Delete the access token cookie
            cookies().delete('falcon-assignment-access-token');

        } catch (e) {
            throw e
        }
    });

export const changePassword = createServerAction()
    .input(
        z.object({
            userId: z.string(),
            currentPassword: z.string(),
            newPassword: z.string().min(6),
        })
    )
    .output(z.object({
        success: z.boolean()
    }))
    .handler(async ({input}) => {
        const {userId, currentPassword, newPassword} = input;

        // Find the user
        const user = await prisma.user.findUnique({
            where: {id: userId}
        });

        if (!user) {
            throw new Error("User not found.");
        }

        // Verify current password
        const isValidPassword = await comparePassword(currentPassword, user.password);
        if (!isValidPassword) {
            throw new Error("Current password is incorrect.");
        }

        // Hash and update new password
        const hashedPassword = await hashPassword(newPassword);
        await prisma.user.update({
            where: {id: userId},
            data: {password: hashedPassword}
        });

        return {success: true};
    });

export const isUsernameAvailable = createServerAction()
    .input(z.object({
        username: z.string().min(2).max(15)
    }))
    .output(
        z.boolean()
    )
    .handler(async ({input}) => {
        try {
            const data = await prisma.user.findFirst({
                where: {
                    username: input.username
                }
            })

            return data == null
        } catch (e) {
            throw e
        }
    });

export const updateProfile = createServerAction()
    .input(
        z.object({
            name: z.string().optional(),
            email: z.string().email().optional(),
            username: z.string().min(3).optional(),
            photo: z.string().optional()
        })
    )
    .output(z.object({
        success: z.boolean(),
    }))
    .handler(async ({input}) => {
        const {name, email, username, photo} = input;

        const session = await verifySession();
        if (!session) return {success: false};

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: {id: session.userId},
        });

        if (!existingUser) {
            throw new Error("User does not exist.");
        }

        // Validate that the username and email are not taken by another user
        if (username && username !== existingUser.username) {
            const usernameTaken = await prisma.user.findFirst({
                where: {username},
            });
            if (usernameTaken) {
                throw new Error("Username is already taken.");
            }
        }

        if (email && email !== existingUser.email) {
            const emailTaken = await prisma.user.findFirst({
                where: {email},
            });
            if (emailTaken) {
                throw new Error("Email is already in use.");
            }
        }

        // Prepare data for update
        const updatedData: any = {};

        if (name) updatedData.name = name;
        if (email) updatedData.email = email;
        if (username) updatedData.username = username;
        if (photo) updatedData.photo = photo;

        await prisma.user.update({
            where: {id: session.userId},
            data: updatedData,
        });

        return {success: true};
    });