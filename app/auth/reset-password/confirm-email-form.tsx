"use client";
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

interface ConfirmEmailFormData {
    email: string;
}

const ConfirmEmailForm: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<ConfirmEmailFormData>({
        email: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/request-reset`,
                formData
            );
            router.replace('/auth/success/email');
            const { reset_token } = response.data;

            await axios.post(`/api/email/reset-password`, {
                email: formData.email,
                reset_token: reset_token,
            });

            setFormData({ email: '' });


        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
                setErrorMessage(
                    (axiosError.response.data as any).message || 'An error occurred. Please try again.'
                );
            } else {
                setErrorMessage('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="mt-8" onSubmit={handleSubmit}>
            <div className="max-w-full mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className={`min-w-32 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-50 pointer-events-none' : ''
                        }`}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/auth/login')}
                    className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                >
                    Sign in
                </button>
            </div>
        </form>
    );
};

export default ConfirmEmailForm;
