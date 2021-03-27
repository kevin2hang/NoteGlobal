export const isSignedIn = () => {
    return window.localStorage.getItem("signedIn") === "true";
}

export const getGoogleId = () => {
    return window.localStorage.getItem("googleId");
}
export const getEmail = () => {
    return window.localStorage.getItem("email");
}
export const getPhotoUrl = () => {
    return window.localStorage.getItem("photoUrl");
}
export const getDisplayName = () => {
    return window.localStorage.getItem("displayName");
}

export const getSignedInUser = () => {
    const localStorage = window.localStorage;
    let signedInUser = {
        displayName : localStorage.getItem("displayName"),
        email: localStorage.getItem("email"),
        googleId : localStorage.getItem("googleId"),
        photoUrl : localStorage.getItem("photoUrl")
    };

    return signedInUser;
}