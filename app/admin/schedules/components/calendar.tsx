"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { fetchAppointments } from "../utils/api";
import EventContent from "./eventcontent";
import EventDetailsModal from "./eventdetails";
import { date } from "yup";

const Calendar: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const router = useRouter();

    // ✅ Fetch Appointments on Component Mount
    useEffect(() => {
        const getAppointments = async () => {
            try {
                const data = await fetchAppointments(router);
                setEvents(data);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };
        getAppointments();
    }, [router]);

    // ✅ Handle Event Click and Open Modal
    const handleEventClick = (clickInfo: any) => {

    
        setSelectedEvent({
            id: clickInfo.event.id,
            title: clickInfo.event.extendedProps?.type || clickInfo.event.title,
            start: clickInfo.event.start
                ? clickInfo.event.start.toISOString()
                : `${clickInfo.event.extendedProps?.date}T${clickInfo.event.extendedProps?.time}`,
            properties: clickInfo.event.extendedProps?.properties || "No properties available",
            date: clickInfo.event.extendedProps?.date || clickInfo.event.start?.toISOString().split("T")[0] || "",
            time: clickInfo.event.extendedProps?.time || clickInfo.event.start?.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }) || "",
            message: clickInfo.event.extendedProps?.message || "No message provided",
            phone: clickInfo.event.extendedProps?.phone || "N/A",
            email: clickInfo.event.extendedProps?.email || "N/A",
            status: clickInfo.event.extendedProps?.status || "Pending",
            location: clickInfo.event.extendedProps?.location || "No location provided",
            name: clickInfo.event.extendedProps?.name || "Unknown", // Corrected here
            notes: clickInfo.event.extendedProps?.notes || "No additional notes",
        });
        
        setIsModalOpen(true);
    };
    




    return (
        <div className="p-4">
            {/* ✅ FullCalendar Component */}
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
                eventContent={EventContent}
            />

            {/* ✅ Event Details Modal */}
            {isModalOpen && selectedEvent && (
                <EventDetailsModal
                    event={selectedEvent}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Calendar;
