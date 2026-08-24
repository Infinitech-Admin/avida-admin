"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import DeleteConfirmationModal from "@/app/components/modal/deletemodal";
import AppointmentDetailModal from "@/app/components/modal/AppointmentDetailModal";
import { getAuthHeaders } from "@/app/utility/auth";
import { LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chip } from "@heroui/react";
import { GoDotFill } from "react-icons/go";
import DashboardResponsiveTable from "@/app/components/dashboardresponsivetable";

type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  properties: string;
  status: "Pending" | "Accepted" | "Rejected" | "Other";
};

const DashboardAppointmentTable: React.FC = () => {
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null,
  );
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const fetcherWithAuth = async (url: string) => {
    const headers = getAuthHeaders();
    const res = await fetch(url, { method: "GET", headers });

    if (res.status === 401) {
      router.replace("/auth/login");
      return;
    }
    if (res.status === 429) {
      toast.error("Too many requests. Please try again later.");
      return;
    }
    return await res.json();
  };

  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/appointments`,
    fetcherWithAuth,
  );

  useEffect(() => {
    if (data && !error) {
      setAppointments(data.records);
      setIsLoading(false);
    }
  }, [data, error]);

  const handleDeleteClick = (appointmentId: string) => {
    setAppointmentToDelete(appointmentId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteAppointment = async () => {
    if (!appointmentToDelete) return;
    setDeleteBtnLoading(true);
    try {
      const headers = getAuthHeaders();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${appointmentToDelete}`,
        {
          method: "DELETE",
          headers,
        },
      );

      if (!res.ok)
        throw new Error(`Failed to delete appointment (${res.status})`);

      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== appointmentToDelete),
      );
      toast.success("Appointment deleted successfully!");
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Failed to delete appointment.");
    } finally {
      setDeleteBtnLoading(false);
    }
  };

  const handleRowClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDetailModalOpen(true);
  };

  const typeColors: Record<
    string,
    "primary" | "warning" | "success" | "default"
  > = {
    "On-Site Viewing": "primary",
    "Property Consultation": "success",
  };

  const columns = [
    {
      key: "name",
      label: "Name and Email",
      renderCell: (appointment: Appointment) => (
        <div>
          <p className="font-semibold capitalize truncate">
            {appointment.name}
          </p>
          <span className="text-gray-500 text-xs sm:text-md truncate block">
            {appointment.email}
          </span>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      renderCell: (appointment: Appointment) => (
        <span className="text-sm text-gray-800">
          {appointment.phone || "—"}
        </span>
      ),
    },
    {
      key: "unit",
      label: "Property",
      renderCell: (appointment: Appointment) => (
        <div className="capitalize">{appointment.properties}</div>
      ),
    },
    {
      key: "type",
      label: "Appointment Type",
      renderCell: (appointment: Appointment) => (
        <Chip
          size="sm"
          className="uppercase font-semibold"
          startContent={<GoDotFill />}
          color={typeColors[appointment.type] || "default"}
          variant="flat"
        >
          {appointment.type}
        </Chip>
      ),
    },
    {
      key: "status",
      label: "Status",
      renderCell: (appointment: Appointment) => {
        const statusColor =
          appointment.status === "Pending"
            ? "warning"
            : appointment.status === "Accepted"
              ? "success"
              : appointment.status === "Rejected"
                ? "danger"
                : "default";

        return (
          <Chip
            size="sm"
            color={statusColor}
            variant="flat"
            className="capitalize font-semibold"
          >
            {appointment.status}
          </Chip>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      renderCell: (appointment: Appointment) => (
        <div className="flex gap-2">
          <button
            className="text-gray-400 hover:text-red-600 transition-colors"
            aria-label="Delete appointment"
            onClick={() => handleDeleteClick(appointment.id)}
          >
            <LuTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DashboardResponsiveTable
        filter={false}
        loading={isLoading}
        label="APPOINTMENTS"
        description="Manage and respond to all schedule appointments."
        columns={columns}
        data={appointments}
        onRowClick={handleRowClick}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteAppointment}
        deleteBtnLoading={deleteBtnLoading}
        message="Are you sure you want to delete this appointment?"
      />

      <AppointmentDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default DashboardAppointmentTable;
