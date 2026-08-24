"use client";

import { useEffect, useState } from 'react';
import useSWR from 'swr';

import DataTable from '@/app/components/datatable';
import DeleteConfirmationModal from '@/app/components/modal/deletemodal';
// import AddQuestion from './addmodal';
import UpdateQuestion from './updatemodal';

import { getAuthHeaders } from '@/app/utility/auth';

import { GoSearch } from 'react-icons/go';
import { RiArrowDownLine } from 'react-icons/ri';
import { LuMessageCircle, LuPenLine, LuPenSquare, LuTrash2 } from 'react-icons/lu';
import { AiOutlineDelete } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/button';
import TableData from '@/app/components/tabledata';
import { Chip } from '@heroui/react';
import Reply from './reply';


type Category = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    property_name: string;
    property_location: string;
    unit_type: string;
    message: string;
    status: string;
};


const Table: React.FC = () => {
    const router = useRouter();

    const fetcherWithAuth = async (url: string) => {
        const headers = getAuthHeaders();

        const res = await fetch(url, {
            method: "GET",
            headers: headers,
        });

        if (res.status === 401) {
            router.replace("/auth/login");
            return;
        }

        if (res.status === 429) {
            toast.error("Too many requests. Please try again later.");
            return;
        }

        return await res.json();
    };
    const { data, error, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/inquiries`, fetcherWithAuth);
    const [categories, setCategories] = useState<Category[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);

    useEffect(() => {
        if (data && !error) {
            setCategories(data.records);
            setIsLoading(false);
        }
    }, [data, error]);

    const handleDeleteClick = (categoryId: string) => {
        setCategoryToDelete(categoryId);
        setDeleteModalOpen(true);
    };

    const confirmDeleteCategory = async () => {
        if (!categoryToDelete) return;
        setDeleteBtnLoading(true);
        try {
            await deleteCategory(categoryToDelete);
            toast.success("Inquiry deleted successfully!");
            setDeleteModalOpen(false);
            setDeleteBtnLoading(false);
        } catch (error) {
            console.error("Error deleting inquiry:", error);
        }
    };

    const deleteCategory = async (categoryId: string) => {
        try {
            const headers = getAuthHeaders();
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inquiries/${categoryId}`, {
                method: 'DELETE',
                headers: headers
            });
            setCategories((prevCategories) =>
                prevCategories.filter((category) => category.id !== categoryId)
            );
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const Status: Record<string, "primary" | "warning" | "success" | "default"> =
    {
        "Pending": "primary",
        "Replied": "success",
    };

    const statusOptions = [
        { key: "all", label: "ALL" },
        { key: "pending", label: "Pending" },
        { key: "replied", label: "Replied" },
    ];


    const columns = [
        // { label: 'ID', accessor: (category: Category) => category.id },
        {
            key: "name", label: 'Name & Email', renderCell: (category: Category) => (
                <div>
                    <h1 className='capitalize font-medium'>{category.first_name} {category.last_name}</h1>
                    <p className='text-sm text-default-500'>{category.email}</p>
                </div>
            )
        },
        { key: "phone", label: 'Phone', renderCell: (category: Category) => category.phone },
        {
            key: "property", label: 'Property', renderCell: (category: Category) => (
                <div>
                    <h1 className='capitalize font-medium'>{category.property_name}</h1>
                    <p className='text-sm text-default-500'>{category.property_location}</p>
                </div>
            )
        },
        { key: "unit", label: 'Unit/PS Type', renderCell: (category: Category) => category.unit_type },
        {
            key: "status", label: 'Status', renderCell: (category: Category) => {
                const displayPrice = category.status;
                const chipColor = Status[displayPrice] || "default";
                return (
                    <Chip size="sm" className="uppercase" color={chipColor} variant="dot">
                        {displayPrice}
                    </Chip>
                );
            },
        },

        {
            key: "actions", label: 'Actions',
            renderCell: (category: Category) => (
                <div className='flex gap-2'>
                    <Reply category={category} />
                    <Button
                        isIconOnly
                        startContent={<LuTrash2 size={18} />}
                        variant='flat'
                        color='danger'
                        onPress={() => handleDeleteClick(category.id)}
                    >
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4">
            {isLoading ? (
                <div className="animate-pulse space-y-4">
                    {[...Array(itemsPerPage)].map((_, index) => (
                        <div key={index} className="h-10 bg-gray-300 rounded-lg"></div>
                    ))}
                </div>
            ) : (
                <TableData
                    filter={true}
                    label="INQUIRIES"
                    description="Manage and respond to all inquiries."
                    columns={columns}
                    data={categories}  
                    statusOptions={statusOptions}
                    
                />
            )}

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDeleteCategory}
                deleteBtnLoading={deleteBtnLoading}
                message="Are you sure you want to delete this inquiry?"

            />

        </div>
    );
};

export default Table;