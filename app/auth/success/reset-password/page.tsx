import { LuCheckCircle } from 'react-icons/lu';
import Link from 'next/link';

export default function PasswordChangeSuccess() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-100 to-gray-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <div className="text-center">
                    <LuCheckCircle className="mx-auto h-16 w-16 text-green-500" />
                    <h1 className="mt-4 text-3xl font-bold text-gray-900">Password Changed Successfully</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Your password has been updated. You can now use your new password to log in.
                    </p>
                </div>
                <div className="mt-8 flex justify-center">
                    <Link
                        href="/auth/login"
                        className="w-full px-6 py-3 text-center text-white bg-primary rounded-md hover:bg-primary-light focus:outline-none focus:ring focus:ring-primary-light"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
