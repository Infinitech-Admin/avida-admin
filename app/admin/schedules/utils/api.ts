import axios, { RawAxiosRequestHeaders } from "axios";
import { getAuthHeaders } from "@/app/utility/auth";
import toast from "react-hot-toast";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/appointments`;

// Get token from sessionStorage if available
let token;
if (typeof window !== "undefined" && window.sessionStorage) {
  token = sessionStorage.getItem("token");
} else {
  token = null;
}

const headers = {
  ...getAuthHeaders(),
  Accept: "application/json",
  Authorization: token ? `Bearer ${token}` : "",
};

// ✅ Fetch Appointments
export const fetchAppointments = async (router: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/appointments`,
      { headers }
    );

    if (response.status === 401) {
      router.replace("/auth/login");
      return [];
    }

    if (!response.ok) {
      throw new Error("An error occurred while fetching appointments.");
    }

    const data = await response.json();
    return data.records.map((appointment: any) => ({
      id: appointment.id,
      title: appointment.type,
      start: `${appointment.date}T${appointment.time}`,
      properties: appointment.properties,
      date: appointment.date,
      time: appointment.time,
      message: appointment.message,
      phone: appointment.phone,
      email: appointment.email,
      status: appointment.status,
      name: appointment.name,
    }));
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

// ✅ Handle Accept Schedule
export const handleAcceptSchedule = async (
  event: any,
  setIsLoading: (loading: boolean) => void
) => {
  setIsLoading(true);
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(
      `${API_URL}/change-status`,
      { id: event.id, status: "Accepted" },
      {
        headers: headers as RawAxiosRequestHeaders,
      }
    );

    if (response.status === 200) {
      toast.success("Schedule accepted successfully.");
      window.location.reload();
    }
  } catch (error) {
    console.error("Error accepting schedule:", error);
    toast.error("Failed to accept schedule. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

// ✅ Handle Decline Schedule
export const handleDeclineSchedule = async (
  event: any,
  setIsDeclineLoading: (loading: boolean) => void
) => {
  setIsDeclineLoading(true);
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(
      `${API_URL}/change-status`,
      { id: event.id, status: "Declined" },
      {
        headers: headers as RawAxiosRequestHeaders,
      }
    );

    if (response.status === 200) {
      toast.success("Schedule declined successfully.");
      window.location.reload();
    }
  } catch (error) {
    console.error("Error declining schedule:", error);
    toast.error("Failed to decline schedule. Please try again.");
  } finally {
    setIsDeclineLoading(false);
  }
};
