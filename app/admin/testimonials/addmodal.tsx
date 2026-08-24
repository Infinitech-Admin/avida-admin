import React, { useState } from "react";
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
  Textarea,
  Divider,
  Select,
  SelectItem,
} from "@heroui/react";
import { SlPlus } from "react-icons/sl";

interface AddQuestionProps {
  mutate: () => void;
}

const AddQuestion: React.FC<AddQuestionProps> = ({ mutate }) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    message: "",
    status: "",
  });

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

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      let accessToken;

      if (typeof window !== "undefined" && window.sessionStorage) {
        accessToken = sessionStorage.getItem("token");
      } else {
        accessToken = null;
      }

      let user_id;

      if (typeof window !== "undefined" && window.sessionStorage) {
        user_id = sessionStorage.getItem("user_id");
      } else {
        user_id = null;
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      const data = new FormData();
      if (user_id) {
        data.append("user_id", user_id);
      }
      data.append("name", formData.name);
      data.append("message", formData.message);
      data.append("status", formData.status)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`,
        data,
        { headers }
      );

      if (response?.data) {
        setFormData({
          name: "",
          message: "",
          status: "",
        });
        mutate();
        setModalOpen(false);
        setLoading(false);
        toast.success("Testimonial added successfully!");
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
  };

  return (
    <div>
      <Button
        size="lg"
        color="primary"
        startContent={<SlPlus size={18} />}
        aria-label="Add Testimonial"
        onPress={() => setModalOpen(true)}
      >
        Add Testimonial
      </Button>

      {/* Hero UI Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Add Testimonial</ModalHeader>

          <form onSubmit={handleAddSubmit}>
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
                    placeholder="eg., Juan Dela Cruz"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-span-1">
                  <Select
                    isRequired
                    size="lg"
                    variant="bordered"
                    label="Status"
                    labelPlacement="outside"
                    placeholder="Select Status"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
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
            <Divider className="my-4" />
            <ModalFooter>
              <Button
                size="lg"
                variant="light"
                onPress={() => setModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                size="lg"
                isLoading={loading}
                type="submit"
                color="primary"
              >
                Add Testimonial
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddQuestion;
