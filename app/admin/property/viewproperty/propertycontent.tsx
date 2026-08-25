"use client";

import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

import PropertyImageSlider from "./propertyimageslider";

import { getAuthHeaders } from "@/app/utility/auth";
import BtnLoadingSpinner from "@/app/components/spinner";
import { filterMaxPrice } from "@/app/utility/format";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { LuX } from "react-icons/lu";
import { RiImageAddFill } from "react-icons/ri";

interface PropertyDetailsContentProps {
  id: string | null;
}

interface PropertyData {
  user_id?: string;
  name: string;
  logo?: string;
  status: string;
  location: string;
  min_price: string;
  max_price: string;
  slogan: string;
  description: string;
  percent: string;
  images?: string;
}

const fetcherWithAuth = async (url: string) => {
  const headers = getAuthHeaders();
  const res = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!res.ok) throw new Error("Failed to fetch data");

  return await res.json();
};

const PropertyDetailsContent: React.FC<PropertyDetailsContentProps> = ({
  id,
}) => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const router = useRouter();
  const { data, error, mutate } = useSWR<{ record: PropertyData }>(
    id ? `${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}` : null,
    fetcherWithAuth,
  );

  const [btnLoading, setBtnLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);

  const formData = data?.record || {
    name: "",
    logo: "",
    status: "",
    location: "",
    min_price: "",
    max_price: "",
    slogan: "",
    description: "",
    percent: "",
    images: "",
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    mutate({ record: { ...formData, [name]: value } }, false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.name === "logo") {
        setSelectedLogo(e.target.files[0]);
      } else {
        const filesArray = Array.from(e.target.files);
        setSelectedImages(filesArray);
        setPreviewImages(filesArray.map((file) => URL.createObjectURL(file)));
      }
    }
  };

  const handleSaveConfirmation = async () => {
    if (!data) {
      toast.error("No property data found to update.");
      setTimeout(() => setModalOpen(false), 5000);
      return;
    }

    setBtnLoading(true);

    try {
      const accessToken = sessionStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const formDataToSend = new FormData();
      formDataToSend.append("_method", "PUT");
      formDataToSend.append("id", id || "");
      formDataToSend.append("user_id", data.record.user_id || "");

      Object.keys(formData).forEach((key) => {
        if (key !== "images" && formData[key as keyof PropertyData]) {
          formDataToSend.append(key, formData[key as keyof PropertyData]!);
        }
      });

      if (selectedLogo) {
        formDataToSend.append("logo", selectedLogo);
      }

      selectedImages.forEach((file) => {
        formDataToSend.append("images[]", file);
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/properties`,
        formDataToSend,
        { headers },
      );

      if (response?.data) {
        toast.success("Property Updated Successfully");
        mutate();
        setSelectedLogo(null);
        setSelectedImages([]);
        setPreviewImages([]);
        const logoInput = document.querySelector(
          "input[name='logo']",
        ) as HTMLInputElement;
        const imagesInput = document.querySelector(
          "input[name='images']",
        ) as HTMLInputElement;
        if (logoInput) logoInput.value = "";
        if (imagesInput) imagesInput.value = "";
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(
        (axiosError.response?.data as { message?: string })?.message ||
          "An error occurred. Please try again.",
      );
    } finally {
      setModalOpen(false);
      setBtnLoading(false);
    }
  };

  if (error) return <div className="text-red-500">Error: {error.message}</div>;
  if (!data) return <div>Loading...</div>;

  const initialImages = JSON.parse(data.record.images || "[]");

  const handleRemoveImage = (indexToRemove: number) => {
    setPreviewImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
    setSelectedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const statusMapping: { [key: string]: string } = {
    RFO: "Ready For Occupancy",
    UC: "Under Construction",
    New: "New",
  };

  return (
    <div className="mt-4 overflow-y-auto">
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div className="w-full">
            <Input
              label="Property Name"
              variant="bordered"
              type="text"
              name="name"
              placeholder="Sonora Garden Residences"
              value={formData.name || ""}
              onChange={handleChange}
            />
          </div>

          <div className="w-full">
            <Select
              variant="bordered"
              label="Unit Status"
              name="status"
              selectedKeys={
                formData.status && statusMapping[formData.status]
                  ? new Set([statusMapping[formData.status]])
                  : new Set()
              }
              onSelectionChange={(keys) => {
                const selectedValue = Array.from(keys).join("");
                // Reverse map to send API-friendly value
                const apiValue = Object.keys(statusMapping).find(
                  (key) => statusMapping[key] === selectedValue,
                );
                mutate(
                  { record: { ...formData, status: apiValue || "" } },
                  false,
                );
              }}
            >
              <SelectItem
                key="Under Construction"
                textValue="Under Construction"
              >
                Under Construction
              </SelectItem>
              <SelectItem
                key="Ready For Occupancy"
                textValue="Ready For Occupancy"
              >
                Ready For Occupancy
              </SelectItem>
              <SelectItem key="New" textValue="New">
                New
              </SelectItem>
            </Select>
          </div>

          <div className="w-full">
            <Input
              variant="bordered"
              label="Property Status (%)"
              type="text"
              name="percent"
              placeholder="Percent"
              value={formData.percent || ""}
              onChange={handleChange}
            />
          </div>

          <div className="w-full col-span-full">
            <Input
              variant="bordered"
              label="Location"
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location || ""}
              onChange={handleChange}
            />
          </div>

          <div className="w-full col-span-full">
            <Textarea
              variant="bordered"
              label="Description"
              name="description"
              placeholder="Property Description"
              value={formData.description || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="bg-gray-200 p-4 rounded-lg cursor-pointer">
            <RiImageAddFill size={48} />
            <input
              className="hidden"
              type="file"
              name="images"
              id="images"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <PhotoProvider>
              {initialImages.length > 0 &&
                initialImages.map((image: string, index: number) => (
                  <div
                    key={`initial-${index}`}
                    className="w-24 h-24 relative group"
                  >
                    <PhotoView
                      src={`https://infinitech-api27.site/properties/images/${image}`}
                    >
                      <img
                        src={`https://infinitech-api27.site/properties/images/${image}`}
                        alt={`Existing Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </PhotoView>
                  </div>
                ))}
            </PhotoProvider>

            {previewImages.length > 0 &&
              previewImages.map((image, index) => (
                <div
                  key={`preview-${index}`}
                  className="w-24 h-24 relative group"
                >
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    <LuX />
                  </button>
                </div>
              ))}

            {initialImages.length === 0 && previewImages.length === 0 && (
              <p className="text-gray-500">Upload Images</p>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-end sm:flex-row gap-3 mt-4">
          <Button
            size="lg"
            variant="bordered"
            type="button"
            onPress={() => router.push("/admin/property")}
          >
            Cancel Edit
          </Button>
          <Button type="submit" variant="solid" color="primary" size="lg">
            Save Changes
          </Button>
        </div>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-medium mb-4">Confirm Save</h2>
            <p>Are you sure you want to save these changes?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="min-w-[100px] py-2 px-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setModalOpen(false)}
                disabled={btnLoading}
              >
                Cancel
              </button>
              <button
                className={`min-w-[100px] py-2 px-3 text-sm font-medium text-white rounded-lg ${btnLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
                onClick={handleSaveConfirmation}
                disabled={btnLoading}
              >
                {btnLoading ? <BtnLoadingSpinner /> : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsContent;
