export function access(permissionFromWeb) {
    let user = JSON.parse(localStorage.getItem('user'));

    if(user && user.profile && permissionFromWeb===-1 && user.profile.roleId === 4){
        return true
    }else if(user && user.profile && permissionFromWeb===-1 && user.profile.roleId !== 4){
        return false;
    } else if(permissionFromWeb===0){
        return true
    }

    debugger


    if (user && user.profile && user.profile.permissions) {
        return user.profile.permissions.some((permission)=>
            permission.permissionCode===permissionFromWeb
        );
    } else {
        return false;
    }
}