"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { LuPenSquare, LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import { Button } from "@heroui/button";
import { Chip, Spinner, Tooltip } from "@heroui/react";
import DeleteConfirmationModal from "@/app/components/modal/deletemodal";
import TableData from "@/app/components/tabledata";
import { getAuthHeaders } from "@/app/utility/auth";
import AddNewProperty from "./addproperty";

const fetcher = async (url: string) => {
    const headers = getAuthHeaders();
    const res = await fetch(url, { headers });
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
};

const AlbumTable: React.FC = () => {
    const router = useRouter();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
    const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);
    const user_id =
        typeof window !== "undefined" ? sessionStorage.getItem("user_id") : null;
    const accessToken =
        typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

    // Fetch user type
    const { data: userData, error: userError } = useSWR(
        user_id
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user_id}`
            : null,
        fetcher
    );

    // Fetch properties
    const {
        data: propertiesData,
        error: propertiesError,
        isLoading,
    } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`, fetcher);

    useEffect(() => {
        if (userError || (userData && userData.message === "Invalid Token")) {
            router.push("/auth/login");
        }
    }, [userError, userData, router]);

    const properties = propertiesData?.records || [];

    const handleDeleteClick = (propertyId: string, propertyName: string) => {
        setPropertyToDelete(propertyId);
        setDeleteModalOpen(true);
    };

    const confirmDeleteProperty = async () => {
        if (!propertyToDelete) return;
        setDeleteBtnLoading(true);
        try {
            await deleteProperty(propertyToDelete);
            toast.success(`Property has been deleted successfully!`);
            setDeleteModalOpen(false);
        } catch (error) {
            toast.error("Error deleting property.");
        } finally {
            setDeleteBtnLoading(false);
        }
    };

    const deleteProperty = async (propertyID: string) => {
        const headers = getAuthHeaders();
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/properties/${propertyID}`,
            {
                method: "DELETE",
                headers: headers,
            }
        );
        if (response.ok) {
            mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`);
        } else {
            throw new Error("Failed to delete property");
        }
    };

    const Status: Record<string, "primary" | "warning" | "success" | "default"> = {
        "Ready For Occupancy": "success",
        "Pre-Selling": "warning",
        "New": "primary",
        "Under Construction": "warning",
        "1BR": "primary",
        "2BR": "warning",
        "Studio Type": "success",
        Loft: "default",
    };

    const columns = [
        {
            key: "name",
            label: "Property",
            renderCell: (prop: any) => {
                return (
                    <div>
                        <h1 className="font-medium">{prop.name}</h1>
                        <p className="text-sm text-default-500">{prop.location}</p>
                    </div>
                );
            },
        },
        {
            key: "percent",
            label: "Site Progress",
            renderCell: (prop: {percent:number}) => <span>{prop.percent}%</span>,
        },
        {
            key: "status",
            label: "Status",
            renderCell: (prop: any) => {
                const chipColor = Status[prop.status] || "default";
                return (
                    <Chip size="sm" className="uppercase" color={chipColor} variant="dot">
                        {prop.status}
                    </Chip>
                );
            },
        },
        {
            key: "actions",
            label: "Actions",
            renderCell: (property: any) => (
                <div className="flex gap-2">
                    <Tooltip content="Edit">
                        <Button
                            isIconOnly
                            startContent={<LuPenSquare size={18} />}
                            onPress={() =>
                                router.push(`/admin/property/viewproperty?id=${property.id}`)
                            }
                            color="success"
                            variant="flat"
                        />
                    </Tooltip>

                    <Tooltip content="Delete">
                        <Button
                            variant="flat"
                            startContent={<LuTrash2 size={18} />}
                            isIconOnly
                            onPress={() => handleDeleteClick(property.id, property.name)}
                            color="danger"
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    const statusOptions = [
        { key: "all", label: "All" },
        { key: "rfo", label: "RFO" },
        { key: "pre-selling", label: "Pre-Selling" },
        { key: "new", label: "New" },
    ];

    return (
        <div className="p-4">
            <div className="flex flex-wrap justify-end gap-4 mb-4">
                <div className="flex gap-2 mt-4 justify-end">
                    <AddNewProperty />
                </div>
            </div>

            <TableData
                filter={true}
                label="PROPERTIES"
                description="Manage and view all listed properties."
                columns={columns}
                data={properties}
                statusOptions={statusOptions}
                loading={isLoading}
            />

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDeleteProperty}
                deleteBtnLoading={deleteBtnLoading}
                message="Are you sure you want to delete this property?"
            />
        </div>
    );
};

export default AlbumTable;
