"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
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
import { SlPlus } from "react-icons/sl";

interface AddNewsProps {
  mutate: () => void;
}

const AddNews: React.FC<AddNewsProps> = ({ mutate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    headline: "",
    url: "",
    content: "",
    date: "",
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, content: e.target.value }));
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accessToken =
        typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const formDataToSend = new FormData();
      formDataToSend.append("headline", formData.headline);
      formDataToSend.append("url", formData.url);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("date", formData.date);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/articles`,
        formDataToSend,
        { headers },
      );

      if (response?.data) {
        mutate();
        toast.success("News added successfully!");
        setIsOpen(false);
        setFormData({
          headline: "",
          url: "",
          content: "",
          date: "",
          image: null,
        });
        setImagePreview(null);
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
    <>
      <Button
        size="lg"
        onPress={() => setIsOpen(true)}
        color="primary"
        startContent={<SlPlus />}
        className="mb-4"
      >
        Add News
      </Button>

      <Modal
        size="4xl"
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        scrollBehavior="inside"
        classNames={{
          wrapper: "items-center",
          base: "m-4 max-h-[85vh] sm:max-h-[90vh] overflow-hidden flex flex-col",
          body: "overflow-y-auto",
        }}
      >
        <ModalContent>
          {(onCloseModal) => (
            <>
              <ModalHeader className="text-lg font-bold text-gray-800 uppercase">
                Add News and Updates
              </ModalHeader>

              <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="flex flex-col overflow-hidden flex-1"
              >
                <ModalBody>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="col-span-full">
                      <Input
                        label="Headline"
                        labelPlacement="outside"
                        size="lg"
                        variant="bordered"
                        name="headline"
                        placeholder="Enter headline"
                        value={formData.headline}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="sm:col-span-1 lg:col-span-3">
                      <Input
                        label="Link (URL)"
                        labelPlacement="outside"
                        size="lg"
                        variant="bordered"
                        name="url"
                        placeholder="Enter URL"
                        value={formData.url}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <Input
                        label="Date"
                        labelPlacement="outside"
                        size="lg"
                        variant="bordered"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-span-full">
                      <Textarea
                        label="Content"
                        labelPlacement="outside"
                        size="lg"
                        variant="bordered"
                        name="content"
                        placeholder="Enter content"
                        value={formData.content}
                        onChange={handleTextareaChange}
                        required
                      />
                    </div>

                    {/* Image Upload + Preview */}
                    <div className="col-span-full flex flex-col sm:flex-row gap-4 sm:gap-6">
                      <div
                        className="flex flex-wrap items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 cursor-pointer relative w-full sm:w-1/2 h-40 sm:h-48"
                        onClick={() => {
                          const fileInput = document.getElementById(
                            "file-input",
                          ) as HTMLInputElement | null;
                          if (fileInput) fileInput.click();
                        }}
                      >
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 w-full px-2">
                          <div className="flex flex-col justify-center items-center text-center">
                            <LuImage size={56} className="sm:hidden" />
                            <LuImage size={72} className="hidden sm:block" />
                            <h1 className="text-sm sm:text-base">
                              Click to Upload Image
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2">
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
                        <div className="relative w-full sm:w-1/2 h-40 sm:h-48">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-40 sm:h-48 object-cover rounded"
                          />
                          <Button
                            size="sm"
                            isIconOnly
                            startContent={<LuX />}
                            onPress={handleRemoveImage}
                            className="absolute -top-2 -right-2 sm:-right-4 z-10 bg-red-500 text-white rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </ModalBody>

                <Divider className="my-4" />

                <ModalFooter className="flex-col-reverse sm:flex-row gap-2">
                  <Button
                    size="lg"
                    color="default"
                    variant="light"
                    onPress={() => setIsOpen(false)}
                    isDisabled={loading}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="lg"
                    type="submit"
                    color="primary"
                    isDisabled={loading}
                    isLoading={loading}
                    className="w-full sm:w-auto"
                  >
                    Add News
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddNews;
