'use client'
import React from 'react'
import EditProperties from './editproperties'
import { getAuthHeaders } from '@/app/utility/auth';
import useSWR from 'swr';


const fetcher = async (url: string) => {
    const headers = getAuthHeaders();
    const res = await fetch(url, { headers });
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
};

const EditPropertiesPage = () => {
    const {
        data: propertiesData,
        error: propertiesError,
        isLoading,
    } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/property`, fetcher);

    const properties = propertiesData?.records || [];
    
    return (
        <div>
            <EditProperties />
        </div>
    )
}

export default EditPropertiesPage
