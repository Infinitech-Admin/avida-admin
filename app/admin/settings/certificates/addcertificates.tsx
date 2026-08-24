import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
} from "@heroui/react";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SlPlus } from "react-icons/sl";

interface FormData {
  title: string;
  description: string;
  date: string;
  image: File | null;
  user_id: string;
}

interface AddCertificatesProps {
  mutate: () => void;
}

export default function AddCertificates({ mutate }: AddCertificatesProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    date: "",
    image: null,
    user_id: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = sessionStorage.getItem("user_id");
    if (userId) {
      setFormData((prevData) => ({
        ...prevData,
        user_id: userId,
      }));
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      image: files ? files[0] : null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accessToken = sessionStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      };

      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof FormData];
        if (key === "image" && value instanceof File) {
          form.append(key, value);
        } else if (value) {
          form.append(key, value as string);
        }
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/certificates`,
        form,
        { headers }
      );

      if (response?.data?.record) {
        const newCertificate = response.data.record;
        setCertificates((prevCertificates) => {
          const updatedCertificates = [
            newCertificate,
            ...prevCertificates,
          ].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          return updatedCertificates;
        });
      }

      setLoading(false);
      mutate();
      // Reset form after submission
      setFormData({
        title: "",
        description: "",
        date: "",
        image: null,
        user_id: formData.user_id,
      });

      onClose();
      toast.success("Certificate added successfully");
    } catch (error) {
      const axiosError = error as AxiosError;
      if (
        axiosError.response?.data &&
        typeof axiosError.response.data === "object"
      ) {
        alert(
          (axiosError.response.data as any).message ||
            "An error occurred. Please try again."
        );
        console.error(axiosError);
      } else {
        alert("An unexpected error occurred.");
        console.error(axiosError);
      }
    }
  };

  return (
    <>
      <Button
        startContent={<SlPlus size={18} />}
        variant="flat"
        color="primary"
        onPress={onOpen}
      >
        Add New Certificate
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Certificate
              </ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <Input
                      isRequired
                      size="lg"
                      label="Certificate Title"
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-4">
                    <Textarea
                      isRequired
                      label="Certificate Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-4">
                    <Input
                      size="lg"
                      label="Input Date"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-4">
                    <Input
                      size="lg"
                      isRequired
                      label="Upload Image"
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                    />
                  </div>
                  <Button
                    isLoading={loading}
                    className="w-full"
                    type="submit"
                    size="lg"
                    variant="solid"
                    color="primary"
                  >
                    Add Certificate
                  </Button>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
