"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";
import {login} from "@/_actions/auth";
import {CheckCircle, Loader2,} from "lucide-react";

// Define the schema for form validation
const loginFormSchema = z.object({
    identifier: z.string().min(1, {message: "Username or Email is required"}),
    password: z.string().min(6, {message: "valid Password is required"}),
});

// Infer TypeScript types from the schema
type LoginFormInputs = z.infer<typeof loginFormSchema>;

export function LoginForm() {
    const router = useRouter();
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<LoginFormInputs>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            identifier: "",
            password: ""
        },
    });

    const onSubmit = async (values: LoginFormInputs) => {
        const {identifier, password} = values;
        setLoginError(null); // Reset error state
        setLoginSuccess(false); // Reset success state

        try {
            // Call the login function and destructure the response
            const [tokens, error] = await login({identifier, password});

            if (error) {
                setLoginError(error.message); // Set error message from response
            } else if (tokens) {
                setLoginSuccess(true); // Set success state
                router.push("/profile");
            }
        } catch {
            setLoginError("An unexpected error occurred. Please try again."); // Handle unexpected errors
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 my-4 text-left">
            {loginError && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round"
                         strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{loginError}</span>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username or Email
                </label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your username or email"
                    {...register("identifier")}
                />
                {errors.identifier && (
                    <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                </label>
                <input
                    type="password"
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    {...register("password")}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
            </div>

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> // Spinner next to the button
                )}

                {loginSuccess ? (
                    <>
                        <CheckCircle className="mr-2 h-4 w-4"/>
                        Logging you in...
                    </>
                ) : (
                    "Log in"
                )}
            </button>

            <p className="text-center text-sm text-gray-600">
                Don&#39;t have an account?{" "}
                <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign up
                </Link>
            </p>
        </form>
    );
}
