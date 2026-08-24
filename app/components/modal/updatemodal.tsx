import React, { useState, useEffect } from 'react';
import { MdOutlineCancel } from 'react-icons/md';  // Ensure you have this import if using the MdOutlineCancel icon

type UpdateModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (category: { id: string; name: string; description: string }) => void;
    category: { id: string; name: string; description: string } | null;
};

const CategoryUpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, onUpdate, category }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Sync the modal fields with the passed category data
    useEffect(() => {
        if (category) {
            setName(category.name);
            setDescription(category.description);
        }
    }, [category]);

    // Handle the form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (category) {
            onUpdate({ id: category.id, name, description });
        }
    };

    // If the modal is not open or no category is provided, return null
    if (!isOpen || !category) return null;

    return (
        <div
            className={`fixed top-0 left-0 z-[80] w-full h-full bg-black bg-opacity-50 overflow-x-hidden overflow-y-auto transition-opacity duration-300 ease-out 
                ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-labelledby="hs-scale-animation-modal-label"
        >
            <div
                className={`transform transition-all duration-300 ease-in-out sm:max-w-lg sm:w-full m-3 sm:mx-auto flex items-center 
                    ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            >
                <div className="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center py-3 px-4 border-b">
                        <h3 id="hs-scale-animation-modal-label" className="font-bold text-gray-800">
                            Update Category
                        </h3>
                        <button
                            type="button"
                            className="size-8 inline-flex justify-center items-center rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                            aria-label="Close"
                            onClick={onClose}
                        >
                            <span className="sr-only">Close</span>
                            <MdOutlineCancel className="h-8 w-8" />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-4 overflow-y-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    id="categoryName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter category name"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter description"
                                    required
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                                <button
                                    type="button"
                                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                                    onClick={onClose}
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    Save Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryUpdateModal;
