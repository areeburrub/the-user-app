"use client"
import {logout} from "@/_actions/auth";
import {useRouter} from "next/navigation";
import {Loader2} from "lucide-react";
import {useState} from "react";

export const Logout = () => {
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);
    return (
        <button
            onClick={async ()=>{
                setLoggingOut(true);
                await logout();
                router.push("/login")
            }}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Log Out
            {
                loggingOut &&
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            }
        </button>
    )
}