"use client";
import React, { useState, useEffect } from "react";
import { getAuthHeaders } from "@/app/utility/auth";
import axios from "axios";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

// ProfileData Type Definition
interface ProfileData {
  name: string;
  position: string;
  email: string;
  phone: string;
  facebook?: string;
  instagram?: string;
  telegram?: string;
  viber?: string;
  whatsapp?: string;
  about?: string;
  image?: File | null;
}

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  position: Yup.string().required("Position is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^\d{11}$/, "Phone number must be exactly 11 digits")
    .required("Phone number is required"),
  facebook: Yup.string().url("Invalid URL").nullable(),
  instagram: Yup.string().url("Invalid URL").nullable(),
  telegram: Yup.string()
    .matches(/^\d{11}$/, "Telegram number must be exactly 11 digits")
    .nullable(),
  viber: Yup.string()
    .matches(/^\d{11}$/, "Viber number must be exactly 11 digits")
    .nullable(),
  whatsapp: Yup.string()
    .matches(/^\d{11}$/, "WhatsApp number must be exactly 11 digits")
    .nullable(),
  about: Yup.string().nullable(),
  image: Yup.mixed().nullable(),
});


const Profile = () => {
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("token");
  const profileID = sessionStorage.getItem("profile_id");
  const userID = sessionStorage.getItem("user_id");
  const authHeaders = getAuthHeaders();

  // Formik initialization
  const formik = useFormik<ProfileData>({
    initialValues: {
      name: "",
      position: "",
      email: "",
      phone: "",
      facebook: "",
      instagram: "",
      telegram: "",
      viber: "",
      whatsapp: "",
      about: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Update user information (JSON payload)
        const userResponse = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
          {
            id: userID,
            name: values.name,
            email: values.email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (userResponse.status !== 200) {
          throw new Error("Failed to update user");
        }

        // Prepare FormData to update the profile
        const formDataToSend = new FormData();
        if (profileID) {
          formDataToSend.append("id", profileID);
        }
        if (userID) {
          formDataToSend.append("user_id", userID);
        }

        formDataToSend.append("name", values.name);
        formDataToSend.append("position", values.position);
        formDataToSend.append("email", values.email);
        formDataToSend.append("phone", values.phone.toString());
        formDataToSend.append("facebook", values.facebook || "");
        formDataToSend.append("instagram", values.instagram || "");
        formDataToSend.append("telegram", values.telegram || "");
        formDataToSend.append("viber", values.viber || "");
        formDataToSend.append("whatsapp", values.whatsapp || "");
        formDataToSend.append("about", values.about || "");
        formDataToSend.append("_method", "PUT");

        if (values.image) {
          formDataToSend.append("image", values.image);
        }

        const profileResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/profiles`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (profileResponse.status !== 200) {
          throw new Error("Failed to update profile");
        }

        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error("Error updating profile");
        console.error("Error updating profile:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  // Fetch profile data
  useEffect(() => {
    if (profileID) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${profileID}`, {
        headers: authHeaders,
      })
        .then((response) => response.json())
        .then((data) => {
          formik.setValues({
            name: data.record.user.name || "",
            position: data.record.position || "",
            email: data.record.user.email || "",
            phone: data.record.phone || "",
            facebook: data.record.facebook || "",
            instagram: data.record.instagram || "",
            telegram: data.record.telegram || "",
            viber: data.record.viber || "",
            whatsapp: data.record.whatsapp || "",
            about: data.record.about || "",
            image: null,
          });
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, [profileID]);

  return (
    <div className="p-4">
      <form
        onSubmit={formik.handleSubmit}
        encType="multipart/form-data"
        className="space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <h1 className="col-span-2 text-gray-500 font-medium">
            Profile Details
          </h1>

          <div className="col-span-2 lg:col-span-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            {formik.errors.name && (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            )}
          </div>

          <div className="col-span-2 lg:col-span-1">
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700"
            >
              Position
            </label>
            <input
              type="text"
              id="position"
              name="position"
              className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
              value={formik.values.position}
              onChange={formik.handleChange}
            />
            {formik.errors.position && (
              <div className="text-red-500 text-sm">
                {formik.errors.position}
              </div>
            )}
          </div>

          <div className="col-span-2">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Avatar
            </label>
            <input
              type="file"
              id="image"
              name="image"
              className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
              accept="image/*"
              onChange={(event) => {
                const file = event.currentTarget.files
                  ? event.currentTarget.files[0]
                  : null;
                formik.setFieldValue("image", file);
              }}
            />
          </div>

          <h1 className="col-span-2 text-gray-500 font-medium mt-4">
            Contact Information
          </h1>

          {[
            { name: "email", label: "Email Address" },
            { name: "phone", label: "Phone Number" },
            { name: "telegram", label: "Telegram" },
            { name: "viber", label: "Viber" },
            { name: "whatsapp", label: "Whatsapp" },
          ].map(({ name, label }) => (
            <div key={name} className="col-span-2 lg:col-span-1">
              <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </label>
              <input
                type="text"
                id={name}
                name={name}
                className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                value={formik.values[name as keyof ProfileData]?.toString()}
                onChange={formik.handleChange}
              />
              {formik.errors[name as keyof ProfileData] && (
                <div className="text-red-500 text-sm">
                  {formik.errors[name as keyof ProfileData] as string}
                </div>
              )}
            </div>
          ))}

          <h1 className="col-span-2 text-gray-500 font-medium mt-4">
            Social Media
          </h1>

          {["facebook", "instagram"].map((social) => (
            <div key={social} className="col-span-2 lg:col-span-1">
              <label
                htmlFor={social}
                className="block text-sm font-medium text-gray-700"
              >
                {social.charAt(0).toUpperCase() + social.slice(1)}
              </label>
              <input
                type="text"
                id={social}
                name={social}
                className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
                value={formik.values[social as keyof ProfileData]?.toString()}
                onChange={formik.handleChange}
              />
              {formik.errors[social as keyof ProfileData] && (
                <div className="text-red-500 text-sm">
                  {formik.errors[social as keyof ProfileData] as string}
                </div>
              )}
            </div>
          ))}

          <div className="col-span-2">
            <label
              htmlFor="about"
              className="block text-sm font-medium text-gray-700"
            >
              About
            </label>
            <textarea
              id="about"
              name="about"
              rows={4}
              className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm"
              value={formik.values.about}
              onChange={formik.handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
