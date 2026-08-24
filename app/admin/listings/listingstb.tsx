"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import DataTable from '@/app/components/datatable';
import ListingsModal from './listingsmodal';
import DeleteConfirmationModal from '@/app/components/modal/deletemodal';

import { getAuthHeaders } from '@/app/utility/auth';

import { GoSearch } from 'react-icons/go';
import { RiArrowDownLine } from 'react-icons/ri';
import { LuPenLine } from 'react-icons/lu';
import { AiOutlineDelete } from 'react-icons/ai';
import toast from 'react-hot-toast';

type Listings = {
    id: string;
    unit_name: string;
    name: string;
    unit_location: string;
    unit_price: number;
    status: string;
    user: {
        name: string
    }
};

const ListingsTable: React.FC = () => {
    const [listings, setListings] = useState<Listings[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [cityFilter, setCityFilter] = useState('');
    const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userType, setUserType] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserType = async () => {
            const headers = getAuthHeaders();
            const options: RequestInit = {
                method: 'GET',
                headers: headers,
            };
            const user_id = typeof window !== 'undefined' && window.sessionStorage
                ? sessionStorage.getItem('user_id')
                : null;
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user_id}`, options);
            if (response.ok) {
                const { record: user } = await response.json();
                setUserType(user.type);
            }
        };
        fetchUserType();
    }, []);


    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(price);
    };

    const fetchListings = () => {
        const headers = getAuthHeaders();
        const options: RequestInit = {
            method: 'GET',
            headers: headers,
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings`, options)
            .then((response) => {
                if (response.status === 401) {
                    router.replace('/auth/login');
                    return;
                }
                if (response.status === 429) {
                    toast.error("Too many requests. Please try again later.");
                    return;
                }
                return response.json();
            })
            .then((data) => {
                setListings(data.records);
                setLoading(false);
            })

            .catch(() => {
                toast.error("Too many requests. Please try again later.");
            })
    }

    useEffect(() => {
        fetchListings();

        const interval = setInterval(() => {
            fetchListings();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleDeleteClick = (propertyId: string) => {
        setPropertyToDelete(propertyId);
        setDeleteModalOpen(true);
    };

    const confirmDeleteProperty = async () => {
        if (!propertyToDelete) return;
        setDeleteBtnLoading(true);
        try {
            await deleteProperty(propertyToDelete);
            toast.success("Listing deleted successfully!");
            setDeleteModalOpen(false);
            setDeleteBtnLoading(false);
        } catch (error) {
            console.error("Error deleting listing:", error);
        }
    };


    const deleteProperty = async (propertyID: string) => {
        try {
            const headers = getAuthHeaders();
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${propertyID}`, {
                method: "DELETE",
                headers: headers,
            });
            setListings((prevProperties) =>
                prevProperties.filter((property) => property.id !== propertyID)
            );
        } catch (error) {
            console.error("Error deleting property:", error);
        }
    };

    const filteredListings = listings.filter((listing) => {
        const matchesSearch = listing.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = cityFilter ? listing.status === cityFilter : true;
        return matchesSearch && matchesCity;
    });

    const totalPages = Math.ceil((filteredListings?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentListings = filteredListings.slice(startIndex, startIndex + itemsPerPage);

    const uniqueCities = Array.from(new Set(listings.map(listing => listing.status)));

    const columns = [
        ...(userType === "Admin" ? [{ label: "Agent Name", accessor: (prop: Listings) => prop.user?.name }] : []),
        // { label: 'ID', accessor: (listing: Listings) => listing.id },
        { label: 'Owner Name', accessor: (listing: Listings) => listing.name },
        { label: 'Property Name', accessor: (listing: Listings) => listing.unit_name },
        { label: 'Location', accessor: (listing: Listings) => listing.unit_location },
        { label: 'Unit Price', accessor: (listing: Listings) => formatPrice(listing.unit_price), isPrice: true },
        { label: 'Status', accessor: (listing: Listings) => listing.status, isStatus: true },
        {
            label: "Actions",
            accessor: (property: Listings) => (
                <div className="flex gap-2">
                    <Link
                        href={`/admin/view/listings?id=${property.id}`}
                        className="py-1 px-2 flex items-center text-xs bg-blue-600 text-white p-1 rounded-lg gap-1 hover:bg-blue-800"
                    >
                        <LuPenLine /> Edit
                    </Link>
                    <button
                        onClick={() => handleDeleteClick(property.id)}
                        className="py-1 px-2 flex items-center bg-red-600 text-white rounded-lg text-xs gap-1 hover:bg-red-800"
                    >
                        <AiOutlineDelete /> Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-col md:flex-row justify-between mb-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full md:w-auto">
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="py-3 pr-10 pl-4 shadow-sm border border-gray-300 rounded-lg text-sm focus:border-gray-800 focus:outline-none appearance-none w-full"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={25}>25</option>
                        </select>
                        <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                            <RiArrowDownLine />
                        </span>
                    </div>

                    <div className="relative w-full md:w-auto">
                        <select
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            className="py-3 pr-10 pl-4 shadow-sm border border-gray-300 rounded-lg text-sm focus:border-gray-800 focus:outline-none appearance-none w-full"
                        >
                            <option value="">All</option>
                            {uniqueCities.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                            <RiArrowDownLine />
                        </span>
                    </div>

                    <div className="flex-0 w-full md:w-auto">
                        <div className="relative max-w-xs w-full">
                            <label htmlFor="search" className="sr-only">Search</label>
                            <input
                                id="search"
                                type="text"
                                className="py-3 px-4 ps-9 w-full shadow-sm border border-gray-300 rounded-lg text-sm focus:border-gray-800 focus:outline-none"
                                placeholder="Search property..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                                <GoSearch />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 mt-4 justify-end">
                    <ListingsModal />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 gap-4">
                    {[...Array(10)].map((_, idx) => (
                        <div key={idx} className="h-12 bg-gray-200 animate-pulse rounded"></div>
                    ))}
                </div>
            ) : (
                <DataTable
                    data={currentListings}
                    columns={columns}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                />
            )}

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDeleteProperty}
                deleteBtnLoading={deleteBtnLoading}
                message="Are you sure you want to delete this listing?"
            />
        </div>
    );
};

export default ListingsTable;