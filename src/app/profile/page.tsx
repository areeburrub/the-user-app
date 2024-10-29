import {getUser_Profile} from "@/_data/user";
import {Logout} from "@/components/buttons";
import Link from "next/link";
import {CameraIcon, PencilIcon, Settings, UserIcon} from 'lucide-react';

export default async function ProfilePage() {
    const user = await getUser_Profile()

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-3xl mx-auto pb-8">
                {/* Cover Photo */}
                <div className="relative h-64 md:h-80 bg-gray-300 rounded-b-lg overflow-hidden">
                    <img
                        src={user?.photo || 'https://via.placeholder.com/150/150'}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Profile Info */}
                <div className="relative px-4 sm:px-6 lg:px-8">
                    <div className="relative -mt-16 sm:-mt-24">
                        <div className="relative inline-block">
                            <img
                                src={user?.photo || 'https://via.placeholder.com/150/150'}
                                alt="Profile"
                                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg"
                            />
                            <Link href="/profile/edit" passHref={true}>
                                <button className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-md">
                                    <CameraIcon className="w-4 h-4 text-gray-600"/>
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                            <p className="text-xl text-gray-500">@{user.username}</p>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-4 sm:mt-0">
                            {user.isAdmin && (
                                <Link href="/admin" className="flex-1 sm:flex-none">
                                    <button
                                        className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-slate-500 hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        <Settings className="mr-2 h-4 w-4"/>
                                        Admin
                                    </button>
                                </Link>
                            )}
                            <Link href="/profile/edit" className="flex-1 sm:flex-none">
                                <button
                                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <PencilIcon className="mr-2 h-4 w-4"/>
                                    Edit Profile
                                </button>
                            </Link>
                            <span className="flex-1 sm:flex-none">
                                <Logout/>
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                            </div>
                            {user.isAdmin && (
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                            <span
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                              Admin
                                            </span>
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}