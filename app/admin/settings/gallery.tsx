import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button as HeroButton,
  useDisclosure,
  Image,
  Input,
} from "@heroui/react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { LuUpload } from "react-icons/lu";

function Gallery() {
  const [images, setImages] = useState<
    { image: string; name: string; id: number }[]
  >([]);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    id: number;
  }>({ show: false, id: 0 });
  const [changes, setChanges] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const accessToken = sessionStorage.getItem("token");
        if (!accessToken) return;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/images`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        setImages(response.data.records || []);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [changes]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageName(e.target.value);
  };

  const handleSubmit = async (onClose: () => void) => {
    setIsAdding(true);

    try {
      const accessToken = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("user_id");

      const form = new FormData();
      if (userId) form.append("user_id", userId);
      if (newImage) form.append("image", newImage);
      form.append("name", imageName);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/images`,
        form,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response?.data?.record) {
        setImages((prev) => [response.data, ...prev]);
        setChanges((prev) => prev + 1);

        // Reset form fields
        setNewImage(null);
        setImageName("");
        setPreviewUrl(null);

        // ✅ Close the modal
        onClose();

        toast.success("Image added successfully!");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
    }

    setIsAdding(false);
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      const accessToken = sessionStorage.getItem("token");

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/images/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.message === "Deleted Image") {
        setImages((prev) => prev.filter((img) => img.id !== id));
        toast.success("Image deleted successfully!");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }

    setDeleteConfirm({ show: false, id: 0 });
    setChanges((prev) => prev + 1);
    setIsDeleting(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          startContent={<LuUpload />}
          color="primary"
          type="button"
          onPress={onOpen}
        >
          Upload photo
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <PhotoProvider>
          {images.map((image) => (
            <div
              key={image.id}
              className="relative overflow-hidden rounded-lg shadow-lg group"
            >
              <PhotoView
                src={`https://infinitech-api27.site/images/${image.image}`}
              >
                <Image
                  src={`https://infinitech-api27.site/images/${image.image}`}
                  className="w-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                  width={1000}
                  height={250}
                />
              </PhotoView>

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button
                  onClick={() => setDeleteConfirm({ show: true, id: image.id })}
                  className="bg-red-500 text-white p-2 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
              <div className="absolute bottom-2 left-2 text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {image.name}
              </div>
            </div>
          ))}
        </PhotoProvider>
      </div>

      {/* Hero UI Modal for Add Image */}
      <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-medium text-gray-900">
                Add New Image
              </ModalHeader>
              <ModalBody>
                <div className="mb-4">
                  <Input
                    label="Name"
                    id="image-name"
                    type="text"
                    value={imageName}
                    onChange={handleNameChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <Input
                    label="Upload Image"
                    id="image-file"
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    required
                  />

                  {previewUrl && (
                    <div className="flex justify-center py-4">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-64 object-contain rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <HeroButton color="danger" variant="light" onPress={onClose}>
                  Cancel
                </HeroButton>
                <HeroButton
                  color="primary"
                  onPress={() => handleSubmit(onClose)}
                  isLoading={isAdding}
                >
                  Add Image
                </HeroButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, id: 0 })}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-medium text-gray-900">
              Are you sure you want to delete this image?
            </h3>
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-gray-600">
              This action cannot be undone. The image will be permanently
              deleted.
            </p>
          </ModalBody>
          <ModalFooter className="flex justify-end gap-2">
            <Button
              onPress={() => handleDelete(deleteConfirm.id)}
              color="danger"
              isLoading={isDeleting}
            >
              Yes, Delete
            </Button>
            <Button
              variant="ghost"
              onPress={() => setDeleteConfirm({ show: false, id: 0 })}
            >
              No, Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Gallery;
