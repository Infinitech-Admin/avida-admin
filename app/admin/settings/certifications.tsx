import React, { useState } from "react";
import { Button } from "@heroui/button";
import { LuPenSquare, LuTrash2 } from "react-icons/lu";
import AddCertificates from "./certificates/addcertificates";
import DeleteConfirmationModal from "@/app/components/modal/deletemodal";
import toast from "react-hot-toast";
import { getAuthHeaders } from "@/app/utility/auth";
import useSWR from "swr";
import UpdateCertificates from "./certificates/editcertificates";

interface Certificate {
    id: string;
    title: string;
    description: string;
    date: string;
    image: string; // URL or path to the image
    user_id: string; // ✅ Required but missing
}



const Certificate = () => {
    // Fetch certificates with SWR
    const { data, error, mutate } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/api/certificates`,
        fetchCertificates
    );

    // States for delete modal
    const [certificateToDelete, setCertificateToDelete] = useState<string | null>(
        null
    );
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);

    // Fetch certificates with authentication
    async function fetchCertificates(url: string) {
        try {
            const headers = getAuthHeaders();
            const res = await fetch(url, {
                method: "GET",
                headers: headers,
            });

            if (!res.ok) {
                throw new Error("Failed to fetch certificates");
            }

            const responseData = await res.json();
            return responseData.records.sort(
                (a: Certificate, b: Certificate) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            );
        } catch (error) {
            console.error("Error fetching certificates:", error);
            throw error;
        }
    }

    // Open delete modal
    const handleDeleteClick = (certificateId: string) => {
        setCertificateToDelete(certificateId);
        setDeleteModalOpen(true);
    };

    // Confirm delete certificate
    const confirmDeleteCertificate = async () => {
        if (!certificateToDelete) return;

        setDeleteBtnLoading(true);
        try {
            await deleteCertificate(certificateToDelete);
            toast.success("Certificate deleted successfully!");
            setDeleteModalOpen(false);
            mutate();
        } catch (error) {
            console.error("Error deleting certificate:", error);
            toast.error("Error deleting certificate.");
        } finally {
            setDeleteBtnLoading(false);
        }
    };

    // Delete certificate API call
    const deleteCertificate = async (certificateId: string) => {
        try {
            const headers = getAuthHeaders();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/certificates/${certificateId}`,
                {
                    method: "DELETE",
                    headers: headers,
                }
            );

            if (!res.ok) {
                throw new Error("Failed to delete certificate");
            }
        } catch (error) {
            console.error("Error deleting certificate:", error);
            throw error;
        }
    };

    // Format date to "Month Year"
    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long" };
        return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
    };

    // Group certificates by month and year
    const groupByMonth = (certificates: Certificate[]) => {
        return certificates.reduce(
            (groups: { [key: string]: Certificate[] }, certificate: Certificate) => {
                const monthYear = formatDate(certificate.date);
                if (!groups[monthYear]) {
                    groups[monthYear] = [];
                }
                groups[monthYear].push(certificate);
                return groups;
            },
            {}
        );
    };

    // Grouped certificates
    const groupedCertificates = data ? groupByMonth(data) : {};

    return (
        <div>
            {/* Header Section */}
            <div className="flex justify-between items-center w-full py-2 mb-4">
                <div>
                    <h1 className="text-2xl font-semibold">Certificates</h1>
                    <p className="text-sm text-default-500">
                        Overview and management of all certificates.
                    </p>
                </div>
                <div>
                    <AddCertificates mutate={mutate} />
                </div>
            </div>

            {/* Certificate List */}
            {Object.keys(groupedCertificates).map((monthYear) => (
                <div key={monthYear}>
                    <div className="ps-3 my-2 first:mt-0">
                        <h3 className="text-xs font-medium uppercase text-gray-500">
                            {monthYear}
                        </h3>
                    </div>
                    {groupedCertificates[monthYear].map((certificate) => (
                        <div key={certificate.id}>
                            <div className="flex gap-x-3 relative group rounded-lg hover:bg-gray-100">
                                <a className="z-[1] absolute inset-0" href="#"></a>
                                <div className="relative last:after:hidden after:absolute after:top-0 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200">
                                    <div className="relative z-10 size-7 flex justify-center items-center">
                                        <div className="size-2 rounded-full bg-white border-2 border-gray-300 group-hover:border-gray-600"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between w-full p-2">
                                    <div className="grow">
                                        <h3 className="flex gap-x-1.5 font-semibold text-gray-800">
                                            {certificate.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {certificate.description}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 z-10">
                                        {/* Edit Button */}
                                        <UpdateCertificates
                                            certificate={certificate}
                                            onUpdateSuccess={() => mutate()}
                                        />

                                        {/* Delete Button */}
                                        <Button
                                            isIconOnly
                                            startContent={<LuTrash2 size={18} />}
                                            variant="flat"
                                            color="danger"
                                            onPress={() => handleDeleteClick(certificate.id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDeleteCertificate}
                deleteBtnLoading={deleteBtnLoading}
                message="Are you sure you want to delete this certificate?"
            />
        </div>
    );
};

export default Certificate;
