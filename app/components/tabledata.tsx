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
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  DropdownItem,
  Spinner,
} from "@heroui/react";
import React, { useState, useMemo } from "react";
import { LuChevronDown, LuSearch } from "react-icons/lu";

interface Column {
  key: string;
  label: string;
  renderCell?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  label: string;
  description: string;
  filter: boolean;
  hasStatusFilter?: boolean;
  statusOptions?: { key: string; label: string }[];
  loading?: boolean; // ✅ New loading prop
}

const TableData = ({
  columns,
  data,
  label,
  description,
  statusOptions = [],
  filter,
  loading = false,
  hasStatusFilter = true,
}: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((col) => col.key)
  );
  const [roleFilter, setRoleFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [careerFilter, setCareerFilter] = useState("all");
  const [faqFilter, setFaqFilter] = useState("all");
  const [item, setItem] = useState("all");

  const handleColumnFilterChange = (selectedKeys: any) => {
    setVisibleColumns(Array.from(selectedKeys));
  };

  const handleStatusFilterChange = (selectedKeys: any) => {
    const selectedValue = Array.from(selectedKeys)[0] as string;

    const bedroomOptions = [
      "1 Bedroom",
      "2 Bedroom",
      "3 Bedroom",
      "Tandem Unit",
      "Studio",
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
    const careerOptions = ["referrer", "sub-agent", "broker", "partner"];
    const faqOptions = ["active", "in-active"];
    const inquiries = ["pending", "replied"];

    // Reset all filters first
    setStatusFilter("all");
    setCareerFilter("all");
    setRoleFilter("all");
    setFaqFilter("all");

    if (bedroomOptions.includes(selectedValue) || selectedValue === "all") {
      setStatusFilter(selectedValue);
    } else if (careerOptions.includes(selectedValue)) {
      setCareerFilter(selectedValue);
    } else if (faqOptions.includes(selectedValue)) {
      setFaqFilter(selectedValue);
    } else if (inquiries.includes(selectedValue)) {
      setRoleFilter(selectedValue);
    }
    else {
      setTypeFilter(selectedValue)
    }

    setItem(selectedValue);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = [
        "first_name",
        "last_name",
        "email",
        "phone",
        "property_name",
        "unit_type",
        "type",
        "properties",
        "property_level",
        "property_location",
        "property.name",
        "position",
        "question",
        "answer",
        "headline",
        "name",
        "date",
        "content",
        "message",
        "property",
        "address",
      ].some((key) => {
        const value = key === "property.name" ? item.property?.name : item[key];
        return String(value || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });

      const matchesStatus =
        statusFilter.toLowerCase() === "all" || 
        item.property_type?.toLowerCase() === statusFilter.toLowerCase();
    
      const matchesFaq =
        faqFilter === "all" ||
        item.status?.toLowerCase() === faqFilter.toLowerCase();

      const matchesCareer =
        careerFilter === "all" ||
        item.position?.toLowerCase() === careerFilter.toLowerCase();

      const matchesRole =
        roleFilter === "all" ||
        item.status?.toLowerCase() === roleFilter.toLowerCase();

      const matchesType =
        typeFilter === "all" ||
        item.type?.toLowerCase() === typeFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRole &&
        matchesType &&
        matchesCareer &&
        matchesFaq
      );
    });
  }, [
    searchTerm,
    data,
    visibleColumns,
    columns,
    statusFilter,
    roleFilter,
    typeFilter,
    careerFilter,
    faqFilter,
  ]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setSearchTerm(e.target.value);
  };

  return (
    <Card className="shadow-sm border-2 border-gray-100">
      <CardBody>
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
                onChange={(e) => onSearchChange(e)}
                className="w-full"
              />
            </div>

            {filter === false ? null : (
              <div className="flex items-center gap-2">
                {hasStatusFilter && (
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        color="primary"
                        endContent={<LuChevronDown />}
                        size="lg"
                        variant="flat"
                        className="uppercase"
                      >
                        {item}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Filter by Status"
                      selectionMode="single"
                      disabledKeys={new Set([item])}
                      selectedKeys={new Set([item])}
                      onSelectionChange={handleStatusFilterChange}
                    >
                      {statusOptions.map((status) => (
                        <DropdownItem key={status.key}>
                          {status.label}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                )}

                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      color="primary"
                      endContent={<LuChevronDown />}
                      size="lg"
                      variant="flat"
                    >
                      Show Columns
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Table Columns"
                    closeOnSelect={false}
                    selectionMode="multiple"
                    selectedKeys={new Set(visibleColumns)}
                    onSelectionChange={handleColumnFilterChange}
                  >
                    {columns.map((column) => (
                      <DropdownItem key={column.key}>
                        {column.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <Table>
            <TableHeader>
              {columns
                .filter((col) => visibleColumns.includes(col.key))
                .map((column) => (
                  <TableColumn className="uppercase" key={column.key}>
                    {column.label}
                  </TableColumn>
                ))}
            </TableHeader>
            <TableBody
              loadingState={loading ? "loading" : "idle"}
              loadingContent={<Spinner label="Loading..." />}
              emptyContent={"No data found"}
            >
              {loading ? (
                <></> // Skip rendering rows while loading
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <TableRow key={index}>
                    {columns
                      .filter((col) => visibleColumns.includes(col.key))
                      .map((column) => (
                        <TableCell key={column.key}>
                          {column.renderCell
                            ? column.renderCell(item)
                            : item[column.key]}
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              ) : (
                []
              )}
            </TableBody>
          </Table>
        </div>

        <div className="py-2 px-2 flex justify-between items-center">
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

export default TableData;
