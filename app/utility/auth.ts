// app\utility\auth.ts
export const getAuthHeaders = (): HeadersInit => {
    let token;

    if (typeof window !== 'undefined' && window.localStorage) {
        token = sessionStorage.getItem('token');
    } else {
        token = null;
    }

    if (!token) {
        return {};
    }

    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', 
    };
};
    