import React, { useState, useRef } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import BtnLoadingSpinner from '@/app/components/spinner';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Image,
} from '@heroui/react';
import { SlPlus } from 'react-icons/sl';
import { LuImage, LuX } from 'react-icons/lu'; // Import the image and close icon

interface AddModalProps {
    mutate: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ mutate }) => {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        image: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
    const thumbnailInputRef = useRef<HTMLInputElement | null>(null); // Reference for the input field

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (files && files.length > 0) {
            const file = files[0];
            setFormData((prevState) => ({
                ...prevState,
                [name]: file,
            }));

            // Handle file preview for image
            if (name === 'image' && file instanceof File) {
                setImagePreview(URL.createObjectURL(file));  // Set preview URL for the image
            }
        } else if (value) {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null); // Remove image preview
        if (thumbnailInputRef.current) {
            thumbnailInputRef.current.value = ''; // Clear file input
        }
    };

    const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const user_id = sessionStorage.getItem('user_id');
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            };

            const data = new FormData();
            if (user_id) {
                data.append('user_id', user_id);
            }
            data.append('name', formData.name);
            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/contracts`, data, { headers });

            if (response?.data) {
                setFormData({
                    name: '',
                    image: null,
                });
                setImagePreview(null);  // Reset preview after successful submission
                mutate();
                setModalOpen(false);
                toast.success('Contract added successfully!');
                setLoading(false);
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            const errorMsg =
                axiosError.response?.data && typeof axiosError.response.data === 'object'
                    ? (axiosError.response.data as any).message
                    : 'An unexpected error occurred.';
            toast.error(errorMsg);
            setLoading(false);
        }
    };

    return (
        <div>
            <Button
                size="lg" color="primary" startContent={<SlPlus size={18} />}
                type="button"
                aria-label="Add Contract"
                onPress={() => setModalOpen(true)}
            >
                Add Contract
            </Button>

            {isModalOpen && (
                <Modal size='4xl' isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                    <ModalContent>
                        <ModalHeader>Add Contract</ModalHeader>
                        <form onSubmit={handleAddSubmit} encType="multipart/form-data">
                            <ModalBody>
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <Input
                                            size="lg"
                                            isRequired
                                            label="Contract Name"
                                            labelPlacement="outside"
                                            variant="bordered"
                                            id="name"
                                            type="text"
                                            name="name"
                                            placeholder="Enter Contract Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-row gap-4">
                                        {/* Upload */}
                                        <div
                                            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer relative w-1/2 h-48"
                                            onClick={() => {
                                                if (thumbnailInputRef.current) {
                                                    thumbnailInputRef.current.value = '';
                                                    thumbnailInputRef.current.click();
                                                }
                                            }}
                                        >
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
                                                <div className="flex flex-col justify-center items-center text-center">
                                                    <LuImage size={72} />
                                                    <h1>Click to Upload Thumbnail</h1>
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        Supported formats: JPEG, PNG, GIF, BMP, TIFF
                                                    </p>
                                                </div>
                                            </div>
                                            <input
                                                ref={thumbnailInputRef}
                                                id="thumbnail-input"
                                                type="file"
                                                name="image"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {/* Preview */}
                                        {imagePreview && (
                                            <div className="relative">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Thumbnail Preview"
                                                    className="w-full h-48 object-cover rounded"
                                                />
                                                <Button
                                                    size="sm"
                                                    isIconOnly
                                                    startContent={<LuX />}
                                                    onPress={handleRemoveImage}
                                                    className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button size="lg" variant="light" onPress={() => setModalOpen(false)} disabled={loading}>
                                    Cancel
                                </Button>
                                <Button
                                    isLoading={loading}
                                    size="lg"
                                    type="submit"
                                    color="primary"
                                >
                                    Add Contract
                                </Button>
                            </ModalFooter>
                        </form>
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
};

export default AddModal;
