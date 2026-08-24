import React, { useState } from 'react';

import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface UpdateNewsProps {
    initialData: {
        id: string;
        referrer: string;
        sub_agent: string;
        broker: string;
        partner: string;
        position: string;
        image: string;
    };
    onClose: () => void;
    mutate: () => void;
}

const UpdateNews: React.FC<UpdateNewsProps> = ({ initialData, onClose, mutate }) => {
    const [formData, setFormData] = useState({
        id: initialData.id,
        referrer: initialData.referrer,
        sub_agent: initialData.sub_agent,
        broker: initialData.broker,
        partner: initialData.partner,
        position: initialData.position,
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
            data.append('referrer', formData.referrer);
            data.append('sub_agent', formData.sub_agent);
            data.append('broker', formData.broker);
            data.append('partner', formData.partner);
            data.append('position', formData.position);
            if (formData.newImage) {
                data.append('image', formData.newImage);
            }
            data.append('_method', 'PUT');

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/careers`, data, { headers });

            if (response?.data) {
                mutate();
                onClose();
                toast.success('Career updated successfully!');
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
            aria-labelledby="update-news-modal-title"
        >
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl">
                <form onSubmit={handleUpdateSubmit} encType="multipart/form-data">
                    <div className="flex justify-between items-center py-3 px-4 border-b">
                        <h3
                            id="update-news-modal-title"
                            className="text-lg font-bold text-gray-800 uppercase"
                        >
                            Update Career
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
                            {[
                                { label: 'Referrer', name: 'referrer', value: formData.referrer },
                                { label: 'Sub Agent', name: 'sub_agent', value: formData.sub_agent },
                                { label: 'Broker', name: 'broker', value: formData.broker },
                                { label: 'Partner', name: 'partner', value: formData.partner },
                                { label: 'Position', name: 'position', value: formData.position },
                            ].map(({ label, name, value }) => (
                                <div key={name}>
                                    <label
                                        htmlFor={name}
                                        className="block text-sm font-medium mb-2"
                                    >
                                        {label}
                                    </label>
                                    <input
                                        id={name}
                                        type="text"
                                        name={name}
                                        className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                        value={value}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            ))}
                            <div className="col-span-1">
                                <label
                                    htmlFor="image"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Image
                                </label>
                                <input
                                    id="image"
                                    type="file"
                                    name="newImage"
                                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (file.size > 1024 * 1024) {
                                                alert('File size must be less than 1 MB');
                                            } else if (!file.type.startsWith('image/')) {
                                                alert('Only images are allowed');
                                            } else {
                                                setFormData((prev) => ({ ...prev, newImage: file }));
                                            }
                                        }
                                    }}
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
                            Update Career
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateNews;