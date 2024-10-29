"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { UploadButton } from "@/utils/uploadthing";
import { createUser } from "@/_actions/admin";

// Define schema for form validation
const createUserSchema = z.object({
    name: z.string().min(1, { message: "Full Name is required" }),
    email: z.string().email({ message: "Valid email is required" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    isAdmin: z.boolean(),
    photo: z.string().url().optional(),
});

type CreateUserInputs = z.infer<typeof createUserSchema>;

export default function AdminCreateUserForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateUserInputs>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            name: "",
            email: "",
            username: "",
            password: "",
            isAdmin: false,
            photo: "",
        },
    });

    const onSubmit = async (values: CreateUserInputs) => {
        setError(null);
        try {
            await createUser(values);
            router.push("/admin");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Create New User</h1>

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
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••••"
                        {...register("password")}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
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
                        {watch("photo") && (
                            <img
                                src={watch("photo")}
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
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create User"}
                </button>
            </form>

            <div className="mt-8 text-center">
                <Link href="/admin" className="text-sm text-blue-600 hover:text-blue-500">
                    Back to User List
                </Link>
            </div>
        </div>
    );
}