"use client";

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import toast from 'react-hot-toast';

import DataTable from '@/app/components/datatable';
import DeleteConfirmationModal from '@/app/components/modal/deletemodal';
import AddNews from './addmodal';
import UpdateNews from './updatemodal';

import { getAuthHeaders } from '@/app/utility/auth';

import { GoSearch } from 'react-icons/go';
import { RiArrowDownLine } from 'react-icons/ri';
import { LuPenLine, LuPenSquare, LuTrash2 } from 'react-icons/lu';
import { AiOutlineDelete } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import TableData from '@/app/components/tabledata';
import { Button } from '@heroui/button';

type Category = {
    id: string;
    user_id: string;
    name: string;
    video: File;
    thumbnail: File;
};

const VideoTable: React.FC = () => {
    const router = useRouter();

    const fetcherWithAuth = async (url: string) => {
        const headers = getAuthHeaders();

        const res = await fetch(url, {
            method: "GET",
            headers: headers,
            cache: "no-cache",
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
    const { data, error, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`, fetcherWithAuth);
    const [categories, setCategories] = useState<Category[]>([]);

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

    // Open delete modal and store the category ID
    const handleDeleteClick = (categoryId: string) => {
        setCategoryToDelete(categoryId);
        setDeleteModalOpen(true);
    };

    const confirmDeleteCategory = async () => {
        if (!categoryToDelete) return;
        setDeleteBtnLoading(true);
        try {
            await deleteCategory(categoryToDelete);
            toast.success("Video deleted successfully!");
            setDeleteModalOpen(false);
            setDeleteBtnLoading(false);
        } catch (error) {
            console.error("Error deleting video:", error);
        }
    };

    const deleteCategory = async (categoryId: string) => {
        try {
            const headers = getAuthHeaders();
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${categoryId}`, {
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

    const closeUpdateModal = () => setUpdateModalOpen(false);

    // Function to handle the category update


    const columns = [
        // { label: 'ID', accessor: (category: Category) => category.id },
        { key: "name", label: 'Name', renderCell: (category: Category) => category.name },
        {
            key: "video",
            label: "Video",
            renderCell: (category: Category) => {
                const videoSrc = `${process.env.NEXT_PUBLIC_API_URL}/video/${category.video}`;
                const posterSrc = `${process.env.NEXT_PUBLIC_API_URL}/video/${category.thumbnail}`;

                return (
                    <video
                        key={category.id} // Force React to re-render when source changes
                        controls
                        width="200"
                        className="max-h-[100px] rounded-md shadow-md"
                        poster={posterSrc}
                    >
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
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
                        variant='flat'
                        color='primary'
                        onPress={() => handleUpdateClick(category)}

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
            <div className="flex justify-end mb-4">
                <AddNews mutate={mutate} />
            </div>
            <TableData
                filter={true}
                hasStatusFilter={false}
                label="VIDEOS"
                description="Manage and organize all uploaded videos."
                columns={columns}
                data={categories}
            // statusOptions={statusOptions}
            />
            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDeleteCategory}
                deleteBtnLoading={deleteBtnLoading}
                message="Are you sure you want to delete this video?"
            />

            {updateModalOpen && (
                <UpdateNews
                    initialData={categoryToUpdate!}
                    onClose={closeUpdateModal}
                    mutate={mutate}
                />
            )}
        </div>
    );
};

export default VideoTable;
