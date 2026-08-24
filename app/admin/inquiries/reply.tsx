"use client";

import { useState } from "react";
import { getAuthHeaders } from "@/app/utility/auth";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
  Input,
} from "@heroui/react";
import toast from "react-hot-toast";
import {
  LuBuilding2,
  LuMail,
  LuMapPin,
  LuMessageCircle,
  LuPhone,
  LuUser,
} from "react-icons/lu";
import axios, { RawAxiosRequestHeaders } from "axios";
import { mutate } from "swr";

type Category = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  property_name: string;
  property_location: string;
  unit_type: string;
  message: string;
  status: string;
};

type Props = {
  category: Category;
};

export default function Reply({ category }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  const handleMarkAsReplied = async (onClose: () => void) => {
    setLoading(true);
    try {
      const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/inquiries`;
      const headers = getAuthHeaders();
      const response = await axios.post(
        `${API_URL}/change-status`,
        { id: category.id, status: "Replied" },
        {
          headers: headers as RawAxiosRequestHeaders,
        }
      );

      if (!response) throw new Error("Failed to update status");

      await axios.post(`/api/email/inquiry/reply`, {
        message: replyMessage,
        email: category.email,
        first_name: category.first_name
      });

      toast.success("Inquiry marked as replied.");
      mutate(`${API_URL}`);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark as replied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        isIconOnly
        startContent={<LuMessageCircle size={18} />}
        variant="flat"
        color="primary"
      />
      <Modal size="4xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Reply to {category.first_name} {category.last_name}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Full Name"
                    startContent={<LuUser />}
                    variant="flat"
                    readOnly
                    value={`${category.first_name} ${category.last_name}`}
                  />
                  <Input
                    label="Email"
                    startContent={<LuMail />}
                    variant="flat"
                    readOnly
                    value={category.email}
                  />
                  <Input
                    label="Phone"
                    startContent={<LuPhone />}
                    variant="flat"
                    readOnly
                    value={category.phone}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Property"
                    startContent={<LuBuilding2 />}
                    variant="flat"
                    readOnly
                    value={category.property_name}
                  />
                  <Input
                    label="Unit/PS Type"
                    startContent={<LuBuilding2 />}
                    variant="flat"
                    readOnly
                    value={category.unit_type}
                  />
                  <Input
                    label="Location"
                    startContent={<LuMapPin />}
                    variant="flat"
                    readOnly
                    value={category.property_location}
                    className="md:col-span-2"
                  />
                </div>

                <div className="mt-4 space-y-4">
                  <Textarea
                    label="Inquiry Message"
                    variant="flat"
                    readOnly
                    value={category.message}
                  />
                  <Textarea
                    label="Your Reply"
                    placeholder="Type your reply here..."
                    variant="bordered"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button size="lg" color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                size="lg"
                  color="primary"
                  isLoading={loading}
                  onPress={() => handleMarkAsReplied(onClose)}
                >
                  Send Reply
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
