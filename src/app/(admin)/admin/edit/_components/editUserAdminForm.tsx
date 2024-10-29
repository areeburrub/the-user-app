"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Trash2, Key } from "lucide-react";
import { UploadButton } from "@/utils/uploadthing";
import { updateUserAdmin, deleteUserAdmin, resetPasswordAdmin } from "@/_actions/admin";

// Define schema for form validation
const updateUserSchema = z.object({
    name: z.string().min(1, { message: "Full Name is required" }),
    email: z.string().email({ message: "Valid email is required" }),
    username: z.string().min(1, { message: "Username is required" }),
    isAdmin: z.boolean(),
    photo: z.string().url().optional(),
});

type UpdateUserInputs = z.infer<typeof updateUserSchema>;

export default function AdminEditUserForm({ user }: { user: { id: string; name: string; email: string; username: string; isAdmin: boolean; photo?: string } }) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [resetPasswordError, setResetPasswordError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<UpdateUserInputs>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            name: user.name || "",
            email: user.email || "",
            username: user.username || "",
            isAdmin: user.isAdmin || false,
            photo: user.photo || "",
        },
    });

    const onSubmit = async (values: UpdateUserInputs) => {
        setError(null);
        try {
            await updateUserAdmin({userId:user.id, data:values});
            router.push("/admin");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        }
    };

    const handleDelete = async () => {
        setDeleteError(null);
        setIsDeleting(true);
        try {
            await deleteUserAdmin({userId:user.id});
            router.push("/admin");
        } catch (err: any) {
            setDeleteError(err.message || "Failed to delete user");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleResetPassword = async () => {
        setResetPasswordError(null);
        setIsResettingPassword(true);
        try {
            await resetPasswordAdmin({userId:user.id, newPassword:newPassword});
            setNewPassword("");
            alert("Password reset successfully");
        } catch (err: any) {
            setResetPasswordError(err.message || "Failed to reset password");
        } finally {
            setIsResettingPassword(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-md flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        id="name"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                        {...register("name")}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="you@example.com"
                        {...register("email")}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        id="username"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="johndoe"
                        {...register("username")}
                    />
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                </div>

                <div>
                    <label htmlFor="isAdmin" className="flex items-center">
                        <input
                            id="isAdmin"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            {...register("isAdmin")}
                        />
                        <span className="ml-2 text-sm text-gray-700">Is Admin</span>
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                    <div className="flex items-center space-x-4">
                        {getValues("photo") && (
                            <img
                                src={getValues("photo")}
                                alt="Profile Picture"
                                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                            />
                        )}
                        <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                                setValue("photo", res[0].url);
                            }}
                            onUploadError={(error: Error) => {
                                alert(`ERROR! ${error.message}`);
                            }}
                        />
                    </div>
                    {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update User"}
                </button>
            </form>

            <div className="mt-12 border-t pt-6">
                <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium mb-2">Delete User</h3>
                        <p className="text-sm text-gray-500 mb-2">Once you delete a user, there is no going back. Please be certain.</p>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            Delete User
                        </button>
                        {deleteError && <p className="text-red-500 text-sm mt-1">{deleteError}</p>}
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-2">Reset Password</h3>
                        <p className="text-sm text-gray-500 mb-2">Set a new password for the user.</p>
                        <div className="flex items-center space-x-2">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New password"
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleResetPassword}
                                disabled={isResettingPassword || !newPassword}
                                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isResettingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Key className="mr-2 h-4 w-4" />}
                                Reset Password
                            </button>
                        </div>
                        {resetPasswordError && <p className="text-red-500 text-sm mt-1">{resetPasswordError}</p>}
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link href="/admin" className="text-sm text-blue-600 hover:text-blue-500">
                    Back to User List
                </Link>
            </div>
        </div>
    );
}