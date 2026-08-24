import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import BtnLoadingSpinner from "@/app/components/spinner";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Divider,
  Image,
} from "@heroui/react";
import { BiVideoPlus } from "react-icons/bi";
import { LuImage } from "react-icons/lu";

interface UpdateNewsProps {
  initialData: {
    id: string;
    user_id: string;
    name: string;
    video: File | string | null;
    thumbnail: File | string | null;
  };
  onClose: () => void;
  mutate: () => void;
}

const UpdateNews: React.FC<UpdateNewsProps> = ({
  initialData,
  onClose,
  mutate,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: initialData.id,
    name: initialData.name,
    video: initialData.video,
    thumbnail: initialData.thumbnail,
  });

  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  useEffect(() => {
    if (typeof initialData.thumbnail === "string") {
      const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/video/${initialData.thumbnail}`;
      setThumbnailPreview(imageUrl);
    } else if (initialData.thumbnail instanceof File) {
      setThumbnailPreview(URL.createObjectURL(initialData.thumbnail));
    } else {
      setThumbnailPreview(null);
    }

    if (typeof initialData.video === "string") {
      const videoUrl = `${process.env.NEXT_PUBLIC_API_URL}/video/${initialData.video}`;
      setVideoPreview(videoUrl);
    } else if (initialData.video instanceof File) {
      setVideoPreview(URL.createObjectURL(initialData.video));
    } else {
      setVideoPreview(null);
    }
  }, [initialData.thumbnail, initialData.video]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files, value } = e.target;

    if (files && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Update previews
      if (name === "video") {
        const videoUrl = URL.createObjectURL(file);
        setVideoPreview(videoUrl);
      } else if (name === "thumbnail") {
        const imageUrl = URL.createObjectURL(file);
        setThumbnailPreview(imageUrl);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

    if (formData.video instanceof File) {
      formDataToSend.append("video", formData.video);
    }

    if (formData.thumbnail instanceof File) {
      formDataToSend.append("thumbnail", formData.thumbnail);
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/videos`,
      formDataToSend,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response?.data) {
      mutate();
      toast.success("Video updated successfully!");
      onClose();

      // Auto refresh page after successful update
      window.location.reload();
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMsg =
      axiosError.response?.data &&
      typeof axiosError.response.data === "object"
        ? (axiosError.response.data as any).message
        : "An unexpected error occurred.";
    setErrorMessage(errorMsg);
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <Modal size="4xl" isOpen={true} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Update Video</ModalHeader>
          <form onSubmit={handleUpdateSubmit} encType="multipart/form-data">
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div>
                  <Input
                    size="lg"
                    label="Name"
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

                {/* Video Upload */}
                <div className="flex flex-row gap-4">
                  <div
                    className="flex flex-wrap items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer relative w-1/2 h-48"
                    onClick={() => {
                      const fileInput = document.getElementById(
                        "video-input"
                      ) as HTMLInputElement | null;
                      if (fileInput) fileInput.click();
                    }}
                  >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
                      <div className="flex flex-col justify-center items-center text-center">
                        <BiVideoPlus size={72} />
                        <h1>Click to Upload Video</h1>
                        <p className="text-sm text-gray-500 mt-2">
                          Supported formats: MP4, MKV, AVI, WebM
                        </p>
                      </div>
                    </div>
                    <Input
                      id="video-input"
                      type="file"
                      name="video"
                      accept="video/*"
                      className="hidden"
                      onChange={handleChange}
                    />
                  </div>
                  {videoPreview && (
                    <div className="relative w-1/2 h-48">
                      <video
                        key={videoPreview} // important: forces refresh
                        controls
                        className="w-full h-48 object-cover rounded"
                      >
                        <source
                          src={videoPreview}
                          type={
                            formData.video instanceof File
                              ? formData.video.type || "video/mp4"
                              : "video/mp4"
                          }
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>

                {/* Thumbnail Upload */}
                <div className="flex flex-row gap-4">
                  <div
                    className="flex flex-wrap items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer relative w-1/2 h-48"
                    onClick={() => {
                      const fileInput = document.getElementById(
                        "thumbnail-input"
                      ) as HTMLInputElement | null;
                      if (fileInput) fileInput.click();
                    }}
                  >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
                      <div className="flex flex-col justify-center items-center text-center">
                        <LuImage size={72} />
                        <h1>Click to Upload Thumbnail</h1>
                        <p className="text-sm text-gray-500 mt-2">
                          Supported formats: JPEG, PNG, GIF
                        </p>
                      </div>
                    </div>
                    <Input
                      id="thumbnail-input"
                      type="file"
                      name="thumbnail"
                      accept="image/*"
                      className="hidden"
                      onChange={handleChange}
                    />
                  </div>
                  {thumbnailPreview && (
                    <div className="relative w-1/2 h-48">
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail Preview"
                        className="w-full h-48 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              {errorMessage && (
                <p className="text-red-500 mt-4">{errorMessage}</p>
              )}
            </ModalBody>

            <Divider className="my-4" />

            <ModalFooter>
              <Button variant="light" onPress={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                isLoading={loading}
                size="lg"
                type="submit"
                color="primary"
              >
                Save Changes
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateNews;
