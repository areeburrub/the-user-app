import Image from 'next/image';
import Link from 'next/link';
import {getAllUsers} from "@/_actions/admin";
import {format} from "date-fns"
import {Logout} from "@/components/buttons";
import DateDisplay from "@/components/ClientDateTimeDisplay";

const AdminUsersPage = async () => {
    const [users, error] = await getAllUsers();

    if (error) return <div className="text-red-500 text-center py-8">{error.message}</div>



    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={"w-full flex flex-row justify-between items-center"}>
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Control</h1>
                    <div className={"flex flex-row gap-4"}>
                        <Link href="/admin/new-user">
                            <button
                                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Create User
                            </button>
                        </Link>
                        <Logout/>
                    </div>
                </div>

                {/* Table view for medium and large screens */}
                <div className="hidden md:block overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            {['Photo', 'Name', 'Username', 'Email', 'Role', 'Created At', 'Actions'].map((header) => (
                                <th key={header}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user?.id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user?.photo ? (
                                        <Image
                                            src={user.photo}
                                            alt={`${user.name}'s photo`}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div
                                            className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full">
                                            {user.name[0].toUpperCase()}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {user.isAdmin ? 'Admin' : 'User'}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <DateDisplay datetime={new Date(user.createdAt)} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link href={`/admin/edit/${user.id}`}>
                                        <span className="text-blue-600 hover:text-blue-900">Edit</span>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Card view for small screens */}
                <div className="md:hidden space-y-4">
                    {users.map((user) => (
                        <div key={user?.id} className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-4 py-5 sm:px-6 flex items-center">
                                {user?.photo ? (
                                    <Image
                                        src={user.photo}
                                        alt={`${user.name}'s photo`}
                                        width={48}
                                        height={48}
                                        className="rounded-full mr-4"
                                    />
                                ) : (
                                    <div
                                        className="w-12 h-12 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full mr-4">
                                        {user.name[0].toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">{user.name}</h3>
                                    <p className="text-sm text-gray-500">@{user.username}</p>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                <dl className="sm:divide-y sm:divide-gray-200">
                                    <div key={'Email'}
                                         className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">{"Email"}</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                                    </div>
                                    <div key={'Role'}
                                         className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">{"Role"}</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.isAdmin ? 'Admin' : 'User'}</dd>
                                    </div>
                                    <div key={'Created At'}
                                         className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">{"Role"}</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            <DateDisplay datetime={new Date(user.createdAt)}/>
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <Link href={`/admin/edit/${user.id}`}>
                                    <span
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        Edit User
                                    </span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminUsersPage;