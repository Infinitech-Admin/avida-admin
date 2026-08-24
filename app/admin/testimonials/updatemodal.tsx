import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { mutate } from "swr";
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
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";

interface UpdateQuestionProps {
  initialData: {
    id: string;
    user_id: string;
    name: string;
    message: string;
    status: string;
  };
  onClose: () => void;
  mutate: () => void;
}

const UpdateQuestion: React.FC<UpdateQuestionProps> = ({
  initialData,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    id: initialData.id,
    user_id: initialData.user_id,
    name: initialData.name,
    message: initialData.message,
    status: initialData.status,
  });

  const [loading, setLoading] = useState(false);

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
    e.preventDefault();
    setLoading(true);

    try {
      let accessToken;

      if (typeof window !== "undefined" && window.sessionStorage) {
        accessToken = sessionStorage.getItem("token");
      } else {
        accessToken = null;
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`,
        {
          id: formData.id,
          user_id: formData.user_id,
          name: formData.name,
          message: formData.message,
          status: formData.status,
        },
        { headers }
      );

      if (response?.data) {
        mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`);
        onClose();
        toast.success("Testimonial updated successfully!");
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
    <div>
      {/* Hero UI Modal */}
      <Modal isOpen={true} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Update Testimonial</ModalHeader>

          <form onSubmit={handleUpdateSubmit}>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div>
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
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-span-1">
                  <Select
                    label="Status"
                    labelPlacement="outside"
                    size="lg"
                    variant="bordered"
                    selectedKeys={[formData.status]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      setFormData((prev) => ({ ...prev, status: selected }));
                    }}
                    required
                  >
                    <SelectItem key="active">Active</SelectItem>
                    <SelectItem key="in-active">In-Active</SelectItem>
                  </Select>
                </div>

                <div>
                  <Textarea
                    size="lg"
                    isRequired
                    label="Message"
                    labelPlacement="outside"
                    variant="bordered"
                    id="message"
                    name="message"
                    placeholder="Enter message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="light" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button isLoading={loading} type="submit" color="primary">
                Save Changes
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateQuestion;
