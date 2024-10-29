import {SignupForm} from "@/app/(auth)/components/signupForm";

const SignupPage = () => {
    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
                    <p className="mt-2 text-gray-600">Sign up an account</p>
                    <SignupForm />
                </div>
            </div>
        </div>
    )
}

export default SignupPage;