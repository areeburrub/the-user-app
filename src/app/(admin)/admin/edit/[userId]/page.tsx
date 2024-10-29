import {getUserById} from "@/_actions/admin";
import AdminEditUserForm from "../_components/editUserAdminForm";

const AdminUserEditPage = async ({params}: { params: { userId: string } }) => {

    const {userId} = params;

    const [user, error] = await getUserById({id: userId});

    if (error) return <div className="text-red-500 text-center py-8">{error.message}</div>

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit {user.name} Profile</h1>
                <AdminEditUserForm user={user} />
            </div>
        </div>
    )
}

export default AdminUserEditPage;