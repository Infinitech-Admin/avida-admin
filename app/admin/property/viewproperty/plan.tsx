import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import BtnLoadingSpinner from "@/app/components/spinner";

interface PropertyDetailsContentProps {
  id: string | null;
}

interface Unit {
  id: string;
  area: number;
  theme: string;
  image: string;
}

interface AddPlan {
  area: number;
  theme: string;
  image: File | null;
}

const MasterPlan: React.FC<PropertyDetailsContentProps> = ({ id }) => {
  const [unitData, setUnitData] = useState<Unit | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<AddPlan>({
    area: 0,
    theme: "",
    image: null,
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnitData = async () => {
    const token = sessionStorage.getItem("token");
    setLoading(true);
    setError(null);

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`,
        { headers },
      );
      setUnitData(response.data.record.plan);
    } catch (err) {
      setError("Failed to load unit data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "image" && files) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddUnit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) {
      alert("Property ID is required to add a unit.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("id", id);
    formDataToSend.append("area", String(formData.area));
    formDataToSend.append("theme", formData.theme);
    formDataToSend.append("property_id", id);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const token = sessionStorage.getItem("token");
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plans`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      await fetchUnitData();
      setFormData({ area: 0, theme: "", image: null });
    } catch (error) {
      const axiosError = error as AxiosError;
      alert(axiosError);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUnit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id || !unitData) {
      alert("Property ID or Unit Data is missing.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("_method", "PUT");
    formDataToSend.append("id", unitData.id);
    formDataToSend.append("property_id", id);
    formDataToSend.append("area", String(formData.area));
    formDataToSend.append("theme", formData.theme);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const token = sessionStorage.getItem("token");
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plans`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      await fetchUnitData();
      setModalOpen(false);
      toast.success("Succesfully update master plan.");
    } catch (error) {
      toast.error("Failed to update master plan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUnitData();
  }, [id]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Unit Details */}
      <div className="col-span-3">
        <div className="flex flex-col">
          {unitData ? (
            <div className="border rounded-lg shadow p-4">
              <h3 className="text-lg font-medium">Unit Details</h3>
              {/* <p><strong>Building ID:</strong> {unitData.id}</p> */}
              <p>
                <strong>Area:</strong> {unitData.area} sqm
              </p>
              <p>
                <strong>Theme:</strong> {unitData.theme}
              </p>
              <img
                src={`https://infinitech-api6.site/properties/plans/${unitData.image}`}
                alt={unitData.theme}
                className="max-w-screen-lg w-full h-[60vh] mt-2 object-cover mx-auto"
              />
              <button
                onClick={() => {
                  setFormData({
                    area: unitData.area,
                    theme: unitData.theme,
                    image: null,
                  });
                  setModalOpen(true);
                }}
                className="mt-4 py-2 px-4 w-full text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          ) : (
            <>
              {/* Form to add new units */}
              <form onSubmit={handleAddUnit} className="col-span-1">
                <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-lg p-4 md:p-5">
                  <div className="w-full mb-3">
                    <label
                      htmlFor="area"
                      className="block text-sm font-medium mb-2"
                    >
                      Unit Area (sqm)
                    </label>
                    <input
                      type="number"
                      name="area"
                      id="area"
                      className="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g., 45"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="w-full mb-3">
                    <label
                      htmlFor="theme"
                      className="block text-sm font-medium mb-2"
                    >
                      Unit Theme
                    </label>
                    <input
                      type="text"
                      name="theme"
                      id="theme"
                      className="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g., Modern"
                      value={formData.theme}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="w-full mb-3">
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium mb-2"
                    >
                      Upload Image
                    </label>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      className="py-3 px-4 block w-full border rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                      onChange={handleInputChange}
                    />
                  </div>
                  {formData.image && (
                    <div className="w-full mb-3">
                      <label className="block text-sm font-medium mb-2">
                        Image Preview
                      </label>
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Preview"
                        className="max-w-full h-auto rounded-lg"
                      />
                    </div>
                  )}
                  <div className="w-full">
                    <button
                      type="submit"
                      className={`w-full py-2 px-3 inline-flex items-center justify-center text-sm font-medium rounded-lg text-white focus:outline-none ${isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
                      disabled={isLoading}
                    >
                      {isLoading ? <BtnLoadingSpinner /> : "Add Master Plan"}
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Update Master Plan</h3>
            <form onSubmit={handleUpdateUnit}>
              <div className="mb-4">
                <label
                  htmlFor="area"
                  className="block text-sm font-medium mb-2"
                >
                  Unit Area (sqm)
                </label>
                <input
                  type="number"
                  name="area"
                  id="area"
                  className="py-2 px-3 w-full border rounded-lg"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="theme"
                  className="block text-sm font-medium mb-2"
                >
                  Unit Theme
                </label>
                <input
                  type="text"
                  name="theme"
                  id="theme"
                  className="py-2 px-3 w-full border rounded-lg"
                  value={formData.theme}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium mb-2"
                >
                  Upload New Image
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  className="py-2 px-3 w-full border rounded-lg"
                  onChange={handleInputChange}
                />
                {formData.image && (
                  <div className="w-full mb-3">
                    <label className="block text-sm font-medium mb-2 ">
                      Image Preview
                    </label>
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                      className="w-full h-[200px] rounded-lg object-contain object-top"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="min-w-[100px] py-2 px-4 bg-gray-300 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-w-[100px] py-2 px-4 bg-blue-600 text-white rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterPlan;
