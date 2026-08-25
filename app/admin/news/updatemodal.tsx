import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import BtnLoadingSpinner from "@/app/components/spinner";
import { LuImage, LuX } from "react-icons/lu";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Divider,
  Image,
} from "@heroui/react";

interface UpdateNewsProps {
  initialData: {
    id: string;
    headline: string;
    url: string;
    content: string;
    date: string;
    image: File | string;
  };
  onClose: () => void;
  mutate: () => void;
  isOpen: boolean;
}

const UpdateNews: React.FC<UpdateNewsProps> = ({
  initialData,
  onClose,
  mutate,
  isOpen,
}) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: initialData.id,
    headline: initialData.headline,
    url: initialData.url,
    content: initialData.content,
    date: initialData.date,
    image: initialData.image,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (typeof initialData.image === "string") {
      // Construct the full image URL if the image is just a filename
      const imageUrl = `https://infinitech-api27.site/articles/${initialData.image}`;
      setImagePreview(imageUrl); // Set the full URL for image preview
    } else {
      setImagePreview(null); // Reset the image preview if it's not a URL or string
    }
  }, [initialData.image]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file)); // Update preview with the new image
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, content: e.target.value }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accessToken =
        typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const formDataToSend = new FormData();
      formDataToSend.append("id", formData.id);
      formDataToSend.append("headline", formData.headline);
      formDataToSend.append("url", formData.url);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("_method", "PUT");

      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/articles`,
        formDataToSend,
        { headers },
      );

      if (response?.data) {
        mutate();
        onClose();
        toast.success("News updated successfully!");
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
    <Modal size="4xl" isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="text-lg font-bold text-gray-800 uppercase">
              Update News and Updates
            </ModalHeader>

            <form onSubmit={handleUpdateSubmit} encType="multipart/form-data">
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="col-span-4">
                    <Input
                      label="Headline"
                      labelPlacement="outside"
                      size="lg"
                      variant="bordered"
                      id="headline"
                      type="text"
                      name="headline"
                      placeholder="Enter headline"
                      value={formData.headline}
                      onChange={(e) => handleChange(e as any)}
                      required
                    />
                  </div>

                  <div className="col-span-3">
                    <Input
                      isRequired
                      label="Link (URL)"
                      labelPlacement="outside"
                      size="lg"
                      variant="bordered"
                      id="url"
                      type="text"
                      name="url"
                      placeholder="Enter URL"
                      value={formData.url}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-span-1">
                    <Input
                      label="Date"
                      labelPlacement="outside"
                      size="lg"
                      variant="bordered"
                      id="date"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={(e) => handleChange(e as any)}
                      required
                    />
                  </div>

                  <div className="col-span-4">
                    <Textarea
                      label="Content"
                      labelPlacement="outside"
                      size="lg"
                      variant="bordered"
                      id="content"
                      name="content"
                      placeholder="Enter content"
                      value={formData.content}
                      onChange={handleTextareaChange}
                      required
                    />
                  </div>

                  {/* Custom Image Upload UI */}
                  <div className="col-span-4 flex gap-6">
                    <div
                      className="flex flex-wrap items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer relative w-1/2 h-48"
                      onClick={() => {
                        const fileInput = document.getElementById(
                          "file-input",
                        ) as HTMLInputElement | null;
                        if (fileInput) fileInput.click();
                      }}
                    >
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
                        <div className="flex flex-col justify-center items-center text-center">
                          <LuImage size={72} />
                          <h1>Click to Upload Image</h1>
                          <p className="text-sm text-gray-500 mt-2">
                            Supported formats: JPEG, PNG, GIF, BMP, TIFF
                          </p>
                        </div>
                      </div>
                      <Input
                        id="file-input"
                        type="file"
                        name="image"
                        accept="image/*"
                        className="hidden"
                        onChange={handleChange}
                      />
                    </div>

                    {imagePreview && (
                      <div className="relative">
                        <Image
                          src={
                            typeof imagePreview === "string"
                              ? imagePreview
                              : URL.createObjectURL(imagePreview)
                          }
                          alt="Preview"
                          className="w-full h-48 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </ModalBody>

              <Divider className="my-4" />

              <ModalFooter>
                <Button
                  size="lg"
                  color="default"
                  variant="light"
                  onPress={onCloseModal}
                  isDisabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  isLoading={loading}
                  type="submit"
                  color="primary"
                  isDisabled={loading}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UpdateNews;
