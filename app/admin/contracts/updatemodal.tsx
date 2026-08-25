import React, { useState, useRef, useEffect } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Image,
} from "@heroui/react";
import { LuImage, LuX } from "react-icons/lu"; // Import the image and close icon

interface UpdateNewsProps {
  initialData: {
    id: string;
    user_id: string;
    name: string;
    image: string | File | null; // Modify type to handle both string (filename) and File
  };
  onClose: () => void;
  mutate: () => void;
}

const UpdateNews: React.FC<UpdateNewsProps> = ({
  initialData,
  onClose,
  mutate,
}) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: initialData.id,
    name: initialData.name,
    image: initialData.image,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null); // Reference for the input field

  // Set image preview on initial render if the image is a string (filename) or a File
  useEffect(() => {
    if (typeof initialData.image === "string") {
      // Construct the full image URL if the image is a filename
      const imageUrl = `https://infinitech-api27.site/contracts/${initialData.image}`;
      setImagePreview(imageUrl); // Set the full URL for image preview
    } else if (initialData.image instanceof File) {
      // Handle the case where image is a File object (local image)
      setImagePreview(URL.createObjectURL(initialData.image)); // Set preview URL for file
    } else {
      setImagePreview(null); // Reset the image preview if it's neither a string nor a File
    }
  }, [initialData.image]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "image" && files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      // Handle file preview for image
      if (file instanceof File) {
        setImagePreview(URL.createObjectURL(file)); // Set preview URL for the image
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = sessionStorage.getItem("token");
      const formDataToSend = new FormData();

      formDataToSend.append("_method", "PUT");
      formDataToSend.append("id", initialData.id);
      formDataToSend.append("user_id", initialData.user_id);
      formDataToSend.append("name", formData.name);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contracts`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response?.data) {
        mutate();
        toast.success("Contract updated successfully!");
        onClose();
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMsg =
        axiosError.response?.data &&
        typeof axiosError.response.data === "object"
          ? (axiosError.response.data as any).message
          : "An unexpected error occurred.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      size="4xl"
      isOpen={true}
      onClose={onClose}
      scrollBehavior="inside"
      classNames={{
        wrapper: "items-center",
        base: "m-4 max-h-[85vh] sm:max-h-[90vh] overflow-hidden flex flex-col",
        body: "overflow-y-auto",
      }}
    >
      <ModalContent>
        <ModalHeader>Update Contract</ModalHeader>
        <form
          onSubmit={handleUpdateSubmit}
          encType="multipart/form-data"
          className="flex flex-col overflow-hidden flex-1"
        >
          <ModalBody>
            <div className="flex flex-col gap-4">
              <div>
                <Input
                  size="lg"
                  isRequired
                  label="Contract Name"
                  labelPlacement="outside"
                  variant="bordered"
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Image upload and preview */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Upload */}
                <div
                  className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 cursor-pointer relative w-full sm:w-1/2 h-40 sm:h-48"
                  onClick={() => {
                    if (thumbnailInputRef.current) {
                      thumbnailInputRef.current.value = "";
                      thumbnailInputRef.current.click();
                    }
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 w-full px-2">
                    <div className="flex flex-col justify-center items-center text-center">
                      <LuImage size={56} className="sm:hidden" />
                      <LuImage size={72} className="hidden sm:block" />
                      <h1 className="text-sm sm:text-base">
                        Click to Upload Thumbnail
                      </h1>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        Supported formats: JPEG, PNG, GIF, BMP, TIFF
                      </p>
                    </div>
                  </div>
                  <input
                    ref={thumbnailInputRef}
                    id="thumbnail-input"
                    type="file"
                    name="image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChange}
                  />
                </div>

                {/* Preview */}
                {imagePreview && (
                  <div className="relative w-full sm:w-1/2 h-40 sm:h-48">
                    <Image
                      src={imagePreview}
                      alt="Thumbnail Preview"
                      className="w-full h-40 sm:h-48 object-cover rounded"
                    />
                    <Button
                      size="sm"
                      isIconOnly
                      startContent={<LuX />}
                      onPress={handleRemoveImage}
                      className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button
              size="lg"
              variant="light"
              onPress={onClose}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              isLoading={loading}
              size="lg"
              type="submit"
              color="primary"
              className="w-full sm:w-auto"
            >
              Save Changes
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default UpdateNews;
