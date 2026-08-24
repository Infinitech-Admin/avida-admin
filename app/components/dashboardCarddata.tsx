"use client";
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  DropdownItem,
  Spinner,
} from "@heroui/react";
import React, { useState, useMemo } from "react";
import { LuChevronDown, LuSearch } from "react-icons/lu";

interface Field {
  key: string;
  label: string;
  renderValue?: (row: any) => React.ReactNode;
}

interface DataCardProps {
  fields: Field[];
  data: any[];
  label: string;
  description: string;
  filter: boolean;
  statusOptions?: { key: string; label: string }[];
  loading?: boolean;
  renderActions?: (row: any) => React.ReactNode;
  renderTitle?: (row: any) => React.ReactNode;
  onRowClick?: (row: any) => void;
}

const DashboardCardData = ({
  fields,
  data,
  label,
  description,
  statusOptions = [],
  filter,
  loading = false,
  renderActions,
  renderTitle,
  onRowClick,
}: DataCardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(9);
  const [roleFilter, setRoleFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleStatusFilterChange = (selectedKeys: any) => {
    const selectedValue = Array.from(selectedKeys)[0] as string;
    if (
      selectedValue === "rfo" ||
      selectedValue === "pre-selling" ||
      selectedValue === "new" ||
      selectedValue === "all"
    ) {
      setStatusFilter(selectedValue);
    } else if (
      ["fix bugs", "improvement", "closed", "all"].includes(selectedValue)
    ) {
      setTypeFilter(selectedValue);
    } else {
      setRoleFilter(selectedValue);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return [
        "first_name",
        "last_name",
        "email",
        "phone",
        "property_name",
        "unit_type",
        "name",
        "type",
        "properties",
      ].some((key) =>
        String(item[key] ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      );
    });
  }, [searchTerm, data]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setSearchTerm(e.target.value);
  };

  return (
    <Card className="shadow-sm border-2 border-gray-100">
      <CardBody>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4 w-full py-6 px-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-violet-800">{label}</h1>
            <p className="text-gray-500 text-sm">{description || ""}</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full sm:w-auto">
              <Input
                startContent={<LuSearch size={18} />}
                size="lg"
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={onSearchChange}
                className="w-full"
              />
            </div>

            {filter && (
              <div className="flex items-center gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      color="primary"
                      endContent={<LuChevronDown />}
                      size="lg"
                      variant="flat"
                      className="uppercase"
                    >
                      {statusFilter}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Filter by Status"
                    selectionMode="single"
                    selectedKeys={new Set([statusFilter])}
                    onSelectionChange={handleStatusFilterChange}
                  >
                    {statusOptions.map((status) => (
                      <DropdownItem key={status.key}>
                        {status.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}
          </div>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner label="Loading..." />
          </div>
        ) : paginatedData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
            {paginatedData.map((item, index) => (
              <div
                key={item.id ?? index}
                onClick={() => onRowClick?.(item)}
                className={`border border-gray-100 rounded-xl p-4 shadow-sm bg-white flex flex-col gap-3 transition-shadow ${
                  onRowClick
                    ? "cursor-pointer hover:shadow-md hover:border-violet-200"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    {renderTitle ? (
                      renderTitle(item)
                    ) : (
                      <p className="font-semibold truncate">{item.name}</p>
                    )}
                  </div>
                  {renderActions && (
                    <div
                      className="flex items-center gap-2 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {renderActions(item)}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {fields.map((field) => (
                    <div
                      key={field.key}
                      className="flex justify-between gap-2 text-sm"
                    >
                      <span className="text-gray-400 uppercase tracking-wide text-xs pt-0.5">
                        {field.label}
                      </span>
                      <span className="text-gray-700 text-right truncate">
                        {field.renderValue
                          ? field.renderValue(item)
                          : item[field.key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">No data found</div>
        )}

        {/* Footer */}
        <div className="py-4 px-2 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-sm text-gray-500">
            Showing {paginatedData.length} of {filteredData.length} items
          </span>
          <Pagination
            isCompact
            showControls
            color="primary"
            page={currentPage}
            total={totalPages}
            onChange={setCurrentPage}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default DashboardCardData;
