import React from "react";

const EventContent = (eventInfo: any) => {
    const eventTime = eventInfo.event.start
        ? eventInfo.event.start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
          })
        : "All Day";

    // Check event type and set background color
    const bgColor =
        eventInfo.event.title === "Property Viewing"
            ? "bg-green-100 border-l-4 border-l-green-600"
            : eventInfo.event.title === "Property Consultation"
            ? "bg-blue-100 border-l-4 border-l-blue-600"
            : "bg-gray-100 border-l-4 border-l-gray-600";

    return (
        <div className={`flex flex-col w-full text-xs font-medium ${bgColor} text-gray-800 px-4 py-2 border border-gray-300 cursor-pointer`}>
            <p className="font-semibold uppercase">{eventInfo.event.title}</p>
            <p className="text-sm opacity-80">{eventTime}</p>
        </div>
    );
};

export default EventContent;
