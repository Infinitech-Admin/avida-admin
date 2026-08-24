export const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "No date available";

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch (error) {
        return "Invalid date";
    }
};

export const formatTime = (timeString: string | null | undefined): string => {
    if (!timeString) return "No time available";

    try {
        // Create a new date object using current date and provided time
        const [hours, minutes, seconds] = timeString.split(":").map(Number);
        const date = new Date();
        date.setHours(hours || 0, minutes || 0, seconds || 0);

        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    } catch (error) {
        return "Invalid time";
    }
};
