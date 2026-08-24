"use client";
import { getAuthHeaders } from '@/app/utility/auth';
import React, { useState, useEffect } from 'react';

interface UserData {
    name: string;
}

const ProfileData = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchProperties = async () => {
        const headers = getAuthHeaders();
        const options: RequestInit = {
            method: 'GET',
            headers: headers,
        };


        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, options);

            if (!response.ok) {
                throw new Error("An error occurred while fetching user data");
            }
            
            const data = await response.json();

            if (data) {
                setUserData(data.records); 
            } else {
                setError("No user data found");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []); 

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            {userData?.name || "Loading..."}
        </div>
    );
}

export default ProfileData;
