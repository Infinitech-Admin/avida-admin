"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

import DataTable from '@/app/components/datatable';
import DeleteConfirmationModal from '@/app/components/modal/deletemodal';
import AddQuestion from './addmodal';
import UpdateQuestion from './updatemodal';

import { getAuthHeaders } from '@/app/utility/auth';

import { GoSearch } from 'react-icons/go';
import { RiArrowDownLine } from 'react-icons/ri';
import { LuPenLine, LuPenSquare, LuTrash2 } from 'react-icons/lu';
import { AiOutlineDelete } from 'react-icons/ai';
import toast from 'react-hot-toast';
import TableData from '@/app/components/tabledata';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/react';

type Category = {
    id: string;
    question: string;
    answer: string;
    status: string;
};

const QuestionTable: React.FC = () => {
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
    const { data, error, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/questions`, fetcherWithAuth);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [categoryToUpdate, setCategoryToUpdate] = useState<Category | null>(null);
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
            toast.success("FAQ deleted successfully!");
            setDeleteModalOpen(false);
            setDeleteBtnLoading(false);
        } catch (error) {
            console.error("Error deleting FAQ:", error);
        }
    };

    const deleteCategory = async (categoryId: string) => {
        try {
            const headers = getAuthHeaders();
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/questions/${categoryId}`, {
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

    // Function to open update modal
    const handleUpdateClick = (category: Category) => {
        setCategoryToUpdate(category);
        setUpdateModalOpen(true);
    };

    // Update modal handling
    const closeUpdateModal = () => setUpdateModalOpen(false);

    const filteredCategories = categories.filter((category) =>
        category.question && category.question.toLowerCase().includes(searchTerm.toLowerCase()) || category.answer && category.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusOptions = [
        { key: "all", label: "ALL" },
        { key: "active", label: "Active" },
        { key: "in-active", label: "In-Active" },
    ];

    const Status: Record<string, "primary" | "danger" | "success" | "default"> =
    {
        "active": "success",
        "in-active": "danger",
    };


    const columns = [
        // { label: 'ID', accessor: (category: Category) => category.id },
        { key: "questions", label: 'Questions', renderCell: (category: Category) => category.question },
        { key: "answer", label: 'Answers', renderCell: (category: Category) => category.answer },
        {
            key: "status", label: 'Status', renderCell: (category: Category) => {
                const displaystatus = category.status;
                const chipColor = Status[displaystatus] || "default";
                return (
                    <Chip size="sm" className="uppercase" color={chipColor} variant="dot">
                        {displaystatus}
                    </Chip>
                );
            },
        },
        {
            key: "actions", label: 'Actions',
            renderCell: (category: Category) => (
                <div className='flex gap-2'>
                    <Button
                        isIconOnly
                        startContent={<LuPenSquare size={18} />}
                        onPress={() => handleUpdateClick(category)}
                        variant='flat'
                        color='primary'
                    >
                    </Button>
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
            <div className="flex flex-col md:flex-row justify-end mb-4">
                <AddQuestion mutate={mutate} />
            </div>


            {isLoading ? (
                <div className="animate-pulse space-y-4">
                    {[...Array(itemsPerPage)].map((_, index) => (
                        <div key={index} className="h-10 bg-gray-300 rounded-lg"></div>
                    ))}
                </div>
            ) : (
                <TableData
                    filter={true}
                    label="FAQ"
                    description="Manage and update all frequently asked questions."
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
                message="Are you sure you want to delete this FAQ?"
            />

            <UpdateQuestion
                isOpen={updateModalOpen}
                onClose={closeUpdateModal}
                initialData={categoryToUpdate}
                mutate={mutate}
            />


        </div>
    );
};

export default QuestionTable;