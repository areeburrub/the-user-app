import {EditProfileForm} from "@/app/profile/edit/components/editForm";
import {getUser_Profile} from "@/_data/user";


const ProfilePage = async () => {

    const user = await getUser_Profile()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Update Profile</h2>
                    <EditProfileForm user={{
                        id: user?.id || "",
                        username: user?.username || "",
                        name: user?.name || "",
                        email: user?.email || "",
                        photo: user?.photo || ""
                    }}/>
                </div>
            </div>
        </div>
)
    ;
}

export default ProfilePage;