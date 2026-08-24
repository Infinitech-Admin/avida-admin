"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { MdAccessTime, MdOutlineEmail, MdOutlineTitle } from "react-icons/md";
import { LuBuilding2 } from "react-icons/lu";
import { TbMessageUser, TbUser } from "react-icons/tb";
import { HiMiniDevicePhoneMobile } from "react-icons/hi2";
import { getAuthHeaders } from "@/app/utility/auth";
import axios from "axios";

type Schedule = {
  id?: string;
  name?: string;
  title: string;
  date: string;
  time: string;
  properties: string;
  message: string;
  phone: string;
  email: string;
  status: string;
};

const Calendar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeclineLoading, setIsDeclineLoading] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const router = useRouter();
  let token;

  if (typeof window !== 'undefined' && window.sessionStorage) {
    token = sessionStorage.getItem('token');
  } else {
    token = null; 
  }

  useEffect(() => {
    const fetchAppointments = async () => {
      const headers = {
        ...getAuthHeaders(),
        Accept: "application/json",
      };

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/appointments`,
          { headers }
        );
        if (response.status === 401) {
          router.replace('/auth/login');
          return;
        }
        if (!response.ok) {
          throw new Error("An error occurred while fetching appointments.");
        }
        const data = await response.json();
        const mappedEvents = data.records.map((appointment: any) => ({
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
        }));
        setEvents(mappedEvents);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      date: event.start?.toISOString().split("T")[0] || "",
      time:
        event.start?.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }) || "All Day",
      properties: event.extendedProps.properties,
      message: event.extendedProps.message,
      phone: event.extendedProps.phone,
      email: event.extendedProps.email,
      status: event.extendedProps.status,
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => setShowModal(true), 1);
    } else {
      setShowModal(false);
    }
  }, [isModalOpen]);

  const renderEventContent = (eventInfo: any) => {
    const eventTime = eventInfo.event.start
      ? eventInfo.event.start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
      : "All Day";

    return (
      <div className="flex items-center w-full text-xs font-medium bg-gray-100 text-gray-800 px-4 py-2 border-l-4 border-gray-300 cursor-pointer">
        <p className="font-semibold">{eventInfo.event.title}</p>
        <span className="text-sm opacity-80">{eventTime}</span>
      </div>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAcceptSchedule = async () => {
    setIsLoading(true);
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/change-status`,
        {
          id: selectedEvent?.id,
          status: "Accepted",
        },
        {
          headers
        }
      );

      await axios.post("/api/email/viewing/approved", {
        name: selectedEvent?.title,
        email: selectedEvent?.email,
        property: selectedEvent?.properties,
        time: selectedEvent?.time,
        date: selectedEvent?.date,
        status: "Accepted",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("APPROVED!");
    } catch (error) {
      console.error("ERROR", error);
      alert("FAILED");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineSchedule = async () => {
    setIsDeclineLoading(true);
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/change-status`,
        {
          id: selectedEvent?.id,
          status: "Declined",
        },
        {
          headers
        }
      );

      await axios.post("/api/email/viewing/declined", {
        name: selectedEvent?.title,
        email: selectedEvent?.email,
        property: selectedEvent?.properties,
        time: selectedEvent?.time,
        date: selectedEvent?.date,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("DECLINED!");
    } catch (error) {
      console.error("ERROR", error);
      alert("FAILED");
    } finally {
      setIsDeclineLoading(false);
      setIsDeclineModalOpen(false);
    }
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "dayGridMonth,timeGridWeek,timeGridDay",
          center: "title",
          right: "prev,next",
        }}
        events={events}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
      />

      {isModalOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 transition-opacity duration-100 ${showModal ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setIsModalOpen(false)}
          role="dialog"
        >
          <div
            className={`bg-white rounded-lg shadow-lg max-w-md w-full p-6 transform transition-transform duration-500 ${showModal ? "scale-100" : "scale-95"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-semibold">Appointment Details</h2>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className="mt-4">
              <p className="flex gap-2 items-center mb-2">
                <MdOutlineTitle />:{" "}
                <span className="font-medium bg-green-100 rounded px-2">
                  {selectedEvent?.title}
                </span>
              </p>

              <p className="flex gap-2 items-center mb-2">
                <MdAccessTime />:{" "}
                {selectedEvent?.time
                  ? `${selectedEvent?.time}, ${formatDate(selectedEvent?.date)}`
                  : "No time or date available"}
              </p>

              <p className="flex gap-2 items-center mb-2">
                <TbUser />: {selectedEvent?.properties}
              </p>

              <p className="flex gap-2 items-center mb-2">
                <MdOutlineEmail />: {selectedEvent?.email}
              </p>

              <p className="flex gap-2 items-center mb-2">
                <HiMiniDevicePhoneMobile />: {selectedEvent?.phone}
              </p>

              <p className="flex gap-2 items-center mb-2">
                <LuBuilding2 />: {selectedEvent?.properties}
              </p>

              <p className="flex gap-2 items-center mb-2">
                <TbMessageUser />: {selectedEvent?.message}
              </p>

              <p className="flex gap-2 items-center mb-2">
                <TbMessageUser />: {selectedEvent?.status}
              </p>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-100"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button
                className={`px-4 py-2 rounded ${selectedEvent?.status === "Accepted" || selectedEvent?.status === "Declined" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                onClick={handleAcceptSchedule}
                disabled={
                  selectedEvent?.status === "Accepted" ||
                  selectedEvent?.status === "Declined" ||
                  isLoading
                }
              >
                {isLoading ? (
                  <Spinner />
                ) : selectedEvent?.status === "Declined" ? (
                  "Accept"
                ) : selectedEvent?.status === "Accepted" ? (
                  "Accepted"
                ) : (
                  "Accept"
                )}
              </button>

              <button
                className={`px-4 py-2 rounded ${selectedEvent?.status === "Accepted" || selectedEvent?.status === "Declined" ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"}`}
                onClick={() => setIsDeclineModalOpen(true)}
                disabled={
                  selectedEvent?.status === "Accepted" ||
                  selectedEvent?.status === "Declined" ||
                  isDeclineLoading
                }
              >
                {isDeclineLoading ? (
                  <Spinner />
                ) : selectedEvent?.status === "Declined" ? (
                  "Declined"
                ) : (
                  "Decline"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeclineModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 transition-opacity duration-100"
          onClick={() => setIsDeclineModalOpen(false)}
          role="dialog"
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to decline this schedule?
            </h2>
            <div className="flex justify-between gap-2">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-100"
                onClick={() => setIsDeclineModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={handleDeclineSchedule}
                disabled={isDeclineLoading}
              >
                {isDeclineLoading ? <Spinner /> : "Decline"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

const Spinner: React.FC = () => {
  return (
    <div role="status" className="flex items-center justify-center">
      <svg
        aria-hidden="true"
        className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-white"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.6753 75.0917 6.64388C69.2687 2.59025 62.0043 -0.546734 54.1495 0.678577C46.1082 1.94584 39.5487 5.45382 33.8248 10.1652C28.4275 14.6003 24.3076 20.6221 21.7246 27.6091C19.1417 34.596 18.2061 42.5492 18.9766 50.4387C19.7471 58.3281 22.1678 66.0435 26.8837 73.1099C30.8519 78.6907 36.8215 83.6945 43.5466 87.2853C50.2716 90.8761 57.5508 93.1026 65.0716 94.0544C72.5924 94.9992 80.1635 94.6743 87.1537 92.9712C94.1404 91.2688 100.297 88.1226 103.289 83.7676C106.282 79.4127 106.826 74.0567 104.759 68.9988C102.692 63.9406 97.263 59.8669 93.9676 56.5929C92.5857 55.1288 93.4671 52.8048 94.5136 51.5463C96.023 50.5299 97.7817 51.4849 98.2577 52.9892C99.3187 55.9321 98.7303 59.5482 96.9818 61.4257"
          fill="currentFill"
        />
      </svg>
    </div>
  );
};