"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
} from "@heroui/react";
import { GoDotFill } from "react-icons/go";

type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  properties: string;
  status: "Pending" | "Accepted" | "Rejected" | "Other";
};

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

const typeColors: Record<
  string,
  "primary" | "warning" | "success" | "default"
> = {
  "On-Site Viewing": "primary",
  "Property Consultation": "success",
};

const AppointmentDetailModal = ({
  isOpen,
  onClose,
  appointment,
}: AppointmentDetailModalProps) => {
  if (!appointment) return null;

  const statusColor =
    appointment.status === "Pending"
      ? "warning"
      : appointment.status === "Accepted"
        ? "success"
        : appointment.status === "Rejected"
          ? "danger"
          : "default";

  const rows: [string, string][] = [
    ["Name", appointment.name],
    ["Email", appointment.email],
    ["Phone", appointment.phone || "—"],
    ["Property", appointment.properties],
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="text-violet-800">
          Appointment Details
        </ModalHeader>
        <ModalBody className="pb-6">
          <div className="flex gap-2 mb-4">
            <Chip
              size="sm"
              className="uppercase font-semibold"
              startContent={<GoDotFill />}
              color={typeColors[appointment.type] || "default"}
              variant="flat"
            >
              {appointment.type}
            </Chip>
            <Chip
              size="sm"
              color={statusColor}
              variant="flat"
              className="capitalize font-semibold"
            >
              {appointment.status}
            </Chip>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rows.map(([label, value]) => (
              <div key={label}>
                <p className="text-xs uppercase text-gray-400">{label}</p>
                <p className="text-sm text-gray-800 capitalize">{value}</p>
              </div>
            ))}
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

export default AppointmentDetailModal;
