"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "@/app/components/modal/deletemodal";
import AddQuestion from "./addmodal";
import UpdateQuestion from "./updatemodal";
import { getAuthHeaders } from "@/app/utility/auth";
import { LuPenSquare, LuTrash2 } from "react-icons/lu";
import { useRouter } from "next/navigation";
import TableData from "@/app/components/tabledata";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/react";

type Category = {
  id: string;
  user_id: string;
  name: string;
  message: string;
  status: string;
};

const QuestionTable: React.FC = () => {
  const router = useRouter();

  const fetcherWithAuth = async (url: string) => {
    const headers = getAuthHeaders();

    const res = await fetch(url, {
      method: "GET",
      headers: headers,
    });

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
  const { data, error, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`,
    fetcherWithAuth
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState<Category | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);

  useEffect(() => {
    if (data && !error) {
      setCategories(data.records);
      setIsLoading(false);
    }
  }, [data, error]);

  // Open delete modal and store the category ID
  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setDeleteBtnLoading(true);
    try {
      await deleteCategory(categoryToDelete);
      toast.success("Testimonial deleted successfully!");
      setDeleteModalOpen(false);
      setDeleteBtnLoading(false);
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };
  const deleteCategory = async (categoryId: string) => {
    try {
      const headers = getAuthHeaders();
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${categoryId}`,
        {
          method: "DELETE",
          headers: headers,
        }
      );
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Function to open update modal
  const handleUpdateClick = (category: Category) => {
    setCategoryToUpdate(category);
    setUpdateModalOpen(true);
  };

  // Update modal handling
  const closeUpdateModal = () => setUpdateModalOpen(false);

  const updateCategory = async (updatedCategory: Category) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/questions/${updatedCategory.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCategory),
        }
      );
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        )
      );
      toast.success("Category updated successfully!");
      setUpdateModalOpen(false);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const Status: Record<string, "primary" | "danger" | "success" | "default"> = {
    active: "success",
    "in-active": "danger",
  };

  const columns = [
    // { label: 'ID', accessor: (category: Category) => category.id },
    {
      key: "name",
      label: "Name",
      renderCell: (category: Category) => category.name,
    },
    {
      key: "message",
      label: "Message",
      renderCell: (category: Category) => (
        <div className="line-clamp-2">{category.message}</div>
      ),
    },
    {
      key: "status",
      label: "Status",
      renderCell: (category: Category) => {
        const displaystatus = category.status;
        const chipColor = Status[displaystatus] || "default";
        return (
          <Chip size="sm" className="uppercase" color={chipColor} variant="dot">
            {displaystatus}
          </Chip>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      renderCell: (category: Category) => (
        <div className="flex gap-2">
          <Button
            isIconOnly
            startContent={<LuPenSquare size={18} />}
            variant="flat"
            color="primary"
            onPress={() => handleUpdateClick(category)}
          ></Button>
          <Button
            isIconOnly
            startContent={<LuTrash2 size={18} />}
            variant="flat"
            color="danger"
            onPress={() => handleDeleteClick(category.id)}
          ></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <AddQuestion mutate={mutate} />
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(itemsPerPage)].map((_, index) => (
            <div key={index} className="h-10 bg-gray-300 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <TableData
          filter={true}
          label="TESTIMONIALS"
          description="Manage and review all customer testimonials."
          columns={columns}
          data={categories}
          hasStatusFilter={false}
          // statusOptions={statusOptions}
        />
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteCategory}
        deleteBtnLoading={deleteBtnLoading}
        message="Are you sure you want to delete this Testimonial?"
      />
      {updateModalOpen && (
        <UpdateQuestion
          initialData={categoryToUpdate!}
          onClose={closeUpdateModal}
          mutate={mutate}
        />
      )}
    </div>
  );
};

export default QuestionTable;
