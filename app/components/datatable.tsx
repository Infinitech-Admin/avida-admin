import { FC } from 'react';
import { Toaster } from 'react-hot-toast';
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io';
import { PiCrane } from 'react-icons/pi';

type Column<T> = {
    label: string;
    accessor: (item: T) => string | number | JSX.Element;
    isStatus?: boolean;
    isCategory?: boolean;
    isPrice?: boolean;
};

type DataTableProps<T> = {
    data: T[];
    columns: Column<T>[];
    itemsPerPage: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
};

const DataTable: FC<DataTableProps<any>> = ({
    data,
    columns,
    itemsPerPage,
    currentPage,
    setCurrentPage,
    totalPages,
}) => {

    const renderBadge = (status: string) => {
        let badgeClass = '';

        switch (status) {
            case 'Under Construction':
                status = "UC"
                badgeClass = 'bg-red-200 text-gray-800';
                break;
            case 'New':
                badgeClass = 'bg-green-200 text-gray-800';
                break;
            case 'Ready For Occupancy':
                status = "RFO"
                badgeClass = 'bg-orange-200 text-gray-800';
                break;
            case 'admin listings':
                badgeClass = 'bg-blue-100 text-gray-800';
                break;
            case 'submitted listings':
                badgeClass = 'bg-green-100 text-gray-800';
                break;
            case 'pending':
                badgeClass = 'bg-yellow-200 text-gray-800';
                break;
            default:
                badgeClass = 'bg-gray-500 text-white';
                break;
        }

        return (
            <span className={`min-w-16 inline-flex justify-center items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium ${badgeClass}`}>
                {status}
            </span>
        );
    };

    const renderBadgeCategory = (category: string) => {
        let badgeCategory = '';

        switch (category.toLocaleLowerCase()) {
            case 'bedroom':
                badgeCategory = 'bg-blue-100 text-gray-800';
                break;
        }

        return (
            <span className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium ${badgeCategory}`}>
                {category}
            </span>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(price);
    };

    return (
        <div>
            <div>
                <Toaster position="top-center" reverseOrder={false} />
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead className="divide-y divide-gray-200 border-t-2 border-b-2 text-left">
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index} className="p-2 bg-gray-100 text-gray-700 text-sm">
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 border-b-2">
                        {data && data?.length > 0 ? (
                            data.map((item, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50 text-gray-600">
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className="p-2">
                                            {(() => {
                                                const value = column.accessor(item);

                                                if (column.accessor(item) === item.location) {
                                                    return <span className="line-clamp-1">{value}</span>;
                                                }

                                                if (
                                                    column.accessor(item) === item.description ||
                                                    column.accessor(item) === item.content
                                                ) {
                                                    return <span className="line-clamp-2">{value}</span>;
                                                }

                                                if (column.isPrice && typeof value === "number") {
                                                    return <span>{formatPrice(value)}</span>;
                                                }

                                                if (column.isStatus) {
                                                    return renderBadge(value as string);
                                                }

                                                if (column.isCategory) {
                                                    return renderBadgeCategory(value as string);
                                                }

                                                return value;
                                            })()}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns?.length}
                                    className="text-center p-4 text-gray-500"
                                >
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center mt-4 gap-4">
                <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-2 bg-blue-800 text-white rounded-full disabled:opacity-50"
                >
                    <IoIosArrowDropleft className="h-6 w-6" />
                </button>

                <span>
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-2 py-2 bg-blue-800 text-white rounded-full disabled:opacity-50"
                >
                    <IoIosArrowDropright className="h-6 w-6" />
                </button>
            </div>
        </div>

    );
};

export default DataTable;
