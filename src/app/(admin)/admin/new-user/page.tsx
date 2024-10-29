import AdminCreateUserForm from "./_components/createUserFormAdmin";

const AdminUserEditPage = async ({params}: { params: { userId: string } }) => {

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New User</h1>
                <AdminCreateUserForm/>
            </div>
        </div>
    )
}

export default AdminUserEditPage;