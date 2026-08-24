import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { LuPlus } from 'react-icons/lu';
import toast from 'react-hot-toast';
import BtnLoadingSpinner from '@/app/components/spinner';
import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Select,
    SelectItem,
    Textarea,
    useDisclosure,
} from '@heroui/react';
import { getAuthHeaders } from '@/app/utility/auth';
import { useRouter } from 'next/navigation';

interface ListingsData {
    name: string;
    email: string;
    phone: string;
    unit_type: string;
    unit_price: string;
    description: string;
    furnish_status: string;
    property_id: string;
    item: string[];
    images?: File[] | null;
    status: string;
    unit_area: string;
    unit_cut: string;
    building_id: string;

}

interface Building {
    id: string;
    name: string;
}

interface Property {
    id: string;
    name: string;
    buildings: Building[];
}

interface ListingsModalProps {
    mutate?: () => void;
}

const ListingsModal: React.FC<ListingsModalProps> = ({ mutate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const router = useRouter();
    const [properties, setProperties] = useState<Property[]>([]);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [values, setValues] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

    // ✅ Updated formData to include items
    const [formData, setFormData] = useState<ListingsData>({
        name: '',
        email: '',
        phone: '',
        unit_type: '',
        unit_price: '',
        description: '',
        furnish_status: '',
        property_id: '',
        item: [],
        images: [],
        status: '',
        unit_area: '',
        unit_cut: '',
        building_id: '',
    });

    // ✅ Handle item addition/removal on Enter key
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
            const inputValue = e.currentTarget.value.trim();

            if (values.includes(inputValue)) {
                setValues(values.filter((value) => value !== inputValue));
            } else {
                setValues([...values, inputValue]);
            }

            handleClear();
        }
    };

    const handleValueChange = (value: string) => {
        setInputValue(value);
    };

    const handleClear = () => {
        setInputValue("");
    };



    const fetchProperties = async () => {
        const headers = getAuthHeaders();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`, {
                method: 'GET',
                headers,
            });

            if (response.status === 401) {
                router.replace('/auth/login');
                return;
            }

            if (response.status === 429) {
                toast.error('Too many requests. Please try again later.');
                return;
            }

            const data = await response.json();
            if (data.records) {
                setProperties(data.records);
            }
        } catch (error) {
            toast.error('Error fetching properties.');
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);





    // ✅ Handle input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === 'file') {
            const files = (e.target as HTMLInputElement).files;
            if (files) {
                setFormData((prev) => ({
                    ...prev,
                    images: Array.from(files),
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // ✅ Handle property selection
    const handlePropertySelect = async (key: string) => {
        setFormData((prev) => ({
            ...prev,
            property_id: key,
        }));

        // Fetch buildings for selected property
        const selectedProperty = properties.find((property) => property.id === key);
        if (selectedProperty && selectedProperty.buildings) {
            setBuildings(selectedProperty.buildings);
        } else {
            setBuildings([]);
        }
    };


    // ✅ Handle form submission
    const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = sessionStorage.getItem('token') || null;
            const userId = sessionStorage.getItem('user_id') || null;

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            };

            const data = new FormData();

            // ✅ Add formData fields to FormData
            Object.keys(formData).forEach((key) => {
                const value = (formData as any)[key];
                if (key === 'images' && Array.isArray(value)) {
                    value.forEach((file) => data.append('images[]', file)); // ✅ Multiple images
                } else if (key === 'item') {
                    data.append('item', JSON.stringify(values)); // ✅ Send items as JSON
                } else {
                    data.append(key, value);
                }
            });

            if (userId) data.append('user_id', userId);

            // ✅ Send form data to the API
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/listings`,
                data,
                { headers }
            );

            if (response?.data) {
                toast.success('Listings Successfully Added!');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    unit_type: '',
                    unit_price: '',
                    description: '',
                    furnish_status: '',
                    property_id: '',
                    item: [],
                    images: [],
                    status: '',
                    unit_area: '',
                    unit_cut: '',
                    building_id: '',
                });
                setValues([]);
                if (mutate) mutate();
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Button
                startContent={<LuPlus />}
                size="lg"
                variant="solid"
                color="primary"
                onPress={onOpen}
            >
                Add Listings
            </Button>

            <Modal size="5xl" isOpen={isOpen} scrollBehavior="outside" onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <div className="px-4 py-6">
                            <ModalHeader>
                                <h3 className="text-lg font-bold mb-4 uppercase">
                                    Add Property Listings
                                </h3>
                            </ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleAddSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Owner Name */}
                                        <div className="col-span-2">
                                            <Input
                                                isRequired
                                                size="lg"
                                                type="text"
                                                name="name"
                                                label="Owner Name"
                                                labelPlacement="outside"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="e.g., Juan Dela Cruz"
                                            />
                                        </div>

                                        {/* Email and Phone */}
                                        <div>
                                            <Input
                                                isRequired
                                                size="lg"
                                                type="email"
                                                name="email"
                                                label="Email"
                                                labelPlacement="outside"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="e.g., juandelacruz@gmail.com"
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                isRequired
                                                size="lg"
                                                type="text"
                                                name="phone"
                                                label="Phone Number"
                                                labelPlacement="outside"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="e.g., 09924401037"
                                            />
                                        </div>

                                        <Divider className="col-span-2 my-4" />

                                        {/* Property Details */}


                                        <div>
                                            <Autocomplete
                                                isRequired
                                                size="lg"
                                                label="Property"
                                                labelPlacement="outside"
                                                placeholder="Select Property"
                                                selectedKey={formData.property_id}
                                                onSelectionChange={(key) =>
                                                    handlePropertySelect(key as string)
                                                }
                                            >
                                                {properties.map((item) => (
                                                    <AutocompleteItem key={item.id}>
                                                        {item.name}
                                                    </AutocompleteItem>
                                                ))}
                                            </Autocomplete>
                                        </div>

                                        <div>
                                            <Select
                                                isRequired
                                                size="lg"
                                                label="Unit Buildings"
                                                labelPlacement="outside"
                                                placeholder="Select Building"
                                                name="building_id"
                                                value={formData.building_id}
                                                onChange={handleChange}
                                            >
                                                {buildings.map((building) => (
                                                    <SelectItem key={building.id}>
                                                        {building.name}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                        
                                        {/* Unit Type and Furnish Status */}
                                        <div>
                                            <Select
                                                isRequired
                                                size="lg"
                                                label="Unit/PS Type"
                                                labelPlacement="outside"
                                                placeholder='Select type'
                                                name="unit_type"
                                                value={formData.unit_type}
                                                onChange={handleChange}
                                            >
                                                <SelectItem key="1BR">1 Bedroom</SelectItem>
                                                <SelectItem key="2BR">2 Bedroom</SelectItem>
                                                <SelectItem key="Loft">Loft</SelectItem>
                                                <SelectItem key="Studio">Studio</SelectItem>
                                            </Select>
                                        </div>

                                        <div>
                                            <Select
                                                isRequired
                                                size="lg"
                                                label="Status"
                                                labelPlacement="outside"
                                                name="status"
                                                placeholder='Unit Status'
                                                value={formData.status}
                                                onChange={handleChange}
                                            >
                                                <SelectItem key="Pre-Selling">Pre-Selling</SelectItem>
                                                <SelectItem key="RFO">Ready For Occupancy</SelectItem>
                                            </Select>
                                        </div>

                                        <div>
                                            <Select
                                                isRequired
                                                size="lg"
                                                label="Furnish Status"
                                                labelPlacement="outside"
                                                name="furnish_status"
                                                placeholder='Furnish Status'
                                                value={formData.furnish_status}
                                                onChange={handleChange}
                                            >
                                                <SelectItem key="Fully Furnished">Fully Furnished</SelectItem>
                                                <SelectItem key="Semi Furnished">Semi Furnished</SelectItem>
                                            </Select>
                                        </div>

                                        {/* Location and Price */}

                                        <div>
                                            <Input
                                                isRequired
                                                size="lg"
                                                type="text"
                                                name="unit_price"
                                                label="Unit Price"
                                                labelPlacement="outside"
                                                value={formData.unit_price}
                                                onChange={handleChange}
                                                placeholder="e.g., 1000000"
                                            />
                                        </div>

                                        <div>
                                            <Input
                                                isRequired
                                                size="lg"
                                                type="text"
                                                name="unit_area"
                                                label="Unit Area"
                                                labelPlacement="outside"
                                                value={formData.unit_area}
                                                onChange={handleChange}
                                                placeholder="e.g., sqm"
                                            />
                                        </div>

                                        <div>
                                            <Select
                                                isRequired
                                                size="lg"
                                                label="Unit Cut"
                                                labelPlacement="outside"
                                                name="unit_cut"
                                                placeholder='Select Unit Cut'
                                                value={formData.unit_cut}
                                                onChange={handleChange}
                                            >
                                                <SelectItem key="Korean Cut">Korean Cut</SelectItem>
                                                <SelectItem key="European Cut">European Cut</SelectItem>
                                            </Select>
                                        </div>

                                        {/* Item Input */}
                                        <div className="col-span-2">
                                            <Input
                                                size="lg"
                                                type="text"
                                                name="item"
                                                label="Item (Optional)"
                                                labelPlacement='outside'
                                                placeholder="Add or remove items (press Enter)"
                                                onKeyDown={handleKeyDown}
                                                className="w-full"
                                                value={inputValue}
                                                onValueChange={handleValueChange}
                                            />
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {values.map((value, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-gray-200 px-2 py-1 rounded-lg text-sm cursor-pointer"
                                                    >
                                                        {value}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <Textarea
                                                isRequired
                                                size="lg"
                                                label="Description"
                                                labelPlacement="outside"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                placeholder="Provide a brief description of the property..."
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <Input
                                                isRequired
                                                size="lg"
                                                type="file"
                                                name="images"
                                                multiple
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end items-center gap-x-2 mt-4 px-4">
                                        <Button color="danger" variant="light" onPress={onclose}>
                                            Close
                                        </Button>
                                        <Button type="submit" variant="solid" color="primary">
                                            {isLoading ? <BtnLoadingSpinner /> : 'Add Listings'}
                                        </Button>
                                    </div>
                                </form>
                            </ModalBody>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default ListingsModal;
