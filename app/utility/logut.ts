import { getAuthHeaders } from "./auth";

export const logoutUser = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });

        // Check if response is OK
        if (!response.ok) {
            const text = await response.text(); // If not, try to parse as text
            console.error('Logout failed:', text);
            throw new Error('Logout failed, please check the response.');
        }

        // Try to parse JSON if response is okay
        const data = await response.json();

        if (data.success) {
            // Clear localStorage only on successful logout
            localStorage.clear();
            // Redirect to the login page or home page
            window.location.href = '/auth/login'; 
        } else {
            console.error('Logout failed:', data.message);
        }

    } catch (error) {
        console.error('Logout error:', error);
    }
};
