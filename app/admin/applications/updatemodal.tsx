import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";

interface UpdateNewsProps {
  initialData: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    position: string;
    resume: string;
  };
  onClose: () => void;
  mutate: () => void;
}

const UpdateNews: React.FC<UpdateNewsProps> = ({
  initialData,
  onClose,
  mutate,
}) => {
  const positions = [
    "Referrer",
    "Sub-agent",
    "Broker",
    "Partner",
  ];

  const [formData, setFormData] = useState({
    id: initialData.id,
    name: initialData.name,
    email: initialData.email,
    phone: initialData.phone,
    address: initialData.address,
    position: initialData.position,
    resume: initialData.resume,
    newResume: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    e.preventDefault();
    try {
      let accessToken;

      if (typeof window !== "undefined" && window.sessionStorage) {
        accessToken = sessionStorage.getItem("token");
      } else {
        accessToken = null;
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      };

      const data = new FormData();
      data.append("id", formData.id);
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("position", formData.position);
      if (formData.newResume) {
        data.append("resume", formData.newResume);
      }
      data.append("_method", "PUT");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applications`,
        data,
        { headers }
      );

      if (response?.data) {
        mutate();
        onClose();
        toast.success("Application updated successfully!");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMsg =
        axiosError.response?.data &&
        typeof axiosError.response.data === "object"
          ? (axiosError.response.data as any).message
          : "An unexpected error occurred.";
      toast.error(errorMsg);
    }
    setIsSubmitting(false);
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleUpdateSubmit} encType="multipart/form-data">
          <ModalHeader className="py-3 px-4 border-b">
            <h3 className="text-lg font-bold text-gray-800 uppercase">
              Update Application
            </h3>
          </ModalHeader>
          <ModalBody className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[{ label: "Name", name: "name", value: formData.name },
              { label: "Email", name: "email", value: formData.email },
              { label: "Phone", name: "phone", value: formData.phone },
              { label: "Address", name: "address", value: formData.address }]
              .map(({ label, name, value }) => (
                <div key={name}>
                  <label htmlFor={name} className="block text-sm font-medium mb-2">
                    {label}
                  </label>
                  <input
                    id={name}
                    type="text"
                    name={name}
                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                    value={value}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
              <div key="position">
                <label htmlFor="position" className="block text-sm font-medium mb-2">
                  Position
                </label>
                <select
                  id="position"
                  name="position"
                  className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                  value={formData.position}
                  onChange={handleChange}
                  required
                >
                  {positions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label htmlFor="resume" className="block text-sm font-medium mb-2">
                  Image
                </label>
                <input
                  id="newResume"
                  type="file"
                  name="newResume"
                  className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 1024 * 1024) {
                        alert("File size must be less than 1 MB");
                      } else if (!file.type.startsWith("image/")) {
                        alert("Only images are allowed");
                      } else {
                        setFormData((prev) => ({ ...prev, newResume: file }));
                      }
                    }
                  }}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="py-3 px-4 border-t">
            <Button
              variant="light"
              onPress={onClose}
              className="py-2 px-3 rounded-lg text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="py-2 px-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-md"
              isLoading={isSubmitting}
            >
              Update Application
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default UpdateNews;
