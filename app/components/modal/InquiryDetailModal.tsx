"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

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
};

interface InquiryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: Category | null;
}

const InquiryDetailModal = ({
  isOpen,
  onClose,
  inquiry,
}: InquiryDetailModalProps) => {
  if (!inquiry) return null;

  const rows: [string, string][] = [
    ["Full Name", `${inquiry.first_name} ${inquiry.last_name}`],
    ["Email", inquiry.email],
    ["Phone", inquiry.phone || "—"],
    ["Property", inquiry.property_name],
    ["Location", inquiry.property_location || "—"],
    ["Unit Type", inquiry.unit_type],
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="text-violet-800">Inquiry Details</ModalHeader>
        <ModalBody className="pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {rows.map(([label, value]) => (
              <div key={label}>
                <p className="text-xs uppercase text-gray-400">{label}</p>
                <p className="text-sm text-gray-800">{value}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs uppercase text-gray-400 mb-1">Message</p>
            <p className="text-sm text-gray-800 whitespace-pre-wrap border border-gray-100 rounded-lg p-3 bg-gray-50">
              {inquiry.message || "No message provided."}
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InquiryDetailModal;
