"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface PropertyFormData {
  user_id: string | null;
  property_id: string;
  property_location: string;
  property_type: string;
  property_size: string;
  property_price: string;
  property_building: string;
  property_level: string;
  property_parking: string;
  property_amenities: string[];
  images: File[];
  property_description: string;
  property_plan_type: string;
  property_plan_cut: string;
  property_plan_status: string;
  property_plan_image: string | File;
  property_furnishing_status: string;
  property_furnishing_items: string[];

}

interface PropertyFormContextProps {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
}

const PropertyFormContext = createContext<PropertyFormContextProps | undefined>(
  undefined
);

// Get user_id from sessionStorage (only on the client side)
const user_id =
  typeof window !== "undefined" ? sessionStorage.getItem("user_id") : null;

export const PropertyFormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    user_id: user_id, // Initial value for user_id
    property_id: "",
    property_location: "",
    property_type: "",
    property_size: "",
    property_price: "",
    property_building: "",
    property_level: "",
    property_parking: "N/A", // ✅ Default value set
    property_amenities: [],
    images: [],
    property_description: "",
    property_plan_type: "",
    property_plan_cut: "",
    property_plan_status: "",
    property_plan_image: "",
    property_furnishing_status: "", // Default value for property_furnishing_status
    property_furnishing_items: [], // Default value for property_furnishing_items
  });

  // Load form data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFormData = localStorage.getItem("formData");
      if (savedFormData) {
        setFormData(JSON.parse(savedFormData)); // Load saved data from localStorage
      }
    }
  }, []);

  // Persist formData to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined" && formData) {
      localStorage.setItem("formData", JSON.stringify(formData)); // Save form data to localStorage
    }
  }, [formData]);

  return (
    <PropertyFormContext.Provider value={{ formData, setFormData }}>
      {children}
    </PropertyFormContext.Provider>
  );
};

// Custom hook to access form data and setter
export const usePropertyForm = () => {
  const context = useContext(PropertyFormContext);
  if (!context)
    throw new Error(
      "usePropertyForm must be used within a PropertyFormProvider"
    );
  return context;
};
