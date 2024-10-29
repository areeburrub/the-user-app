"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile, changePassword } from "@/_actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Camera, User } from "lucide-react";
import { UploadButton } from "@/utils/uploadthing";

const updateProfileSchema = z.object({
    name: z.string().min(1, { message: "Full Name is required" }),
    email: z.string().email({ message: "Valid email is required" }),
    username: z.string().min(1, { message: "Username is required" }),
    photo: z.string().url().optional()
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z.string().min(6, { message: "New password must be at least 6 characters" }),
    confirmPassword: z.string().min(1, { message: "Confirm password is required" })
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type UpdateProfileInputs = z.infer<typeof updateProfileSchema>;
type ChangePasswordInputs = z.infer<typeof changePasswordSchema>;

export function EditProfileForm({ user }: { user: { id: string; name: string; email: string; username: string; photo?: string } }) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        setValue,
        watch,
        formState: { errors: profileErrors, isSubmitting: isProfileSubmitting }
    } = useForm<UpdateProfileInputs>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: user.name || "",
            email: user.email || "",
            username: user.username || "",
            photo: user.photo || ""
        }
    });

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting }
    } = useForm<ChangePasswordInputs>({
        resolver: zodResolver(changePasswordSchema)
    });

    const onSubmitProfile = async (values: UpdateProfileInputs) => {
        setError(null);
        try {
            await updateProfile(values);
            router.push("/profile");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        }
    };

    const onSubmitPassword = async (values: ChangePasswordInputs) => {
        setPasswordError(null);

            const [res,error] = await changePassword({
                userId: user.id,
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });

            if(error){
                setPasswordError(error.message || "Failed to change password");
            }
            if (res?.success){
                alert("Password changed successfully");
                setIsChangingPassword(false);
            }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="md:col-span-1">
                    <div className="flex flex-col items-center space-y-4">
                            {watch("photo") ? (
                                <img
                                    src={watch("photo")}
                                    alt="Profile"
                                    className="w-40 h-40 rounded-full object-cover border-4 border-blue-500"
                                />
                            ) : (
                                <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center border-4 border-blue-500">
                                    <User className="h-20 w-20 text-gray-400" />
                                </div>
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
                        <p className="text-sm text-gray-500">Upload New Image to update your profile picture</p>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-md flex items-center">
                                <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="John Doe"
                                    {...registerProfile("name")}
                                />
                                {profileErrors.name && <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="you@example.com"
                                    {...registerProfile("email")}
                                />
                                {profileErrors.email && <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="johndoe"
                                    {...registerProfile("username")}
                                />
                                {profileErrors.username && <p className="mt-1 text-sm text-red-600">{profileErrors.username.message}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isProfileSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProfileSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Save Changes"}
                        </button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-gray-200">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Change Password</h2>
                        {isChangingPassword ? (
                            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                                {passwordError && (
                                    <div className="bg-red-50 text-red-500 p-4 rounded-md">
                                        {passwordError}
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                                    <input
                                        id="currentPassword"
                                        type="password"
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                      focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        {...registerPassword("currentPassword")}
                                    />
                                    {passwordErrors.currentPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                      focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        {...registerPassword("newPassword")}
                                    />
                                    {passwordErrors.newPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                      focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        {...registerPassword("confirmPassword")}
                                    />
                                    {passwordErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>}
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsChangingPassword(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPasswordSubmitting}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isPasswordSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Change Password"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsChangingPassword(true)}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Change Password
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link href="/profile" className="text-sm text-blue-600 hover:text-blue-500">
                    Go back to Profile
                </Link>
            </div>
        </>
    );
}