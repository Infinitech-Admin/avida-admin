"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import Link from "next/link";
import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";

import DataTable from "@/app/components/datatable";
import DeleteConfirmationModal from "@/app/components/modal/deletemodal";
import AddNews from "./addmodal";
import UpdateNews from "./updatemodal";

import { getAuthHeaders } from "@/app/utility/auth";

import { GoSearch } from "react-icons/go";
import { RiArrowDownLine } from "react-icons/ri";
import { LuPenLine, LuPenSquare, LuTrash2 } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { FaFileAlt, FaFilePdf } from "react-icons/fa";
import TableData from "@/app/components/tabledata";
import { Button } from "@heroui/button";

type Category = {
  id: string;
  position: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  resume: string;
};

const CareerTable: React.FC = () => {
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/applications`,
    fetcherWithAuth,
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState<Category | null>(
    null,
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data && !error) {
      setCategories(data.records);
      setIsLoading(false);
    }
  }, [data, error]);

  const closeUpdateModal = () => setUpdateModalOpen(false);

  const handleUpdateClick = (category: Category) => {
    setCategoryToUpdate(category);
    setUpdateModalOpen(true);
  };

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setDeleteBtnLoading(true);
    try {
      await deleteCategory(categoryToDelete);
      toast.success("Application deleted successfully!");
      setDeleteBtnLoading(false);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const headers = getAuthHeaders();
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applications/${categoryId}`,
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

  const fileIcons = {
    pdf: <FaFilePdf className="w-16 h-16 text-red-500 cursor-pointer" />,
    default: <FaFileAlt className="w-16 h-16 text-gray-500 cursor-pointer" />,
  };

  const statusOptions = [
    { key: "all", label: "ALL" },
    { key: "referrer", label: "Referrer" },
    { key: "sub-agent", label: "Sub-agent" },
    { key: "broker", label: "Broker" },
    { key: "partner", label: "Partner" },
  ];

  const columns = [
    {
      key: "name",
      label: "Name",
      renderCell: (category: Category) => category.name,
    },
    {
      key: "position",
      label: "Position",
      renderCell: (category: Category) => category.position,
    },
    {
      key: "email",
      label: "Email",
      renderCell: (category: Category) => category.email,
    },
    {
      key: "phone",
      label: "Phone",
      renderCell: (category: Category) => category.phone,
    },
    {
      key: "address",
      label: "Address",
      renderCell: (category: Category) => category.address,
    },
    {
      key: "resume",
      label: "Resume",
      renderCell: (category: Category) => {
        const fileUrl = `https://infinitech-api6.site/careers/applications/${category.resume}`;
        const fileExtension = category.resume.split(".").pop()?.toLowerCase();

        // Check if the file is an image
        const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(
          fileExtension || "",
        );

        return (
          <Gallery withDownloadButton>
            <Item original={fileUrl} height="500" width="500">
              {({ ref, open }) => (
                <>
                  {isImage ? (
                    <div className="flex justify-center items-center">
                      <img
                        ref={ref}
                        onClick={open}
                        src={fileUrl}
                        alt="Resume"
                        className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                      />
                    </div>
                  ) : (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <div ref={ref} className="cursor-pointer">
                        {fileExtension === "pdf"
                          ? fileIcons.pdf
                          : fileIcons.default}
                      </div>
                    </a>
                  )}
                </>
              )}
            </Item>
          </Gallery>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      renderCell: (category: Category) => (
        <div className="flex gap-2">
          {/* <Button
            isIconOnly
            startContent={<LuPenSquare size={18} />}
            variant="flat"
            color="primary"
            onPress={() => handleUpdateClick(category)}
          ></Button> */}
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
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(itemsPerPage)].map((_, index) => (
            <div key={index} className="h-10 bg-gray-300 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <TableData
          filter={true}
          label="APPLICATION"
          description="Manage and review all applicant submissions."
          columns={columns}
          data={categories}
          statusOptions={statusOptions}
        />
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteCategory}
        deleteBtnLoading={deleteBtnLoading}
        message="Are you sure you want to delete this application?"
      />

      {/* {updateModalOpen && (
        <UpdateNews
          initialData={categoryToUpdate!}
          onClose={closeUpdateModal}
          mutate={mutate}
        />
      )} */}
    </div>
  );
};

export default CareerTable;
