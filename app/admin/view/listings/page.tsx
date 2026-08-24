'use client';

import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import ListingsInfo from './listingsdetails';

interface Listings {
    id: string;
    name: string;
    email: string;
    phone: string;
    unit_name: string;
    unit_type: string;
    unit_location: string;
    description: string;
    unit_price: string;
    status: string;
    images: string;
    user: User;
}

interface User {
    name: string;
}

const ListingsPage: React.FC = () => {
    const SearchParamsComponent = () => {
        const searchParams = useSearchParams();
        const id = searchParams.get('id');
        let token;

        if (typeof window !== 'undefined' && window.localStorage) {
            token = sessionStorage.getItem('token');
        } else {
            token = null;
        }

        const [unitData, setUnitData] = useState<Listings | null>(null);
        const [loading, setLoading] = useState(false);

        const fetchUnitData = async () => {
            if (!id) return;
            setLoading(true);

            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/listings/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setUnitData(response.data.record || null);
            } catch (error) {
                console.error("Error fetching unit data:", error);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchUnitData();
        }, [id]);

        return <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl p-4 md:p-5">
            {unitData ? (
                <ListingsInfo data={unitData} />
            ) : (
                !loading && <p>No data available.</p>
            )}
        </div>
    };

    return (
        <Suspense fallback={<div>Loading sections...</div>}>
            <SearchParamsComponent />
        </Suspense>
    );
};

export default ListingsPage;
