import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import BtnLoadingSpinner from '@/app/components/spinner';
import FormikCustomErrorMsg from '@/app/components/formik-custom-error-msg';
import ListingImageSlider from './listingimageslider';

interface Listings {
    id: string;
    name: string;
    email: string;
    phone: string;
    unit_name: string;
    unit_type: string;
    unit_location: string;
    unit_price: string;
    status: string;
    images: string;
    description: string;
    user: User;
}

interface User {
    name: string;
}

interface ListingsInfoProps {
    data: Listings;
}

const ListingsInfo: React.FC<ListingsInfoProps> = ({ data }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading1, setIsLoading1] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [formData, setFormData] = useState<Listings>(data);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    let token: string | null;

    if (typeof window !== 'undefined' && window.localStorage) {
        token = sessionStorage.getItem('token');
    } else {
        token = null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedImages(Array.from(e.target.files));
        }
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};
        if (!formData.name) errors.name = 'Owner Name is required';
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.phone) errors.phone = 'Phone Number is required';
        if (!formData.unit_name) errors.unit_name = 'Property Name is required';
        if (!formData.unit_type) errors.unit_type = 'Unit/PS Type is required';
        if (!formData.unit_location) errors.unit_location = 'Property Location is required';
        if (!formData.description) errors.description = 'Description is required';
        if (!formData.unit_price) errors.unit_price = 'Property Price is required';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpdateSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading2(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const formDataToSend = new FormData();
            formDataToSend.append('_method', 'PUT');
            formDataToSend.append('id', data.id || '');

            // Append text fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== "images") {
                    formDataToSend.append(key, value);
                }
            });

            selectedImages.forEach((image) => {
                formDataToSend.append("images[]", image);
            });

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/listings`, formDataToSend, { headers });
            toast.success("Operation Success!");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading2(false);
        }
    };

    const handlePostListing = async () => {
        setIsLoading(true);
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/listings/change-status`,
                { id: data.id, status: 'Accepted' },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            await axios.post(`/api/email/listing/approved`, {
                name: data.user.name,
                email: data.email,
            });
            toast.success('Listing has been posted successfully and email notification sent.')
            router.refresh();
        } catch (error) {
            toast.error('Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeclineListing = async () => {
        setIsLoading1(true);
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/listings/change-status`,
                { id: data.id, status: 'Declined' },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            await axios.post(`/api/email/listing/declined`, {
                name: data.user.name,
                email: data.email,
            });
            toast.success('Listing has been declined successfully and email notification sent.')
            router.refresh();
        } catch (error) {
            toast.error('Something went wrong.');
        } finally {
            setIsLoading1(false);
        }
    };

    const images = JSON.parse(data.images || '[]');

    return (
        <div className="p-4 overflow-y-auto">
            <div className="flex gap-4">
                <h1 className="font-bold uppercase text-black text-2xl">Listings Details</h1>
                <div
                    className={`flex items-center rounded-md border py-0.5 px-2.5 font-semibold text-sm transition-all shadow-sm ${data.status === "Accepted"
                        ? "border-green-500 text-green-600 bg-green-100"
                        : data.status === "Pending"
                            ? "border-yellow-500 text-yellow-600 bg-yellow-100"
                            : "border-red-500 text-red-600 bg-red-100"
                        }`}
                >
                    {data.status === "Accepted" ? (
                        <span>Accepted</span>
                    ) : data.status === "Pending" ? (
                        <span>Pending</span>
                    ) : (
                        <span>Declined</span>
                    )}
                </div>
            </div>
            <div className="p-4">
                <ListingImageSlider images={images} />
            </div>

            <div className="grid col-span-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 w-full">
                    <label className="block text-sm font-medium mb-2 text-black">Owner Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`py-3 px-4 block w-full border ${validationErrors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm text-black`}
                    />
                    {validationErrors.name && <FormikCustomErrorMsg>{validationErrors.name}</FormikCustomErrorMsg>}
                </div>

                <div className="col-span-1 w-full">
                    <label className="block text-sm font-medium mb-2 text-black">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`py-3 px-4 block w-full border ${validationErrors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm text-black`}
                    />
                    {validationErrors.email && <FormikCustomErrorMsg>{validationErrors.email}</FormikCustomErrorMsg>}
                </div>

                <div className="col-span-1 w-full">
                    <label className="block text-sm font-medium mb-2 text-black">Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`py-3 px-4 block w-full border ${validationErrors.phone ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm text-black`}
                    />
                    {validationErrors.phone && <FormikCustomErrorMsg>{validationErrors.phone}</FormikCustomErrorMsg>}
                </div>

                <div className="col-span-1 w-full">
                    <label className="block text-sm font-medium mb-2 text-black">Property Name</label>
                    <input
                        type="text"
                        name="unit_name"
                        value={formData.unit_name}
                        onChange={handleInputChange}
                        className={`py-3 px-4 block w-full border ${validationErrors.unit_name ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm text-black`}
                    />
                    {validationErrors.unit_name && <FormikCustomErrorMsg>{validationErrors.unit_name}</FormikCustomErrorMsg>}
                </div>

                <div className="col-span-1 w-full">
                    <label className="block text-sm font-medium mb-2 text-black">Unit/PS Type</label>
                    <input
                        type="text"
                        name="unit_type"
                        value={formData.unit_type}
                        onChange={handleInputChange}
                        className={`py-3 px-4 block w-full border ${validationErrors.unit_type ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm text-black`}
                    />
                    {validationErrors.unit_type && <FormikCustomErrorMsg>{validationErrors.unit_type}</FormikCustomErrorMsg>}
                </div>

                <div className="col-span-2 w-full">
                    <label className="block text-sm font-medium mb-2 text-black">Property Location</label>
                    <input
                        type="text"
                        name="unit_location"
                        value={formData.unit_location}
                        onChange={handleInputChange}
                        className={`py-3 px-4 block w-full border ${validationErrors.unit_location ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm text-black`}
                    />
                    {validationErrors.unit_location && <FormikCustomErrorMsg>{validationErrors.unit_location}</FormikCustomErrorMsg>}
                </div>


                <div className="col-span-2 w-full">
                    <label className="block text-sm font-medium mb-2 text-black">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className={`py-3 px-4 block w-full border ${validationErrors.description ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm text-black`}
                    />
                    {validationErrors.description && <FormikCustomErrorMsg>{validationErrors.description}</FormikCustomErrorMsg>}
                </div>

                <div className="col-span-1 w-full">
                    <label className="block text-sm font-medium mb-2 text-black">Property Price</label>
                    <input
                        type="number"
                        name="unit_price"
                        value={formData.unit_price}
                        onChange={handleInputChange}
                        className={`py-3 px-4 block w-full border ${validationErrors.unit_price ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm text-black`}
                    />
                    {validationErrors.unit_price && <FormikCustomErrorMsg>{validationErrors.unit_price}</FormikCustomErrorMsg>}
                </div>

                <div className="col-span-1 w-full">
                    <label htmlFor="Images" className="block text-sm font-medium mb-2">Images</label>
                    <input
                        type="file"
                        name="images"
                        className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-end gap-1">
                <button
                    type="button"
                    onClick={handleUpdateSubmit}
                    disabled={isLoading2}
                    className={`py-2 px-4 text-sm font-medium rounded-lg border text-white hover:bg-green-700 min-w-[150px] w-full sm:w-auto ${isLoading2 ? 'bg-green-400' : 'bg-green-600'
                        }`}
                >
                    {isLoading2 ? <BtnLoadingSpinner /> : 'SAVE'}
                </button>
                {data.status === "Accepted" ? (
                    <button
                        type="button"
                        onClick={handleDeclineListing}
                        disabled={isLoading1}
                        className={`py-2 px-4 text-sm font-medium rounded-lg border text-white hover:bg-red-700 min-w-[150px] w-full sm:w-auto ${isLoading1 ? 'bg-red-400' : 'bg-red-600'
                            }`}
                    >
                        {isLoading1 ? <BtnLoadingSpinner /> : 'DECLINE'}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handlePostListing}
                        disabled={isLoading}
                        className={`py-2 px-4 text-sm font-medium rounded-lg border text-white hover:bg-blue-700 min-w-[150px] w-full sm:w-auto ${isLoading ? 'bg-blue-400' : 'bg-blue-600'
                            }`}
                    >
                        {isLoading ? <BtnLoadingSpinner /> : 'POST LISTINGS'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ListingsInfo;