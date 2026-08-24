import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "lightbox2/dist/css/lightbox.min.css";

import BtnLoadingSpinner from "@/app/components/spinner";
import DataTable from "@/app/components/matt/DataTable";
import TableData from "@/app/components/tabledata";
import { Button } from "@heroui/button";
import { LuTrash2 } from "react-icons/lu";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Input } from "@heroui/react";

interface PropertyDetailsContentProps {
  id: string | null;
}

interface Building {
  id: string;
  name: string;
  floors: string;
  parking: number;
  image: string;
}

interface AddUnit {
  name: string;
  floors: string;
  parking: number;
  image: File | null;
}

const PropertyBuilding: React.FC<PropertyDetailsContentProps> = ({ id }) => {
  const [unitData, setUnitData] = useState<Building[]>([]);
  const [formData, setFormData] = useState<AddUnit>({
    name: "",
    floors: "",
    parking: 0,
    image: null,
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isLoading1, setLoading1] = useState<boolean>(false);
  const [isLoading2, setLoading2] = useState<boolean>(false);
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deleteUnitId, setDeleteUnitId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      require("lightbox2");
    }
  }, []);

  const fetchUnitData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`,
        { headers },
      );
      setUnitData(response.data.record.buildings || []);
    } catch (err) {
      setError("Failed to load building data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const confirmAddUnit = async () => {
    if (!id) {
      toast.error("Property ID is required to add a building.");
      return;
    }

    setLoading1(true);
    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("floors", formData.floors);
    formPayload.append("parking", formData.parking.toString());
    formPayload.append("property_id", id);
    if (formData.image) formPayload.append("image", formData.image);

    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/buildings`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setAddModalOpen(false);
      toast.success("Building added successfully!");
      await fetchUnitData();
      setFormData({
        name: "",
        floors: "",
        parking: 0,
        image: null,
      });
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading1(false);
      setAddModalOpen(false);
    }
  };

  const confirmDeleteUnit = async () => {
    if (!deleteUnitId) return;

    try {
      const token = sessionStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      setLoading2(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/buildings/${deleteUnitId}`,
        { headers },
      );
      toast.success("Building deleted successfully!");
      await fetchUnitData();
    } catch (err) {
      toast.error("Failed to delete building. Please try again.");
    } finally {
      setLoading2(false);
      setDeleteModalOpen(false);
      setDeleteUnitId(null);
    }
  };

  useEffect(() => {
    fetchUnitData();
  }, [id]);

  const columns = [
    { key: "name", label: "Building" },
    {
      key: "floors",
      label: "Floors",
      renderCell: (row: Building) => <span>{row.floors} floors</span>,
    },
    {
      key: "parking",
      label: "Parking",
      renderCell: (row: Building) => <span>{row.floors} parking spots</span>,
    },
    {
      key: "image",
      label: "Image",
      renderCell: (row: Building) => (
        <PhotoProvider>
          <PhotoView
            data-title={row.name}
            src={`https://infinitech-api6.site/properties/buildings/${row.image}`}
          >
            <img
              className="w-16 h-16 object-cover rounded-lg"
              src={`https://infinitech-api6.site/properties/buildings/${row.image}`}
              alt={row.name}
            />
          </PhotoView>
        </PhotoProvider>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      renderCell: (row: Building) => (
        <Button
          isIconOnly
          variant="flat"
          color="danger"
          startContent={<LuTrash2 size={18} />}
          onPress={() => {
            setDeleteModalOpen(true);
            setDeleteUnitId(row.id);
          }}
        />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setAddModalOpen(true);
        }}
      >
        <div className="col-span-1">
          <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-lg p-4 md:p-5">
            <div className="w-full mb-3">
              <Input
                label="Building Name"
                variant="bordered"
                type="text"
                name="name"
                placeholder="e.g., Tower 1"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="w-full mb-3">
              <Input
                label="Floors"
                variant="bordered"
                type="text"
                name="floors"
                placeholder="e.g., 3"
                value={formData.floors}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="w-full mb-3">
              <Input
                label="Parking"
                variant="bordered"
                type="number"
                name="parking"
                placeholder="e.g., 2"
                // value={formData.parking}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="w-full mb-3">
              <label
                htmlFor="image"
                className="block text-sm font-medium mb-2 "
              >
                Building Image
              </label>
              <input
                type="file"
                name="image"
                className="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={handleInputChange}
                required
              />
            </div>

            <input type="hidden" name="id" value={id || ""} />

            <div className="w-full">
              <button
                type="submit"
                className="w-full py-2 px-3 min-h-10 inline-flex items-center justify-center text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
              >
                Add Building
              </button>
            </div>
          </div>
        </div>
      </form>

      {isAddModalOpen && (
        <Modal
          title="Confirm"
          body="Are you sure you want to add this building?"
          onConfirm={confirmAddUnit}
          onCancel={() => setAddModalOpen(false)}
          isLoading={isLoading1}
          actionLabel="Confirm"
        />
      )}

      {isDeleteModalOpen && (
        <Modal
          title="Confirm Delete"
          body="Are you sure you want to delete this building?"
          onConfirm={confirmDeleteUnit}
          onCancel={() => setDeleteModalOpen(false)}
          isLoading={isLoading2}
          actionLabel="Delete"
        />
      )}

      <div className="col-span-2">
        <div className="flex flex-col">
          <TableData
            filter={false}
            label="Buildings"
            description="Manage and view all listed buildings."
            columns={columns}
            data={unitData}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

const Modal: React.FC<{
  title: string;
  body: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  actionLabel: string;
}> = ({ title, body, onConfirm, onCancel, isLoading, actionLabel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-lg font-medium mb-4">{title}</h2>
      <p>{body}</p>
      <div className="flex justify-end gap-3 mt-6">
        <button
          className="min-w-[100px] py-2 px-3 text-sm font-medium bg-gray-200 rounded-lg"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className={`min-w-[100px] py-2 px-3 text-sm font-medium rounded-lg text-white focus:outline-none ${
            isLoading
              ? title === "Confirm"
                ? "bg-blue-400"
                : "bg-red-400"
              : title === "Confirm"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-red-600 hover:bg-red-700"
          }`}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? <BtnLoadingSpinner /> : actionLabel}
        </button>
      </div>
    </div>
  </div>
);

export default PropertyBuilding;
