import React, { useState } from 'react';

import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { IoAddCircleOutline } from 'react-icons/io5';

interface AddNewsProps {
    mutate: () => void;
}

const AddNews: React.FC<AddNewsProps> = ({ mutate }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        referrer: '',
        sub_agent: '',
        broker: '',
        partner: '',
        position: '',
        image: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
                accessToken = null;
            }

            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            };

            const data = new FormData();
            data.append('referrer', formData.referrer);
            data.append('sub_agent', formData.sub_agent);
            data.append('broker', formData.broker);
            data.append('partner', formData.partner);
            data.append('position', formData.position);
            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/careers`, data, { headers });

            if (response?.data) {
                setFormData({
                    referrer: '',
                    sub_agent: '',
                    broker: '',
                    partner: '',
                    position: '',
                    image: null,
                });
                mutate();
                setModalOpen(false);
                toast.success('Career added successfully!');
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
                className="min-w-[150px] py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                aria-label="Add Career"
                onClick={() => setModalOpen(true)}
            >
                <IoAddCircleOutline className="h-6 w-6" /> Add career
            </button>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    role="dialog"
                    aria-labelledby="add-Career-modal-title"
                >
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl">
                        <form onSubmit={handleAddSubmit} encType="multipart/form-data">
                            <div className="flex justify-between items-center py-3 px-4 border-b">
                                <h3
                                    id="add-Career-modal-title"
                                    className="text-lg font-bold text-gray-800 uppercase"
                                >
                                    Add Career
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
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {['referrer', 'sub_agent', 'broker', 'partner', 'position'].map((field) => (
                                        <div className="col-span-4" key={field}>
                                            <label
                                                htmlFor={field}
                                                className="block text-sm font-medium mb-2"
                                            >
                                                {field.replace('_', ' ').toUpperCase()}
                                            </label>
                                            <input
                                                id={field}
                                                type="text"
                                                name={field}
                                                className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                                placeholder={`Enter ${field.replace('_', ' ')}`}
                                                value={(formData as any)[field]}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    ))}

                                    <div className="col-span-4">
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
                                    Add Career
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