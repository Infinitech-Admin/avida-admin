import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { mutate } from 'swr';
import toast from 'react-hot-toast';
import BtnLoadingSpinner from '@/app/components/spinner';

interface UpdateQuestionProps {
    initialData: {
        id: string;
        question: string;
        answer: string;
        status: string;
    };
    onClose: () => void;
    mutate: () => void;
}

const UpdateQuestion: React.FC<UpdateQuestionProps> = ({ initialData, onClose }) => {
    const [formData, setFormData] = useState({
        id: initialData.id,
        question: initialData.question,
        answer: initialData.answer,
        status: initialData.status,
    });

    const [loading, setLoading] = useState(false)

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
        setLoading(true);

        try {
            let accessToken;

            if (typeof window !== 'undefined' && window.sessionStorage) {
                accessToken = sessionStorage.getItem('token');
            } else {
                accessToken = null;
            }

            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/questions`,
                {
                    id: formData.id,
                    question: formData.question,
                    answer: formData.answer,
                    status: formData.status,
                },
                { headers }
            );

            if (response?.data) {
                mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/questions`);
                onClose();
                toast.success('FAQ updated successfully!');
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            const errorMsg =
                axiosError.response?.data && typeof axiosError.response.data === 'object'
                    ? (axiosError.response.data as any).message
                    : 'An unexpected error occurred.';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog"
            aria-labelledby="update-question-modal-title"
        >
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl">
                <form onSubmit={handleUpdateSubmit}>
                    <div className="flex justify-between items-center py-3 px-4 border-b">
                        <h3
                            id="update-question-modal-title"
                            className="text-lg font-bold text-gray-800 uppercase"
                        >
                            Update FAQ
                        </h3>
                        <button
                            type="button"
                            className="p-2 text-gray-800 hover:bg-gray-200 rounded-full"
                            aria-label="Close"
                            onClick={onClose}
                            disabled={loading}
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
                            <div className="col-span-3">
                                <label
                                    htmlFor="question"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Question
                                </label>
                                <input
                                    id="question"
                                    type="text"
                                    name="question"
                                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                    placeholder="Enter question"
                                    value={formData.question}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-span-1">
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select Status</option>
                                    <option value="active">Active</option>
                                    <option value="not active">Not Active</option>
                                </select>
                            </div>

                            <div className="col-span-4">
                                <label
                                    htmlFor="answer"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Answer
                                </label>
                                <textarea
                                    id="answer"
                                    name="answer"
                                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                                    placeholder="Enter answer"
                                    value={formData.answer}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                        <button
                            type="button"
                            className="min-w-24 min-h-10 py-2 px-3 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`min-w-24 min-h-10 py-2 px-3 rounded-lg text-white ${loading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            disabled={loading}
                        >
                            {loading ? <BtnLoadingSpinner /> : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateQuestion;
