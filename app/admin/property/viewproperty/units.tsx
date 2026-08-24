import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import BtnLoadingSpinner from '@/app/components/spinner';
import FormikCustomErrorMsg from '@/app/components/formik-custom-error-msg';
import TableData from '@/app/components/tabledata';
import { LuTrash2 } from 'react-icons/lu';
import { Input, Select, SelectItem, Button } from '@heroui/react';

interface PropertyDetailsContentProps {
    id: string | null;
}

interface Unit {
    id: string;
    type: string;
    area: string;
    price: string;
    status: string;
}

const PropertyUnits: React.FC<PropertyDetailsContentProps> = ({ id }) => {
    const [unitData, setUnitData] = useState<Unit[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isDeleting, setDeleting] = useState<boolean>(false);
    const [unitToDelete, setUnitToDelete] = useState<string | null>(null);

    const fetchUnitData = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`, { headers });
            setUnitData(response.data.record.units || []);
        } catch (err) {
            toast.error('Failed to load unit data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUnit = async (values: Unit, { resetForm }: any) => {
        if (!id) return toast.error('Property ID is required to add a unit.');
    
        try {
            const token = sessionStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/units`, { ...values, property_id: id }, { headers });
            toast.success(`${values.type} added successfully!`);
            fetchUnitData();
            resetForm({ values: formik.initialValues });
        } catch (error) {
            toast.error('Something went wrong while adding the unit.');
        }
    };
    

    const handleDeleteUnit = async () => {
        if (!unitToDelete) return;
        setDeleting(true);
        try {
            const token = sessionStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/units/${unitToDelete}`, { headers });
            toast.success('Unit deleted successfully!');
            fetchUnitData();
        } catch (err) {
            toast.error('Failed to delete unit.');
        } finally {
            setDeleting(false);
            setUnitToDelete(null);
        }
    };

    const formik = useFormik({
        initialValues: {
            id: '',
            type: '',
            area: '',
            price: '',
            status: '',
        },
        validationSchema: Yup.object({
            type: Yup.string().required('Unit type is required'),
            area: Yup.number().required('Unit area is required').positive(),
            price: Yup.string().required('Price is required'),
            status: Yup.string().required('Status is required'),
        }),
        onSubmit: handleAddUnit,
    });

    useEffect(() => {
        if (id) fetchUnitData();
    }, [id]);

    const columns = [
        { key: 'type', label: 'Unit' },
        { key: 'area', label: 'Area', renderCell: (row: Unit) => <span>{row.area} sqm</span> },
        { key: 'price', label: 'Price' },
        { key: 'status', label: 'Status' },
        {
            key: 'actions',
            label: 'Actions',
            renderCell: (row: Unit) => (
                <Button
                    isIconOnly
                    startContent={<LuTrash2 />}
                    variant="flat"
                    color="danger"
                    onPress={() => setUnitToDelete(row.id)}
                />
            ),
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <form onSubmit={formik.handleSubmit}>
                <div className="flex flex-col gap-3">
                    <Select
                        label="Select Unit/PS Type"
                        variant="bordered"
                        name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <SelectItem key="1 Bedroom">1 Bedroom</SelectItem>
                        <SelectItem key="2 Bedroom">2 Bedroom</SelectItem>
                        <SelectItem key="3 Bedroom">3 Bedroom</SelectItem>
                        <SelectItem key="Loft">Loft</SelectItem>
                        <SelectItem key="Studio">Studio</SelectItem>
                    </Select>
                    {formik.touched.type && formik.errors.type && <FormikCustomErrorMsg>{formik.errors.type}</FormikCustomErrorMsg>}

                    <Input
                        label="Unit Area"
                        variant="bordered"
                        name="area"
                        placeholder="e.g., 45"
                        value={formik.values.area}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.area && formik.errors.area && <FormikCustomErrorMsg>{formik.errors.area}</FormikCustomErrorMsg>}

                    <Input
                        label="Unit Price"
                        variant="bordered"
                        name="price"
                        placeholder="e.g., 1000000"
                        value={formik.values.price.toString()} // Convert to string here
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />

                    {formik.touched.price && formik.errors.price && <FormikCustomErrorMsg>{formik.errors.price}</FormikCustomErrorMsg>}

                    <Select
                        label="Unit Status"
                        variant="bordered"
                        name="status"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <SelectItem key="Available">Available</SelectItem>
                        <SelectItem key="Not Available">Not Available</SelectItem>
                    </Select>
                    {formik.touched.status && formik.errors.status && (
                        <FormikCustomErrorMsg>{formik.errors.status}</FormikCustomErrorMsg>
                    )}

                    <Button type="submit" size="lg" className="w-full" color="primary" disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? <BtnLoadingSpinner /> : 'Add Unit'}
                    </Button>
                </div>
            </form>

            <div className="col-span-2">
                <TableData
                    filter={false}
                    label="Units"
                    description="Manage and view all listed units."
                    columns={columns}
                    data={unitData}
                    loading={isLoading}
                />
            </div>

            {unitToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-medium mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to delete this unit?</p>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                variant="flat"
                                onPress={() => setUnitToDelete(null)}
                                className="bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </Button>
                            <Button
                                color="danger"
                                onPress={handleDeleteUnit}
                                disabled={isDeleting}
                            >
                                {isDeleting ? <BtnLoadingSpinner /> : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyUnits;
