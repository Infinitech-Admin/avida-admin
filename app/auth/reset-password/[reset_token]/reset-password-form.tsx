// app\auth\reset-password\[reset_token]\reset-password-form.tsx
"use client";
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

interface ResetPasswordFormData {
    password: string;
}

interface ResetPasswordFormProps {
    reset_token: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ reset_token }) => {
    const [formData, setFormData] = useState<ResetPasswordFormData>({
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/reset-password`, {
                ...formData,
                reset_token,
            });
            router.replace('/auth/success/reset-password');
            setLoading(false);
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
                setLoading(false);
                setErrorMessage((axiosError.response.data as any).message || 'An error occurred. Please try again.');
            } else {
                setLoading(false);
                setErrorMessage('An unexpected error occurred.');
            }
        }
    };

    return (
        <form className='mt-8' onSubmit={handleSubmit}>
            <div className="max-w-full mb-4">
                <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your new password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className={`min-w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    {loading ? 'Submit...' : 'Submit'}
                </button>
            </div>
        </form>
    );
};

export default ResetPasswordForm;