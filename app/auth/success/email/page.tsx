import { LuCheckCircle } from 'react-icons/lu';

export default function PasswordResetSent() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-100 to-gray-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <div className="text-center">
                    <LuCheckCircle className="mx-auto h-16 w-16 text-green-500" />
                    <h1 className="mt-4 text-3xl font-bold text-gray-900">Reset Password Email Sent</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        A link to reset your password has been sent to your email. Please check your inbox.
                    </p>
                </div>
            </div>
        </div>
    );
}