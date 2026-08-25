"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import "lightbox2/dist/css/lightbox.min.css";
import { useRouter } from "next/navigation";

import DeleteConfirmationModal from "@/app/components/modal/deletemodal";
import AddNews from "./addmodal";
import UpdateNews from "./updatemodal";

import { getAuthHeaders } from "@/app/utility/auth";

import { LuPenLine, LuPenSquare, LuTrash2 } from "react-icons/lu";
import { AiOutlineDelete } from "react-icons/ai";
import SeeMoreText from "@/app/components/seemoretext";
import DashboardResponsiveTable from "@/app/components/dashboardresponsivetable";
import { Button } from "@heroui/button";
import { Image } from "@heroui/react";

type Category = {
  id: string;
  headline: string;
  url: string;
  content: string;
  date: string;
  image: string; // Image as string since it's a URL
};

const NewsTable: React.FC = () => {
  const router = useRouter();

  // Fetcher with authentication
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

  // Fetch data using SWR
  const { data, error, mutate, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/articles`,
    fetcherWithAuth,
  );

  const [categories, setCategories] = useState<any[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState<Category | null>(
    null,
  );
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);

  // Update categories when data changes
  useEffect(() => {
    if (data && data.records) {
      setCategories(data.records);
    }
  }, [data, error]);

  // Open delete modal
  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteModalOpen(true);
  };

  // Confirm delete category
  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setDeleteBtnLoading(true);
    try {
      await deleteCategory(categoryToDelete);
      toast.success("News deleted successfully!");
      setDeleteModalOpen(false);
      mutate(); // Refetch data after deletion
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error("Error deleting news.");
    } finally {
      setDeleteBtnLoading(false);
    }
  };

  // Delete category API call
  const deleteCategory = async (categoryId: string) => {
    try {
      const headers = getAuthHeaders();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/articles/${categoryId}`,
        {
          method: "DELETE",
          headers: headers,
        },
      );

      if (!res.ok) {
        throw new Error("Failed to delete news");
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      throw error;
    }
  };

  // Open update modal
  const handleUpdateClick = (category: Category) => {
    setCategoryToUpdate(category);
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => setUpdateModalOpen(false);

  // Initialize lightbox on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      require("lightbox2");
    }
  }, []);

  const columns = [
    {
      key: "headline",
      label: "Headline",
      renderCell: (category: Category) => (
        <div className="min-w-0 md:min-w-[300px]">{category.headline}</div>
      ),
    },

    {
      key: "content",
      label: "Content",
      renderCell: (category: Category) => (
        <div className="w-full md:w-[300px] lg:w-[500px]">
          <SeeMoreText text={category.content || "No message"} />
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      renderCell: (category: Category) => (
        <div className="min-w-[120px]">
          {new Date(category.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      key: "image",
      label: "Image",
      renderCell: (category: Category) => (
        <a
          data-lightbox="gallery"
          data-title={category.headline}
          href={`https://infinitech-api27.site/articles/${category.image}`}
        >
          <Image
            alt={category.headline}
            src={`https://infinitech-api27.site/articles/${category.image}`}
            className="object-cover"
            height={80}
            width={120}
          />
        </a>
      ),
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
          />

          <Button
            isIconOnly
            startContent={<LuTrash2 size={18} />}
            variant="flat"
            color="danger"
            onPress={() => handleDeleteClick(category.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-end mb-4">
        <div className="flex gap-2 mt-4 justify-end">
          <AddNews mutate={mutate} />
        </div>
      </div>

      <DashboardResponsiveTable
        filter={true}
        label="NEWS & UPDATES"
        description="Manage and publish news articles and blog posts."
        columns={columns}
        data={categories}
        loading={isLoading}
        searchKeys={["headline", "content"]}
      />

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteCategory}
        deleteBtnLoading={deleteBtnLoading}
        message="Are you sure you want to delete this news?"
      />

      {/* Update Modal */}
      {updateModalOpen && categoryToUpdate && (
        <UpdateNews
          initialData={categoryToUpdate}
          onClose={closeUpdateModal}
          isOpen={updateModalOpen}
          mutate={mutate}
        />
      )}
    </>
  );
};

export default NewsTable;