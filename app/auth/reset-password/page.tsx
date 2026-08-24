import React from 'react';
import ConfirmEmailForm from './confirm-email-form';

const ResetPasswordPage = () => {
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
            <div className="flex flex-col bg-white border shadow-sm rounded-xl p-6 w-full max-w-sm md:max-w-md">
                <div className="flex flex-col justify-center items-center">
                    <h3 className="text-lg font-bold text-gray-800 mt-4">
                        Reset Password
                    </h3>
                </div>
                <ConfirmEmailForm />
            </div>
        </div>
    );
};

export default ResetPasswordPage;
