import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import PropertyDetailsContent from './propertycontent';
import toast from 'react-hot-toast';
import BtnLoadingSpinner from '@/app/components/spinner';
import DataTable from '@/app/components/matt/DataTable';

interface PropertyDetailsContentProps {
    id: string | null;
}

interface Feature {
    id: string;
    name: string;
}

interface AddFeatures {
    name: string;
}

const Features: React.FC<PropertyDetailsContentProps> = ({ id }) => {
    const [unitData, setUnitData] = useState<Feature[]>([]);
    const [formData, setFormData] = useState<AddFeatures>({
        name: '',
    });
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isLoading1, setLoading1] = useState<boolean>(false);
    const [isLoading2, setLoading2] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [deleteUnitId, setDeleteUnitId] = useState<string | null>(null);


    const fetchUnitData = async () => {

        setLoading(true);
        setError(null);

        try {
            const token = sessionStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`, { headers });
            setUnitData(response.data.record.features || []);
        } catch (err) {
            setError('Failed to load feature data. Please try again later.');
        } finally {
            setLoading(false);
        }

    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Add a new feature
    const handleAddUnit = async () => {
        if (!id) {
            alert('Property ID is required to add a feature.');
            return;
        }
        setLoading1(true);
        const unitPayload = { ...formData, property_id: id }; // Merge the property ID
        try {
            const token = sessionStorage.getItem('token');
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/features`, unitPayload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            setAddModalOpen(false);
            setFormData({
                name: '',
            });
            setLoading1(false);
            toast.success("Feature added successfully!");
            await fetchUnitData();
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading1(false);
            setAddModalOpen(false);
        }
    };
    // Delete a feature
    const handleDeleteUnit = async () => {
        if (!deleteUnitId) return;

        try {
            const token = sessionStorage.getItem('token');
            setLoading2(true);
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/features/${deleteUnitId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            setDeleteModalOpen(false);
            setLoading2(false);
            toast.success("Feature deleted successfully!");
            await fetchUnitData();
        } finally {
            setLoading2(false);
            setDeleteModalOpen(false);
            setDeleteUnitId(null);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchUnitData();
    }, [id]);

    const columns = [
        { key: 'name', header: 'Feature' },
        {
            key: 'actions', header: 'Actions', renderCell: (row: Feature) => (
                <button onClick={() => { setDeleteModalOpen(true); setDeleteUnitId(row.id); }}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                >
                    Delete
                </button>
            ),
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Form to add new features */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    setAddModalOpen(true);
                }}
            >
                {/* Form content */}
                <div className="col-span-1">
                    <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-lg p-4 md:p-5">
                        <div className="w-full mb-3">
                            <label htmlFor="type" className="block text-sm font-medium mb-2 ">
                                Features
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="e.g., Swimming Pool"
                                value={formData?.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <input type="hidden" name="id" value={id || ''} />
                        <div className="w-full">
                            <div className="w-full">
                                <button
                                    type="submit"
                                    className="w-full py-2 px-3 min-h-10 inline-flex items-center justify-center text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
                                >
                                    Add Feature
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Confirmation modals */}
            {isAddModalOpen && (
                <Modal
                    title="Confirm"
                    body="Are you sure you want to add this feature?"
                    onConfirm={handleAddUnit}
                    onCancel={() => setAddModalOpen(false)}
                    isLoading={isLoading1}
                    actionLabel="Confirm"
                />
            )}

            {isDeleteModalOpen && (
                <Modal
                    title="Confirm Delete"
                    body="Are you sure you want to delete this feature?"
                    onConfirm={handleDeleteUnit}
                    onCancel={() => setDeleteModalOpen(false)}
                    isLoading={isLoading2}
                    actionLabel="Delete"
                />
            )}


            {/* Feature List Table */}
            <div className="col-span-2">
                <div className="flex flex-col">
                    <div className="overflow-x-auto">
                        <div className="border rounded-lg shadow">
                            <DataTable columns={columns} data={unitData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Modal: React.FC<{
    title: string;
    body: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
    actionLabel: string;
}> = ({ title, body, onConfirm, onCancel, isLoading, actionLabel }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-medium mb-4">{title}</h2>
            <p>{body}</p>
            <div className="flex justify-end gap-3 mt-6">
                <button
                    className="py-2 px-3 text-sm font-medium bg-gray-200 rounded-lg"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    className={`min-w-[100px] py-2 px-3 text-sm font-medium rounded-lg text-white focus:outline-none ${isLoading
                        ? title === 'Confirm'
                            ? 'bg-blue-400'
                            : 'bg-red-400'
                        : title === 'Confirm'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                    onClick={onConfirm}
                    disabled={isLoading}
                >
                    {isLoading ? <BtnLoadingSpinner /> : actionLabel}
                </button>
            </div>
        </div>
    </div>
);


export default Features;