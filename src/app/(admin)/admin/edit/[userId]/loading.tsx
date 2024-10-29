
import AdminEditUserForm from "../_components/editUserAdminForm";
import {LoaderCircle} from "lucide-react";

const AdminUserEditLoadingPage = async () => {


    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Profile</h1>
                <LoaderCircle className={"size-20 animate-spin"}/>
            </div>
        </div>
    )
}

export default AdminUserEditLoadingPage;