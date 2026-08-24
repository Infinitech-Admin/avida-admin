"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Select,
  SelectItem,
  Textarea,
  Checkbox,
  Autocomplete,
  AutocompleteItem,
  Image,
} from "@heroui/react";
import { LuArrowLeft, LuArrowRight, LuImage, LuUpload } from "react-icons/lu";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  amenitiesData,
  masterPlan,
  masterPlanCut,
  masterPlanStatus,
} from "@/app/utility/data";

type Props = {
  property: any;
  properties: any[];
};

const EditForm = ({ property, properties }: Props) => {
  const router = useRouter();
  const initialImages = (
    typeof property.images === "string"
      ? JSON.parse(property.images)
      : property.images || []
  ).map((image: string) => {
    return `https://infinitech-api6.site/properties/images/${image}`;
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>(initialImages);
  const steps = [
    "PropertyDetails",
    "FurnishingStatus",
    "PropertyAmenities",
    "MasterPlan",
    "PropertyImages",
  ];

  const accessToken =
    typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
  const user_id =
    typeof window !== "undefined" ? sessionStorage.getItem("user_id") : null;

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [planPreviews, setPlanPreviews] = useState<string | null>(null);
  const [furnishingInput, setFurnishingInput] = useState<string>("");

  const [formData, setFormData] = useState<any>({
    _method: "PUT",
    id: property.id,
    user_id: user_id,
    property_id: property.property_id,
    property_location: property.property_location,
    property_type: property.property_type,
    property_size: property.property_size,
    property_price: property.property_price,
    property_building: property.property_building,
    property_level: property.property_level,
    property_parking: "N/A",
    property_description: property.property_description,
    property_amenities: property.property_amenities
      ? JSON.parse(property.property_amenities)
      : [],
    images: [],
    property_plan_type: property.property_plan_type,
    property_plan_cut: property.property_plan_cut,
    property_plan_status: property.property_plan_status,
    property_plan_image: property.property_plan_image,
    property_furnishing_status: property.property_furnishing_status || "",
    property_furnishing_items: property.property_furnishing_items || [],
  });
  const unitTypeOptions = [
    "Studio",
    "1 Bedroom",
    "2 Bedroom",
    "3 Bedroom",
    "Tandem Unit",
    "Studio w/ Parking",
    "1 Bedroom w/ Parking",
    "2 Bedroom w/ Parking",
    "3 Bedroom w/ Parking",
    "Tandem Unit w/ Parking",
    "Studio w/ Tandem Parking",
    "1 Bedroom w/ Tandem Parking",
    "2 Bedroom w/ Tandem Parking",
    "3 Bedroom w/ Tandem Parking",
    "Tandem Unit w/ Tandem Parking",
    "1 Parking Slot",
    "Tandem Parking",
  ];
  const handleAmenityChange = (item: string) => {
    setFormData((prev: any) => ({
      ...prev,
      property_amenities: prev.property_amenities.includes(item)
        ? prev.property_amenities.filter((amenity: string) => amenity !== item)
        : [...prev.property_amenities, item],
    }));
  };

  useEffect(() => {
    if (property.image) {
      try {
        const imageArray = JSON.parse(property.image); // Assuming it's stored as a stringified array
        const imageUrls = imageArray.map(
          (filename: string) =>
            `https://infinitech-api6.site/properties/images/${filename}`,
        );
        setImagePreviews(imageUrls);
      } catch (error) {
        console.error("Error parsing property.image JSON:", error);
      }
    } else {
      const imageUrl = `https://infinitech-api6.site/properties/images/${property.property_plan_image}`;
      setPlanPreviews(imageUrl);
    }
  }, [property.image, property.property_plan_image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

      setFormData((prev: any) => ({
        ...prev,
        images: [...(prev.images || []), ...newFiles], // merge new files
      }));

      setImagePreviews([...newPreviews]);
    }
  };

  const handlePlanImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev: any) => ({
      ...prev,
      property_plan_image: file,
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPlanPreviews(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    console.log("Form Data before submission:", formData); // Log form data
    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      };

      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (key === "images") {
            value.forEach((file) => form.append("images[]", file));
          } else {
            form.append(key, JSON.stringify(value));
          }
        } else if (key === "property_plan_image" && value instanceof File) {
          form.append(key, value);
        } else if (value !== null && value !== undefined) {
          form.append(key, String(value));
        }
      });

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/property`,
        form,
        { headers },
      );

      toast.success("Property updated successfully!");
      router.push("/admin/properties");
    } catch (error) {
      toast.error("An error occurred while submitting.");
    } finally {
      setLoading(false);
    }
  };

  const PropertyDetails = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-full py-4">
        <h1 className="text-blue-700 font-bold text-xl uppercase">
          Property Details
        </h1>
        <p className="text-gray-500 mb-2 text-sm max-w-2xl">
          Provide information about the property, including its name, location,
          and key features. This will help potential buyers or renters get a
          better idea of what the property offers.
        </p>
        <Divider />
      </div>

      <div>
        <Autocomplete
          label="Property Name"
          isRequired
          size="lg"
          name="property_id"
          labelPlacement="outside"
          placeholder="Select Property"
          variant="bordered"
          defaultSelectedKey={formData.property_id}
          onSelectionChange={(selected) =>
            setFormData({
              ...formData,
              property_id: selected?.toString() || "",
            })
          }
        >
          {(properties || []).map((item: { id: string; name: string }) => (
            <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
          ))}
        </Autocomplete>
      </div>

      <div className="col-span-2">
        <Input
          value={formData.property_location || ""}
          isRequired
          size="lg"
          type="text"
          variant="bordered"
          label="Location"
          name="property_location"
          labelPlacement="outside"
          placeholder="eg., Guadalupe Viejo, Makati City"
          onChange={(e) =>
            setFormData({ ...formData, property_location: e.target.value })
          }
        />
      </div>

      <div>
        <Select
          value={formData.property_type || ""}
          isRequired
          size="lg"
          variant="bordered"
          label="Unit/PS Type"
          name="property_type"
          labelPlacement="outside"
          placeholder="Select Unit/PS Type"
          onChange={(e) =>
            setFormData({ ...formData, property_type: e.target.value })
          }
          selectedKeys={[formData.property_type]}
        >
          {unitTypeOptions.map((type) => (
            <SelectItem key={type}>{type}</SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <Input
          value={formData.property_size}
          isRequired
          size="lg"
          type="text"
          variant="bordered"
          label="Unit Size (sqm)"
          name="property_size"
          labelPlacement="outside"
          placeholder="eg., 0.0"
          onChange={(e) =>
            setFormData({ ...formData, property_size: e.target.value })
          }
        />
      </div>

      <div>
        <Input
          value={formData.property_price}
          isRequired
          size="lg"
          type="text"
          variant="bordered"
          label="Price"
          name="property_price"
          labelPlacement="outside"
          placeholder="eg., 500,000"
          onChange={(e) =>
            setFormData({ ...formData, property_price: e.target.value })
          }
        />
      </div>

      <div className="col-span-2">
        <Input
          value={formData.property_building || ""}
          isRequired
          size="lg"
          type="text"
          variant="bordered"
          label="Building"
          name="property_building"
          labelPlacement="outside"
          placeholder="eg., Tower 1"
          onChange={(e) =>
            setFormData({ ...formData, property_building: e.target.value })
          }
        />
      </div>

      <div>
        <Input
          value={formData.property_level || ""}
          isRequired
          size="lg"
          type="text"
          variant="bordered"
          label="Floor Level"
          name="property_level"
          labelPlacement="outside"
          placeholder="eg., 16H"
          onChange={(e) =>
            setFormData({ ...formData, property_level: e.target.value })
          }
        />
      </div>

      {/* <div>
        <Select
          defaultSelectedKeys={[formData.property_parking]}
          isRequired
          size="lg"
          variant="bordered"
          label="Parking"
          name="property_parking"
          labelPlacement="outside"
          placeholder="Select Parking"
          onChange={(e) =>
            setFormData({ ...formData, property_parking: e.target.value })
          }
        >
          <SelectItem key="With Parking">With Parking</SelectItem>
          <SelectItem key="With Tandem Parking">With Tandem Parking</SelectItem>
          <SelectItem key="N/A">N/A</SelectItem>
        </Select>
      </div> */}

      <div className="col-span-full">
        <Textarea
          value={formData.property_description || ""}
          size="lg"
          isRequired
          variant="bordered"
          label="Description"
          name="property_description"
          labelPlacement="outside"
          placeholder="Short description about the property/unit..."
          onChange={(e) =>
            setFormData({ ...formData, property_description: e.target.value })
          }
        />
      </div>
    </div>
  );
  const FurnishingStatus = (
    <div className="col-span-full py-4">
      <h1 className="text-blue-700 font-bold text-xl uppercase">
        Furnishing Status
      </h1>
      <p className="text-gray-500 mb-2 text-sm max-w-2xl">
        Specify the furnishing status of the property. If the unit is
        Semi-Furnished or Fully Furnished, you can list down all included items
        such as appliances or furniture.
      </p>
      <Divider />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <Select
          isRequired
          size="lg"
          variant="bordered"
          label="Furnishing Status"
          placeholder="Select Furnishing Status"
          labelPlacement="outside"
          name="property_furnishing_status"
          selectedKeys={[formData.property_furnishing_status]}
          onChange={(e) =>
            setFormData({
              ...formData,
              property_furnishing_status: e.target.value,
            })
          }
        >
          <SelectItem key="Bare">Bare</SelectItem>
          <SelectItem key="Semi-Furnished">Semi-Furnished</SelectItem>
          <SelectItem key="Fully Furnished">Fully Furnished</SelectItem>
        </Select>
      </div>

      {(formData.property_furnishing_status === "Semi-Furnished" ||
        formData.property_furnishing_status === "Fully Furnished") && (
        <>
          <div className="flex items-center gap-3 mt-6">
            <Input
              size="lg"
              placeholder="Enter item (e.g., Refrigerator)"
              value={furnishingInput}
              onChange={(e) => setFurnishingInput(e.target.value)}
            />
            <Button
              size="lg"
              color="primary"
              onPress={() => {
                if (furnishingInput.trim()) {
                  setFormData({
                    ...formData,
                    property_furnishing_items: [
                      ...(formData.property_furnishing_items || []),
                      furnishingInput.trim(),
                    ],
                  });
                  setFurnishingInput("");
                }
              }}
            >
              Add
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
            {(formData.property_furnishing_items || []).map(
              (item: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                >
                  <span className="text-gray-700 text-sm">{item}</span>
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        property_furnishing_items:
                          formData.property_furnishing_items.filter(
                            (_: string, i: number) => i !== index,
                          ),
                      });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ),
            )}
          </div>
        </>
      )}
    </div>
  );
  const PropertyAmenities = (
    <div className="col-span-full py-4">
      <h1 className="text-blue-700 font-bold text-xl uppercase">Amenities</h1>
      <p className="text-gray-500 mb-2 text-sm max-w-2xl">
        List the amenities available at the property, such as parking, swimming
        pool, gym, or any other features that make the property more attractive
        to potential buyers or renters.
      </p>
      <Divider />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
        {amenitiesData.map((item: any, index: number) => (
          <Checkbox
            key={index}
            name="property_amenities"
            isSelected={formData.property_amenities.includes(item.item)}
            onChange={() => handleAmenityChange(item.item)}
          >
            {item.item}
          </Checkbox>
        ))}
      </div>
    </div>
  );

  const MasterPlan = (
    <div className="col-span-full py-4">
      <h1 className="text-blue-700 font-bold text-xl uppercase">Master Plan</h1>
      <p className="text-gray-500 mb-2 text-sm max-w-2xl">
        Add details about the unit cut, furnishing status, and development type.
        This helps define the layout, interior finishes, and overall structure
        of the property.
      </p>
      <Divider />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
        <div>
          <Select
            isRequired
            size="lg"
            variant="bordered"
            label="Development Type"
            placeholder="Select Development Type"
            labelPlacement="outside"
            name="property_plan_type"
            defaultSelectedKeys={formData.property_plan_type}
            onChange={(e) =>
              setFormData({ ...formData, property_plan_type: e.target.value })
            }
            selectedKeys={[formData.property_plan_type]}
          >
            {masterPlan.map((item) => (
              <SelectItem key={item.key}>{item.key}</SelectItem>
            ))}
          </Select>
        </div>
        <div>
          <Select
            isRequired
            size="lg"
            variant="bordered"
            label="Unit Cut"
            placeholder="Select Unit Cut"
            labelPlacement="outside"
            name="property_plan_cut"
            onChange={(e) =>
              setFormData({ ...formData, property_plan_cut: e.target.value })
            }
            selectedKeys={[formData.property_plan_cut]}
          >
            {masterPlanCut.map((item) => (
              <SelectItem key={item.key}>{item.key}</SelectItem>
            ))}
          </Select>
        </div>

        <div>
          <Select
            isRequired
            size="lg"
            variant="bordered"
            label="Unit Status"
            placeholder="Select Unit Status"
            labelPlacement="outside"
            name="property_plan_status"
            onChange={(e) =>
              setFormData({ ...formData, property_plan_status: e.target.value })
            }
            selectedKeys={[formData.property_plan_status]}
          >
            {masterPlanStatus.map((item) => (
              <SelectItem key={item.key}>{item.key}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="col-span-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="flex flex-wrap items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer relative w-full h-72"
              onClick={() => {
                const fileInput = document.getElementById(
                  "file-input",
                ) as HTMLInputElement | null;
                if (fileInput) {
                  fileInput.click();
                }
              }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
                <div className="flex flex-col justify-center items-center text-center">
                  <div>
                    <LuUpload size={72} />
                  </div>
                  <div>
                    <h1>Click to Upload Images</h1>
                    <p className="text-sm text-gray-500 mt-2">
                      Supported formats: JPEG, PNG, GIF, BMP, TIFF, and more.
                    </p>
                  </div>
                </div>
              </div>
              <Input
                id="file-input"
                type="file"
                multiple
                className="hidden"
                onChange={handlePlanImageChange}
              />
            </div>
            <div>
              {planPreviews === null ? (
                <div className="flex flex-wrap items-center justify-center bg-gray-200 rounded-lg p-6  relative w-full h-72">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
                    <div className="flex flex-col justify-center items-center text-center">
                      <div>
                        <LuImage size={72} />
                      </div>
                      <div>
                        <h1>No Selected Image</h1>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex w-full h-72 bg-gray-200 justify-center items-center">
                  <Image
                    src={planPreviews}
                    alt={`preview`}
                    className="w-full max-h-72 object-cover object-center py-4 rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PropertyImages = (
    <div className="flex flex-col gap-6">
      <div
        className="flex flex-wrap items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer relative w-full h-48"
        onClick={() => {
          const fileInput = document.getElementById(
            "file-input",
          ) as HTMLInputElement | null;
          if (fileInput) {
            fileInput.click();
          }
        }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
          <div className="flex flex-col justify-center items-center text-center">
            <LuImage size={72} />
            <h1>Click to Upload Images</h1>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: JPEG, PNG, GIF, BMP, TIFF, and more.
            </p>
          </div>
        </div>
        <Input
          id="file-input"
          type="file"
          multiple
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="relative w-32 h-32">
            <img
              src={preview}
              alt={`preview-${index}`}
              className="w-full h-full object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {property && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div
                  className="bg-blue-100 p-2 rounded-full text-blue-800 cursor-pointer"
                  onClick={() => router.push("/admin/properties")}
                >
                  <LuArrowLeft />
                </div>
                <h1 className="font-semibold text-2xl text-blue-800 uppercase">
                  Edit properties
                </h1>
              </div>
            </CardHeader>
            <CardBody>
              {/* Render the step component dynamically */}
              <>
                {activeStep === 0 && PropertyDetails}
                {activeStep === 1 && FurnishingStatus}
                {activeStep === 2 && PropertyAmenities}
                {activeStep === 3 && MasterPlan}
                {activeStep === 4 && PropertyImages}
              </>
            </CardBody>
            <CardFooter>
              <div className="flex justify-end gap-4">
                {activeStep > 0 && (
                  <Button
                    startContent={<LuArrowLeft size={18} />}
                    size="lg"
                    onPress={() => setActiveStep((prev) => prev - 1)}
                    className={
                      activeStep === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    Back
                  </Button>
                )}
                {activeStep < steps.length - 1 ? (
                  <Button
                    endContent={<LuArrowRight size={18} />}
                    size="lg"
                    color="primary"
                    onPress={() => setActiveStep((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    isLoading={loading}
                    endContent={<LuArrowRight size={18} />}
                    size="lg"
                    color="primary"
                    onPress={handleSubmit}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </>
      )}
    </>
  );
};

export default EditForm;
