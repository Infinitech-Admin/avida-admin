"use client";
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { setCookie } from 'nookies';
import { useRouter } from 'next/navigation'
import BtnLoadingSpinner from '@/app/components/spinner';
import { Button } from '@heroui/button';


interface LoginFormData {
    email: string;
    password: string;
}

const LoginForm: React.FC = () => {
    const router = useRouter()
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');
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
        setMessage('');
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, formData);
            const { token, record } = response.data;

            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user_id', record.id);
            sessionStorage.setItem('profile_id', record.profile.id);
            setCookie(null, 'token', token, { path: '/', maxAge: 30 * 24 * 60 * 60 });
            console.log(response.data)
            router.replace('/admin/dashboard');
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
                setLoading(false);
                setMessage((axiosError.response.data as any).message || 'An error occurred. Please try again.');
            } else {
                setLoading(false);
                setMessage('An unexpected error occurred.');
            }
        }
    };

    return (
        <form className='mt-8 p-4' onSubmit={handleSubmit}>
            {message && (
                <div
                    className="bg-red-100 border  text-red-700 px-4 py-3 rounded-lg relative mb-4"
                    role="alert"
                >
                    <span className="block sm:inline">
                        {message === "The password field must be at least 8 characters."
                            ? "Password must be at least 8 characters"
                            : "Invalid email or password"
                        }
                    </span>
                </div>
            )}
            <div className="max-w-sm mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-2 ">Email</label>
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
            <div className="max-w-sm mb-4">
                <label htmlFor="password" className="block text-sm font-medium mb-2 ">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your password*"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex items-center justify-between">
                <Button
                    isLoading={loading}
                    type="submit"
                    className={`min-w-32 min-h-10 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    Sign in
                </Button>
                <button
                    onClick={() => router.push('/auth/reset-password')}
                    className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                    Forgot Password?
                </button>
            </div>
        </form>
    );
};

export default LoginForm;
