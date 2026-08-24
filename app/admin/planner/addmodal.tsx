import React, { useState } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface AddNewsProps {
    mutate: () => void;
}

const AddNews: React.FC<AddNewsProps> = ({ mutate }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        width: '',
        height: '',
        image: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target instanceof HTMLInputElement && e.target.files ? e.target.files[0] : e.target.value,
        }));
    };

    const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let accessToken;

            if (typeof window !== 'undefined' && window.sessionStorage) {
                accessToken = sessionStorage.getItem('token');
            } else {
                // Handle server-side logic or fallback
                accessToken = null; // or fetch from another source
            }

            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            };

            const data = new FormData();
            data.append('name', formData.name);
            data.append('type', formData.type);
            data.append('width', formData.width);
            data.append('height', formData.height);
            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/items`, data, { headers });

            if (response?.data) {
                setFormData({
                    name: '',
                    type: '',
                    width: '',
                    height: '',
                    image: null,
                });
                mutate();
                setModalOpen(false);
                toast.success('Item added successfully!');
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
        <div>
            <button
                type="button"
                className="min-w-[150px] py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
                aria-label="Add item"
                onClick={() => setModalOpen(true)}
            >
                <IoAddCircleOutline className="h-6 w-6" /> Add item
            </button>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    role="dialog"
                    aria-labelledby="add-headline-modal-title"
                >
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl">
                        <form onSubmit={handleAddSubmit} encType="multipart/form-data">
                            <div className="flex justify-between items-center py-3 px-4 border-b">
                                <h3
                                    id="add-headline-modal-title"
                                    className="text-lg font-bold text-gray-800 uppercase"
                                >
                                    Add item
                                </h3>
                                <button
                                    type="button"
                                    className="p-2 text-gray-800 hover:bg-gray-200 rounded-full"
                                    aria-label="Close"
                                    onClick={() => setModalOpen(false)}
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
                                            htmlFor="image"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            Image
                                        </label>
                                        <input
                                            id="image"
                                            type="file"
                                            name="image"
                                            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                            accept="image/*"
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                                <button
                                    type="button"
                                    className="py-2 px-3 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="py-2 px-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Add Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddNews;