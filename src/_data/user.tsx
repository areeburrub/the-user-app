import {getUser, verifySession} from "@/lib/dal";

export const isUserLoggedIn = async () => {
    const { isAuth }  = await verifySession();
    return isAuth
}

export const getUser_Profile = async () =>{
    const user = await getUser();
    const profile = {
        id: user?.id,
        name: user?.name,
        username: user?.username,
        email: user?.email,
        photo: user?.photo,
        isAdmin: user?.isAdmin
    }
    return profile;
}

export const getUser_Username = async () =>{
    const user = await getUser();
    return user?.username;
}

export const getUser_Email = async () =>{
    const user = await getUser();
    return user?.email;
}

