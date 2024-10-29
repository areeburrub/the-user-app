import Image from "next/image";
import {ArrowRight, UserCheck} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-center gap-5 items-center mx-auto max-w-3xl">

      <UserCheck size={50}/>
      <h1 className={"text-3xl font-bold"}>The User App</h1>
      <div className={"flex flex-row gap-5"}>
        <Link href="/login" className="flex-1 sm:flex-none">
          <button
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Login
          </button>
        </Link>
        <Link href="/signup" className="flex-1 sm:flex-none">
          <button
              className="w-full sm:w-auto flex gap-2 items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Get Started <ArrowRight className={"size-5"}/>
          </button>
        </Link>

      </div>
      <p className={"prose text-center text-lg"}>
          This app provides a user-friendly interface where you can sign up, log in, and manage your profile. Easily edit personal details such as your photo, name, email, and username, or update your password. It uses secure, HTTP-only auth tokens for authentication. Additionally, an admin panel is available for administrator access. Designed as a straightforward, assignment-oriented project.
      </p>
    </main>
  );
}
