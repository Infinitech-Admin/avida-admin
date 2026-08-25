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
  Image,
} from "@heroui/react";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuPenSquare } from "react-icons/lu";

interface Certificate {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string; // Existing image URL or path
  user_id: string;
}

interface FormDataState {
  id?: string;
  title: string;
  description: string;
  date: string;
  image: File | null;
  user_id: string;
}

interface UpdateCertificatesProps {
  certificate: Certificate;
  onUpdateSuccess: () => void;
}

export default function UpdateCertificates({
  certificate,
  onUpdateSuccess,
}: UpdateCertificatesProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formData, setFormData] = useState<FormDataState>({
    id: certificate?.id || "",
    title: certificate?.title || "",
    description: certificate?.description || "",
    date: certificate?.date.split("T")[0] || "",
    image: null, // Image will be replaced only if the user selects a new one
    user_id: certificate?.user_id || "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (certificate) {
      setFormData({
        id: certificate.id,
        title: certificate.title,
        description: certificate.description,
        date: certificate.date.split("T")[0],
        image: null, // Reset file on load
        user_id: certificate.user_id,
      });
    }
  }, [certificate]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      image: files ? files[0] : null,
    }));
  };

  // Handle form submission
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
      form.append("id", formData.id || "");
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("date", formData.date);
      form.append("user_id", formData.user_id);
      form.append("_method", "PUT");

      // Add the new image if available, otherwise keep the existing one
      if (formData.image) {
        form.append("image", formData.image);
      } else {
        form.append("image", certificate.image); // Keep existing image
      }

      // Send PUT request to update the certificate
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/certificates`,
        form,
        { headers },
      );

      if (response.status === 200) {
        toast.success("Certificate updated successfully!");
        onUpdateSuccess(); // Trigger SWR revalidation or refresh
        onOpenChange(); // Close modal after update
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error updating certificate:", axiosError);
      toast("Error updating certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Edit Button */}
      <Button
        isIconOnly
        startContent={<LuPenSquare size={18} />}
        variant="flat"
        color="primary"
        onPress={onOpen}
      />
      {/* Modal for updating certificate */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update Certificate
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
                      label="Upload New Image"
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave this empty if you don't want to change the image.
                    </p>
                  </div>

                  {/* Show the current image preview */}
                  {certificate.image && (
                    <div className="mb-4 flex justify-center items-center">
                      <Image
                        src={`https://infinitech-api27.site/certificates/${certificate.image}`}
                        alt="Current Certificate"
                        className="w-full h-auto rounded-md"
                        height={250}
                      />
                    </div>
                  )}

                  <Button
                    isLoading={loading}
                    className="w-full"
                    type="submit"
                    size="lg"
                    variant="solid"
                    color="primary"
                  >
                    Update Certificate
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
