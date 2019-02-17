export function authHeader() {
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.jsessionId) {
        return {  };
    } else {
        return {};
    }
}