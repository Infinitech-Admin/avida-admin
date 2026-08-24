import BtnLoadingSpinner from "@/app/components/spinner";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
    useDisclosure,
    Input,
    Select,
    SelectItem,
    Textarea,
} from "@heroui/react";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuX } from "react-icons/lu";
import { RiImageAddFill } from "react-icons/ri";
import { SlPlus } from "react-icons/sl";

interface AddPropertyProps {
    mutate?: () => void;
}

const AddNewProperty: React.FC<AddPropertyProps> = ({ mutate }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    let user_id = typeof window !== "undefined" ? sessionStorage.getItem("user_id") : null;
    let accessToken = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

    const [formData, setFormData] = useState<{ [key: string]: any }>({
        user_id: user_id,
        name: "",
        logo: "N/A",
        slogan: "N/A",
        description: "",
        location: "",
        min_price: "",
        max_price: "",
        status: "",
        percent: "",
        images: [],
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type } = e.target;

        if (type === "file") {
            const files = (e.target as HTMLInputElement).files;
            if (files) {
                const fileArray = Array.from(files);
                const imageUrls = fileArray.map((file) =>
                    URL.createObjectURL(file)
                );

                setImages((prev) => [...prev, ...imageUrls]);
                setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, ...fileArray],
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "number" ? parseInt(value, 10) : value,
            }));
        }
    };

    const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data",
            };

            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                const value = formData[key];
                if (key === "images" && Array.isArray(value)) {
                    value.forEach((file) => data.append("images[]", file));
                } else {
                    data.append(key, value);
                }
            });

            const postResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/properties`,
                data,
                { headers }
            );

            if (postResponse?.data) {
                setFormData({
                    name: "",
                    logo: "",
                    Slogan: "",
                    description: "",
                    location: "",
                    min_price: "",
                    max_price: "",
                    status: "",
                    percent: "",
                    images: [],
                });
                setImages([]);
                mutate?.();
                setLoading(false)
                toast.success(`${formData.name} has been added successfully!`);
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            const errorMsg =
                axiosError.response?.data &&
                    typeof axiosError.response.data === "object"
                    ? (axiosError.response.data as any).message
                    : "An unexpected error occurred.";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_: any, index: number) => index !== indexToRemove),
        }));
    };


    return (
        <>
            <Button
                size="lg"
                variant="solid"
                color="primary"
                onPress={onOpen}
                startContent={<SlPlus size={18} />}
            >
                ADD NEW PROPERTY
            </Button>
            <Modal size="4xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <h1>ADD NEW PROPERTY</h1>
                            </ModalHeader>
                            <ModalBody>
                                <form
                                    onSubmit={handleAddSubmit}
                                    encType="multipart/form-data"
                                >
                                    <div className="p-4 overflow-y-auto">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="col-span-2">
                                                <Input
                                                    type="hidden"
                                                    name="user_id"
                                                    value={formData.user_id}
                                                />
                                                <Input
                                                    type="hidden"
                                                    name="slogan"
                                                    value="N/A"
                                                />
                                                <Input
                                                    type="hidden"
                                                    name="logo"
                                                    value="N/A"
                                                />
                                                <Input
                                                    isRequired
                                                    size="lg"
                                                    type="text"
                                                    name="name"
                                                    variant="bordered"
                                                    label="Property Name"
                                                    labelPlacement="outside"
                                                    placeholder="eg., Anissa Heights"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-span-2">
                                                <Select
                                                    isRequired
                                                    label="Status"
                                                    size="lg"
                                                    labelPlacement="outside"
                                                    variant="bordered"
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleChange}
                                                    placeholder="Select Status"
                                                >
                                                    {["RFO", "Pre-Selling"].map(
                                                        (item, index) => (
                                                            <SelectItem
                                                                key={index}
                                                            >
                                                                {item}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </Select>
                                            </div>

                                            <div className="col-span-1">
                                                <Input
                                                    isRequired
                                                    size="lg"
                                                    labelPlacement="outside"
                                                    label="Status (%)"
                                                    variant="bordered"
                                                    type="text"
                                                    name="percent"
                                                    placeholder="eg., 0.0"
                                                    value={formData.percent}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-span-1">
                                                <Input
                                                    isRequired
                                                    size="lg"
                                                    labelPlacement="outside"
                                                    label="Min Price"
                                                    variant="bordered"
                                                    type="number"
                                                    name="min_price"
                                                    placeholder="eg., 00.00"
                                                    value={formData.min_price}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-span-2">
                                                <Input
                                                    isRequired
                                                    size="lg"
                                                    labelPlacement="outside"
                                                    label="Max Price"
                                                    variant="bordered"
                                                    type="number"
                                                    name="max_price"
                                                    placeholder="eg., 00.00"
                                                    value={formData.max_price}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-span-4">
                                                <Input
                                                    isRequired
                                                    size="lg"
                                                    labelPlacement="outside"
                                                    label="Location"
                                                    variant="bordered"
                                                    type="text"
                                                    name="location"
                                                    placeholder="eg., Makati City, Philippines"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-span-4">
                                                <Textarea
                                                    isRequired
                                                    label="Property Description"
                                                    labelPlacement="outside"
                                                    size="lg"
                                                    variant="bordered"
                                                    name="description"
                                                    placeholder="Enter property description"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            {/* Image Upload */}
                                            <div className="col-span-4">
                                                <div className="flex items-center space-x-4">
                                                    <label className="bg-gray-200 p-4 rounded-lg cursor-pointer">
                                                        <RiImageAddFill
                                                            size={48}
                                                        />
                                                        <input
                                                            className="hidden"
                                                            type="file"
                                                            name="images"
                                                            id="images"
                                                            multiple
                                                            accept="image/*"
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {images.length > 0 ? (
                                                            images.map((image, index) => (
                                                                <div key={index} className="w-24 h-24 relative group">
                                                                    <img
                                                                        src={image}
                                                                        alt={`Preview ${index + 1}`}
                                                                        className="w-full h-full object-cover rounded-lg"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveImage(index)}
                                                                        className="absolute top-0 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                                                                    >
                                                                        <LuX />
                                                                    </button>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-gray-500">Upload Images</p>
                                                        )}
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Buttons */}
                                    <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                                        <Button
                                            size="lg"
                                            variant="faded"
                                            disabled={loading}
                                            onPress={onClose}
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            isLoading={loading}
                                            type="submit"
                                            size="lg"
                                            variant="solid"
                                            color="primary"
                                        >
                                            Add New Property
                                        </Button>
                                    </div>
                                </form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default AddNewProperty;
