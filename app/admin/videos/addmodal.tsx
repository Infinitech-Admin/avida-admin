'use client';

import React, { useState, useRef, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Image,
} from '@heroui/react';
import { SlPlus } from 'react-icons/sl';
import { LuImage, LuX } from 'react-icons/lu';
import { BiVideoPlus } from 'react-icons/bi';

interface AddModalProps {
  mutate: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ mutate }) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    video: null as File | null,
    thumbnail: null as File | null,
  });

  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null);
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];

      if (name === 'video') {
        if (videoObjectUrl) {
          URL.revokeObjectURL(videoObjectUrl);
        }
        const url = URL.createObjectURL(file);
        setFormData((prevState) => ({ ...prevState, video: file }));
        setVideoPreview(url);
        setVideoObjectUrl(url);
      } else if (name === 'thumbnail') {
        if (imageObjectUrl) {
          URL.revokeObjectURL(imageObjectUrl);
        }
        const url = URL.createObjectURL(file);
        setFormData((prevState) => ({ ...prevState, thumbnail: file }));
        setImagePreview(url);
        setImageObjectUrl(url);
      }
    }
  };

  const handleRemoveVideo = () => {
    if (videoObjectUrl) {
      URL.revokeObjectURL(videoObjectUrl);
    }
    setVideoPreview(null);
    setVideoObjectUrl(null);
    setFormData((prev) => ({ ...prev, video: null }));
  };

  const handleRemoveImage = () => {
    if (imageObjectUrl) {
      URL.revokeObjectURL(imageObjectUrl);
    }
    setImagePreview(null);
    setImageObjectUrl(null);
    setFormData((prev) => ({ ...prev, thumbnail: null }));
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = sessionStorage.getItem('token');
      const user_id = sessionStorage.getItem('user_id');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      const data = new FormData();
      if (user_id) {
        data.append('user_id', user_id);
      }
      data.append('name', formData.name);
      if (formData.video) {
        data.append('video', formData.video);
      }
      if (formData.thumbnail) {
        data.append('thumbnail', formData.thumbnail);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/videos`,
        data,
        { headers }
      );

      if (response?.data) {
        setFormData({
          name: '',
          video: null,
          thumbnail: null,
        });
        handleRemoveVideo();
        handleRemoveImage();
        mutate();
        setModalOpen(false);
        toast.success('Video added successfully!');
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMsg =
        axiosError.response?.data && typeof axiosError.response.data === 'object'
          ? (axiosError.response.data as any).message
          : 'An unexpected error occurred.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl);
      if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
    };
  }, [videoObjectUrl, imageObjectUrl]);

  return (
    <div>
      <Button
        size="lg"
        color="primary"
        startContent={<SlPlus size={18} />}
        aria-label="Add Video"
        onPress={() => setModalOpen(true)}
      >
        Add Video
      </Button>

      <Modal size="4xl" isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Add Video</ModalHeader>
          <form onSubmit={handleAddSubmit} encType="multipart/form-data">
            <ModalBody>
              <div className="flex flex-col gap-4">
                {/* Name Input */}
                <Input
                  size="lg"
                  isRequired
                  label="Name"
                  labelPlacement="outside"
                  variant="bordered"
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                {/* Video Upload & Preview */}
                <div className="flex flex-row gap-4">
                  {/* Upload */}
                  <div
                    className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer relative w-1/2 h-48"
                    onClick={() => {
                      if (videoInputRef.current) {
                        videoInputRef.current.value = '';
                        videoInputRef.current.click();
                      }
                    }}
                  >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
                      <div className="flex flex-col justify-center items-center text-center">
                        <BiVideoPlus size={72} />
                        <h1>Click to Upload Video</h1>
                        <p className="text-sm text-gray-500 mt-2">Supported: MP4, WebM, MOV</p>
                      </div>
                    </div>
                    <input
                      ref={videoInputRef}
                      id="video-input"
                      type="file"
                      name="video"
                      accept="video/*"
                      className="hidden"
                      onChange={handleChange}
                    />
                  </div>

                  {/* Preview */}
                  {videoPreview && (
                    <div className="relative w-1/2 h-48">
                      <video className="w-full h-48 object-cover rounded" controls>
                        <source src={videoPreview} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <Button
                        size="sm"
                        isIconOnly
                        startContent={<LuX />}
                        onPress={handleRemoveVideo}
                        className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full"
                      />
                    </div>
                  )}
                </div>

                {/* Thumbnail Upload & Preview */}
                <div className="flex flex-row gap-4">
                  {/* Upload */}
                  <div
                    className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer relative w-1/2 h-48"
                    onClick={() => {
                      if (thumbnailInputRef.current) {
                        thumbnailInputRef.current.value = '';
                        thumbnailInputRef.current.click();
                      }
                    }}
                  >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
                      <div className="flex flex-col justify-center items-center text-center">
                        <LuImage size={72} />
                        <h1>Click to Upload Thumbnail</h1>
                        <p className="text-sm text-gray-500 mt-2">
                          Supported formats: JPEG, PNG, GIF, BMP, TIFF
                        </p>
                      </div>
                    </div>
                    <input
                      ref={thumbnailInputRef}
                      id="thumbnail-input"
                      type="file"
                      name="thumbnail"
                      accept="image/*"
                      className="hidden"
                      onChange={handleChange}
                    />
                  </div>

                  {/* Preview */}
                  {imagePreview && (
                    <div className="relative w-1/2 h-48">
                      <Image
                        src={imagePreview}
                        alt="Thumbnail Preview"
                        className="w-full h-48 object-cover rounded"
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

            <ModalFooter>
              <Button
                size="lg"
                variant="light"
                onPress={() => setModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button isLoading={loading} size="lg" type="submit" color="primary">
                Add Video
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddModal;
