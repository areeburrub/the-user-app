"use client";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {signup, isUsernameAvailable} from "@/_actions/auth";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {Loader2} from "lucide-react";
import {uploadImage} from "@/utils/uploadImage";
import {UploadButton} from "@/utils/uploadthing";

const signupFormSchema = z.object({
    name: z.string().min(1, {message: "Full Name is required"}),
    email: z.string().email({message: "Valid email is required"}),
    username: z.string().min(1, {message: "Username is required"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters"}),
    confirmPassword: z.string().min(6, {message: "Confirm Password is required"}),
    photo: z.string().url().optional() // The Cloudinary URL for the uploaded image
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

type SignupFormInputs = z.infer<typeof signupFormSchema>;

export function SignupForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [imageUploaded, setImageUploaded] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: {errors, isSubmitting}
    } = useForm<SignupFormInputs>({
        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            name: "",
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            photo: "" // This will store the Cloudinary URL
        }
    });

    const onSubmit = async (values: SignupFormInputs) => {
        setError(null); // Reset error state
        try {
            const isAvailable = await isUsernameAvailable({username: values.username});
            if (!isAvailable) throw new Error("Username is already taken");

            await signup({
                name: values.name,
                email: values.email,
                username: values.username,
                password: values.password,
                photo: values.photo // Include photo URL in signup data
            });

            router.push("/login");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        }
    };

    // const handleFileUpload = async (e: any) => {
    //     const file = e.target.files[0];
    //     if (!file) return;
    //
    //     setLoadingImage(true);
    //     try {
    //         const uploadedResponse = await uploadImage(file);
    //         if (uploadedResponse.success && uploadedResponse.result) {
    //             setValue("photo", uploadedResponse.result.secure_url);
    //         } else {
    //             setError("Image upload failed. Please try again.")
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         setError("Image upload failed. Please try again.");
    //     } finally {
    //         setLoadingImage(false);
    //     }
    // };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left text-black">
            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round"
                         strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{error}</span>
                </div>
            )}


            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                    {...register("name")}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@example.com"
                    {...register("email")}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="johndoe"
                    {...register("username")}
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    {...register("password")}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                />
                {errors.confirmPassword &&
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
                {
                    imageUploaded ?
                        <>
                            <img
                                src={getValues("photo")}
                                alt="Profile Picture"
                                className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                            />
                        </>
                        :
                        <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                                setValue("photo", res[0].url);
                                setImageUploaded(true)
                            }}
                            onUploadError={(error: Error) => {
                                // Do something with the error.
                                alert(`ERROR! ${error.message}`);
                            }}
                        />
                }
                {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                ) : "Sign Up"}
            </button>

            <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Log in
                </Link>
            </p>
        </form>
    );
}
