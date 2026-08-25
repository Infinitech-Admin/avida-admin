"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
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
  /** When true, renders an editable form instead of the read-only view. */
  editable?: boolean;
  /**
   * Called with the edited inquiry when the user saves. Return a Promise if
   * you want the modal to show a loading state and stay open until it
   * resolves; the modal itself doesn't call any API, the parent decides how
   * to persist the change.
   */
  onSave?: (updated: Category) => void | Promise<void>;
}

const InquiryDetailModal = ({
  isOpen,
  onClose,
  inquiry,
  editable = false,
  onSave,
}: InquiryDetailModalProps) => {
  const [formData, setFormData] = useState<Category | null>(inquiry);
  const [saving, setSaving] = useState(false);

  // Keep local form state in sync whenever a new inquiry is opened, or when
  // switching between view/edit mode.
  useEffect(() => {
    setFormData(inquiry);
  }, [inquiry, editable, isOpen]);

  if (!inquiry || !formData) return null;

  const handleFieldChange = (field: keyof Category, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!formData || !onSave) {
      onClose();
      return;
    }
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setSaving(false);
    }
  };

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
        <ModalHeader className="text-violet-800">
          {editable ? "Edit Inquiry" : "Inquiry Details"}
        </ModalHeader>
        <ModalBody className="pb-6">
          {editable ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.first_name}
                  onChange={(e) =>
                    handleFieldChange("first_name", e.target.value)
                  }
                />
                <Input
                  label="Last Name"
                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.last_name}
                  onChange={(e) =>
                    handleFieldChange("last_name", e.target.value)
                  }
                />
                <Input
                  label="Email"
                  labelPlacement="outside"
                  variant="bordered"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                />
                <Input
                  label="Phone"
                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                />
                <Input
                  label="Property"
                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.property_name}
                  onChange={(e) =>
                    handleFieldChange("property_name", e.target.value)
                  }
                />
                <Input
                  label="Location"
                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.property_location}
                  onChange={(e) =>
                    handleFieldChange("property_location", e.target.value)
                  }
                />
                <Input
                  label="Unit Type"
                  labelPlacement="outside"
                  variant="bordered"
                  className="sm:col-span-2"
                  value={formData.unit_type}
                  onChange={(e) =>
                    handleFieldChange("unit_type", e.target.value)
                  }
                />
              </div>
              <Textarea
                label="Message"
                labelPlacement="outside"
                variant="bordered"
                minRows={4}
                value={formData.message}
                onChange={(e) => handleFieldChange("message", e.target.value)}
              />
            </div>
          ) : (
            <>
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
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} disabled={saving}>
            {editable ? "Cancel" : "Close"}
          </Button>
          {editable && (
            <Button color="primary" onPress={handleSave} isLoading={saving}>
              Save Changes
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InquiryDetailModal;
