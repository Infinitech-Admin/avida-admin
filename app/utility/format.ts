export const filterMaxPrice = (maxPrice: string | number): string => {
    // Convert number to string if needed
    const priceStr = typeof maxPrice === "number" ? maxPrice.toString() : maxPrice;

    const priceMap: { [key: string]: string } = {
        "1": "1BR",
        "2": "2BR",
        "3": "Studio Type",
        "4": "Loft",
    };

    // Return mapped value or default to showing the price with "BR"
    return priceMap[priceStr] || `${priceStr}`;
};

export const priceFormatted = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 0,
    }).format(amount);
};