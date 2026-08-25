"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";

import DataTable from "@/app/components/datatable";
import DeleteConfirmationModal from "@/app/components/modal/deletemodal";
import AddNews from "./addmodal";
import UpdateNews from "./updatemodal";

import { getAuthHeaders } from "@/app/utility/auth";

import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";

import { GoSearch } from "react-icons/go";
import { RiArrowDownLine } from "react-icons/ri";
import { LuPenLine, LuPenSquare, LuTrash2 } from "react-icons/lu";
import { AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import TableData from "@/app/components/tabledata";
import { Button } from "@heroui/button";
import { Image } from "@heroui/react";

type Category = {
  id: string;
  user_id: string;
  name: string;
  image: File;
};

const VideoTable: React.FC = () => {
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/contracts`,
    fetcherWithAuth,
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState<Category | null>(
    null,
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
      toast.success("Contract deleted successfully!");
      setDeleteModalOpen(false);
      setDeleteBtnLoading(false);
    } catch (error) {
      console.error("Error deleting contract:", error);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const headers = getAuthHeaders();
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contracts/${categoryId}`,
        {
          method: "DELETE",
          headers: headers,
        },
      );
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId),
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

  const closeUpdateModal = () => setUpdateModalOpen(false);

  // Function to handle the category update
  const filteredCategories = categories.filter(
    (category) =>
      category.name &&
      category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredCategories?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const columns = [
    // { label: 'ID', accessor: (category: Category) => category.id },
    {
      key: "name",
      label: "Contract Name",
      renderCell: (category: Category) => category.name,
    },
    {
      key: "image",
      label: "Image",
      renderCell: (category: Category) => (
        <>
          <div className="flex items-center space-x-2">
            <Gallery withDownloadButton>
              <Item
                original={`https://infinitech-api27.site/contracts/${category.image}`}
                height="800"
                width="500"
              >
                {({ ref, open }) => (
                  <Image
                    ref={ref}
                    onClick={open}
                    src={`https://infinitech-api27.site/contracts/${category.image}`}
                    alt="Product Image"
                    className="object-cover cursor-pointer"
                    height={90}
                    width={120}
                  />
                )}
              </Item>
            </Gallery>
          </div>
        </>
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
        <AddNews mutate={mutate} />
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
          label="CONTRACTS"
          description="Manage and review all contracts."
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
        message="Are you sure you want to delete this image?"
      />

      {updateModalOpen && (
        <UpdateNews
          initialData={categoryToUpdate!}
          onClose={closeUpdateModal}
          mutate={mutate}
        />
      )}
    </div>
  );
};

export default VideoTable;
