import React from 'react';
import BtnLoadingSpinner from '../spinner';

type DeleteConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    deleteBtnLoading: boolean;
    message: string;
};

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message, deleteBtnLoading }) => {
    return (
        <div
            id="hs-scale-animation-modal"
            className={`fixed top-0 left-0 z-[80] w-full h-full bg-black bg-opacity-50 flex justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            role="dialog"
            aria-labelledby="hs-scale-animation-modal-label"
        >
            <div className={`transform transition-transform duration-300 sm:max-w-lg sm:w-full m-3 sm:mx-auto flex items-center ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <div className="w-full flex flex-col bg-white border shadow-sm rounded-xl">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center py-3 px-4 border-b">
                        <h3 className="font-bold text-gray-800">Confirm Deletion</h3>
                        <button
                            type="button"
                            className="inline-flex justify-center items-center rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none"
                            aria-label="Close"
                            onClick={onClose}
                            disabled={deleteBtnLoading}
                        >
                            <span className="sr-only">Close</span>
                            <svg
                                className="w-4 h-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M18 6L6 18"></path>
                                <path d="M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-4">
                        <p className="text-gray-800">{message}</p>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end items-center gap-2 py-3 px-4 border-t">
                        <button
                            type="button"
                            className="py-2 px-3 min-h-10 min-w-24 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                            onClick={onClose}
                            disabled={deleteBtnLoading}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className={`py-2 px-3 min-h-10 min-w-24 text-sm font-medium rounded-lg ${deleteBtnLoading ? 'bg-red-400' : 'bg-red-600'} text-white hover:${deleteBtnLoading ? 'bg-red-500' : 'bg-red-700'}`}
                            onClick={onConfirm}
                            disabled={deleteBtnLoading}
                        >
                            {deleteBtnLoading ? <BtnLoadingSpinner /> : "Delete"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;