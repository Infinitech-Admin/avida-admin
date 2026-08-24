"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { LuPenSquare, LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import { FaRegStar, FaStar } from "react-icons/fa";
import { Button } from "@heroui/button";
import { Chip, Spinner, Tooltip } from "@heroui/react";
import DeleteConfirmationModal from "@/app/components/modal/deletemodal";
import DashboardResponsiveTable from "@/app/components/dashboardresponsivetable";
import { getAuthHeaders } from "@/app/utility/auth";
import { priceFormatted } from "@/app/utility/format";
import { SlPlus } from "react-icons/sl";
import Link from "next/link";

type Property = {
  id: string;
  property_name: string;
  property_location: string;
  property_type: string;
  property_size: string;
  property_price: number;
  property_building: string;
  status: string;
  property_featured: number;
  property_level: string;
  property: {
    name: string;
    buildings: {
      name: string;
    };
  } | null;
};

const fetcher = async (url: string) => {
  const headers = getAuthHeaders();
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

const PropertiesTable: React.FC = () => {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);
  const [deletedName, setDeletedName] = useState("");
  const [updatingFeatured, setUpdatingFeatured] = useState<string | null>(null);

  const user_id =
    typeof window !== "undefined" ? sessionStorage.getItem("user_id") : null;
  const accessToken =
    typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  // Fetch user type
  const { data: userData, error: userError } = useSWR(
    user_id ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user_id}` : null,
    fetcher,
  );

  // Fetch properties
  const {
    data: propertiesData,
    error: propertiesError,
    isLoading,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/property`, fetcher);

  useEffect(() => {
    if (userError || (userData && userData.message === "Invalid Token")) {
      router.push("/auth/login");
    }
  }, [userError, userData, router]);

  const properties: Property[] = propertiesData?.records || [];

  const handleDeleteClick = (propertyId: string, propertyName: string) => {
    setPropertyToDelete(propertyId);
    setDeletedName(propertyName);
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/property/${propertyID}`,
      {
        method: "DELETE",
        headers: headers,
      },
    );
    if (response.ok) {
      mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/property`);
    } else {
      throw new Error("Failed to delete property");
    }
  };

  const handleFeaturedProperty = async (propertyId: string) => {
    setUpdatingFeatured(propertyId); // Start loading for this property
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/property/set/${propertyId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        toast.success("Featured updated successfully!");
        mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/property`);
      } else {
        throw new Error("Failed to update property");
      }
    } catch (error) {
      toast.error("Error updating property.");
    } finally {
      setUpdatingFeatured(null); // Stop loading after completion
    }
  };

  type ChipColor = "primary" | "warning" | "success" | "default";

  const Status: Record<string, ChipColor> = {
    Studio: "success",
    "1 Bedroom": "primary",
    "2 Bedroom": "primary",
    "3 Bedroom": "primary",
    "Tandem Unit": "primary",
    "Studio w/ Parking": "warning",
    "1 Bedroom w/ Parking": "warning",
    "2 Bedroom w/ Parking": "warning",
    "3 Bedroom w/ Parking": "warning",
    "Tandem Unit w/ Parking": "warning",
    "Studio w/ Tandem Parking": "warning",
    "1 Bedroom w/ Tandem Parking": "warning",
    "2 Bedroom w/ Tandem Parking": "warning",
    "3 Bedroom w/ Tandem Parking": "warning",
    "Tandem Unit w/ Tandem Parking": "warning",
    "1 Parking Slot": "default",
    "Tandem Parking": "default",
    "Ready For Occupancy": "success",
    "Pre-Selling": "warning",
    "Under Construction": "warning",
    New: "primary",
  };

  const columns = [
    {
      key: "name",
      label: "Property",
      renderCell: (prop: Property) => {
        // Guard against listings whose `property` relation failed to
        // resolve (e.g. an orphaned property_id). Without this, a single
        // broken row crashes the entire admin table.
        const hasValidProperty = Boolean(prop.property?.name);

        return (
          <div>
            <h1 className="font-medium">
              {hasValidProperty ? (
                prop.property!.name
              ) : (
                <span className="text-danger flex items-center gap-1">
                  ⚠ Missing Property Link
                </span>
              )}
            </h1>
            <p className="text-sm text-default-500">{prop.property_location}</p>
          </div>
        );
      },
    },
    {
      key: "building",
      label: "Building",
      renderCell: (prop: Property) => `${prop.property_building}`,
    },
    {
      key: "area",
      label: "Area",
      renderCell: (prop: Property) => `${prop.property_size} sqm`,
    },
    {
      key: "level",
      label: "Floor Level",
      renderCell: (prop: Property) => `${prop.property_level}`,
    },
    {
      key: "min_price",
      label: "Price",
      renderCell: (prop: Property) => `${priceFormatted(prop.property_price)}`,
    },
    {
      key: "unit_type",
      label: "Unit/PS Type",
      renderCell: (prop: Property) => {
        const displayPrice = prop.property_type;
        const chipColor = Status[displayPrice] || "default";
        return (
          <Chip size="sm" className="uppercase" color={chipColor} variant="dot">
            {displayPrice}
          </Chip>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      renderCell: (property: Property) => (
        <div className="flex gap-2">
          <Tooltip content="Edit">
            <Button
              isIconOnly
              startContent={<LuPenSquare size={18} />}
              onPress={() =>
                router.push(`/admin/properties/edit-properties/${property.id}`)
              }
              color="success"
              variant="flat"
            />
          </Tooltip>

          {property.property_featured === 0 ? (
            <Tooltip content="Set Featured">
              <Button
                isIconOnly
                startContent={
                  updatingFeatured === property.id ? (
                    <Spinner />
                  ) : (
                    <FaRegStar size={18} />
                  )
                }
                onPress={() => handleFeaturedProperty(property.id)}
                color="default"
                variant="flat"
              />
            </Tooltip>
          ) : (
            <Tooltip content="Remove Featured">
              <Button
                isIconOnly
                startContent={
                  updatingFeatured === property.id ? (
                    <Spinner />
                  ) : (
                    <FaStar size={18} />
                  )
                }
                onPress={() => handleFeaturedProperty(property.id)}
                color="warning"
                variant="flat"
              />
            </Tooltip>
          )}

          <Tooltip content="Delete">
            <Button
              variant="flat"
              startContent={<LuTrash2 size={18} />}
              isIconOnly
              onPress={() =>
                handleDeleteClick(property.id, property.property_name)
              }
              color="danger"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const statusOptions = [
    { key: "all", label: "ALL" },
    { key: "Studio", label: "Studio" },
    { key: "1 Bedroom", label: "1 Bedroom" },
    { key: "2 Bedroom", label: "2 Bedroom" },
    { key: "3 Bedroom", label: "3 Bedroom" },
    { key: "Tandem Unit", label: "Tandem Unit" },
    { key: "Studio w/ Parking", label: "Studio w/ Parking" },
    { key: "1 Bedroom w/ Parking", label: "1 Bedroom w/ Parking" },
    { key: "2 Bedroom w/ Parking", label: "2 Bedroom w/ Parking" },
    { key: "3 Bedroom w/ Parking", label: "3 Bedroom w/ Parking" },
    { key: "Tandem Unit w/ Parking", label: "Tandem Unit w/ Parking" },
    { key: "Studio w/ Tandem Parking", label: "Studio w/ Tandem Parking" },
    {
      key: "1 Bedroom w/ Tandem Parking",
      label: "1 Bedroom w/ Tandem Parking",
    },
    {
      key: "2 Bedroom w/ Tandem Parking",
      label: "2 Bedroom w/ Tandem Parking",
    },
    {
      key: "3 Bedroom w/ Tandem Parking",
      label: "3 Bedroom w/ Tandem Parking",
    },
    {
      key: "Tandem Unit w/ Tandem Parking",
      label: "Tandem Unit w/ Tandem Parking",
    },
    { key: "1 Parking Slot", label: "1 Parking Slot" },
    { key: "Tandem Parking", label: "Tandem Parking" },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-end gap-4 mb-4">
        <div className="flex gap-2 mt-4 justify-end">
          <Button
            size="lg"
            as={Link}
            href="/admin/properties/add-properties"
            color="primary"
            startContent={<SlPlus size={18} />}
          >
            Add New Property
          </Button>
        </div>
      </div>

      <DashboardResponsiveTable
        filter={true}
        label="PROPERTIES"
        description="Manage and view all listed properties."
        columns={columns}
        data={properties}
        statusOptions={statusOptions}
        loading={isLoading}
        searchKeys={[
          "property.name",
          "property_location",
          "property_type",
          "property_building",
        ]}
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

export default PropertiesTable;
