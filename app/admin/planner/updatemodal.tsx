import React, { useState } from 'react';
import Success from '@/app/components/alert/success';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface CategoryUpdateModalProps {
    initialData: {
        id: string;
        name: string;
        type: string;
        width: number;
        height: number;
        image: string;
    };
    onClose: () => void;
    mutate: () => void;
}

const CategoryUpdateModal: React.FC<CategoryUpdateModalProps> = ({ initialData, onClose, mutate }) => {
    const [formData, setFormData] = useState({
        id: initialData.id,
        name: initialData.name,
        type: initialData.type,
        width: initialData.width,
        height: initialData.height,
        image: initialData.image,
        newImage: null as File | null,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                alert('File size must be less than 1 MB');
            } else if (!file.type.startsWith('image/')) {
                alert('Only images are allowed');
            } else {
                setFormData((prevState) => ({
                    ...prevState,
                    newImage: file,
                }));
            }
        }
    };

    const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let accessToken;

            if (typeof window !== 'undefined' && window.sessionStorage) {
                accessToken = sessionStorage.getItem('token');
            } else {
                accessToken = null;
            }


            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            };

            const data = new FormData();
            data.append('id', formData.id);
            data.append('name', formData.name);
            data.append('type', formData.type);
            data.append('width', formData.width.toString());
            data.append('height', formData.height.toString());
            if (formData.newImage) {
                data.append('image', formData.newImage);
            }
            data.append('_method', 'PUT');

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/items`, data, { headers });

            if (response?.data) {
                mutate();
                onClose();
                toast.success('Item updated successfully!');
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            const errorMsg =
                axiosError.response?.data && typeof axiosError.response.data === 'object'
                    ? (axiosError.response.data as any).message
                    : 'An unexpected error occurred.';
            toast.error(errorMsg);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog"
            aria-labelledby="update-category-modal-title"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl">
                <form onSubmit={handleUpdateSubmit} encType="multipart/form-data">
                    <div className="flex justify-between items-center py-3 px-4 border-b">
                        <h3
                            id="update-category-modal-title"
                            className="text-lg font-bold text-gray-800 uppercase"
                        >
                            Update item
                        </h3>
                        <button
                            type="button"
                            className="p-2 text-gray-800 hover:bg-gray-200 rounded-full"
                            aria-label="Close"
                            onClick={onClose}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="type"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Type
                                </label>
                                <input
                                    id="type"
                                    type="text"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="width"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Width
                                </label>
                                <input
                                    id="width"
                                    type="number"
                                    name="width"
                                    value={formData.width}
                                    onChange={handleChange}
                                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="height"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Height
                                </label>
                                <input
                                    id="height"
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="newImage"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Image
                                </label>
                                <input
                                    id="newImage"
                                    type="file"
                                    name="newImage"
                                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                        <button
                            type="button"
                            className="py-2 px-3 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="py-2 px-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryUpdateModal;