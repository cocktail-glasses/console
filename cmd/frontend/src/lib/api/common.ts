export const authCheck = () => fetch('/auth/check').then((res) => !(res.status === 401));
