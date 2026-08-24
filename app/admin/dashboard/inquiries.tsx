"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import DeleteConfirmationModal from "@/app/components/modal/deletemodal";
import InquiryDetailModal from "@/app/components/modal/InquiryDetailModal";

import { getAuthHeaders } from "@/app/utility/auth";
import { LuPenLine, LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import DashboardResponsiveTable from "@/app/components/dashboardresponsivetable";

type Category = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  property_name: string;
  property_location: string;
  unit_type: string;
  message: string;
};

const DashboardInquiryTable: React.FC = () => {
  const router = useRouter();

  const fetcherWithAuth = async (url: string) => {
    const headers = getAuthHeaders();
    const res = await fetch(url, { method: "GET", headers });

    if (res.status === 401) {
      router.replace("/auth/login");
      return;
    }
    if (res.status === 429) {
      toast.error("Too many requests. Please try again later.");
      return;
    }
    return await res.json();
  };

  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/inquiries`,
    fetcherWithAuth,
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Category | null>(null);

  useEffect(() => {
    if (data && !error) {
      setCategories(data.records);
      setIsLoading(false);
    }
  }, [data, error]);

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteModalOpen(true);
  };

  const deleteCategory = async (categoryId: string) => {
    const headers = getAuthHeaders();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/inquiries/${categoryId}`,
      {
        method: "DELETE",
        headers,
      },
    );
    if (!res.ok) throw new Error(`Failed to delete inquiry (${res.status})`);
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setDeleteBtnLoading(true);
    try {
      await deleteCategory(categoryToDelete);
      toast.success("Inquiry deleted successfully!");
      setDeleteModalOpen(false);
    } catch (err) {
      console.error("Error deleting inquiry:", err);
      toast.error("Failed to delete inquiry.");
    } finally {
      setDeleteBtnLoading(false);
    }
  };

  const handleRowClick = (category: Category) => {
    setSelectedInquiry(category);
    setDetailModalOpen(true);
  };

  const capitalize = (s: string) =>
    s ? `${s.charAt(0).toUpperCase()}${s.slice(1).toLowerCase()}` : "";

  const columns = [
    {
      key: "name",
      label: "Name and Email",
      renderCell: (category: Category) => (
        <div>
          <p className="font-semibold truncate">
            {capitalize(category.first_name)} {capitalize(category.last_name)}
          </p>
          <span className="text-gray-500 text-xs sm:text-md truncate block">
            {category.email}
          </span>
        </div>
      ),
    },
    {
      key: "property",
      label: "Property",
      renderCell: (category: Category) => category.property_name,
    },
    {
      key: "unit",
      label: "Unit/PS Type",
      renderCell: (category: Category) => category.unit_type,
    },
    {
      key: "phone",
      label: "Phone",
      renderCell: (category: Category) => category.phone || "—",
    },
    {
      key: "actions",
      label: "Actions",
      renderCell: (category: Category) => (
        <div className="flex gap-2">
          <button
            className="text-gray-400 hover:text-violet-700 transition-colors"
            aria-label="Edit inquiry"
          >
            <LuPenLine size={16} />
          </button>
          <button
            className="text-gray-400 hover:text-red-600 transition-colors"
            aria-label="Delete inquiry"
            onClick={() => handleDeleteClick(category.id)}
          >
            <LuTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DashboardResponsiveTable
        filter={false}
        loading={isLoading}
        label="INQUIRIES"
        description="Manage and respond to all inquiries."
        columns={columns}
        data={categories}
        onRowClick={handleRowClick}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteCategory}
        deleteBtnLoading={deleteBtnLoading}
        message="Are you sure you want to delete this inquiry? This action cannot be undone."
      />

      <InquiryDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        inquiry={selectedInquiry}
      />
    </div>
  );
};

export default DashboardInquiryTable;
