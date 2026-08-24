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
  statusOptions?: { key: string; label: string }[];
  loading?: boolean;
  onRowClick?: (row: any) => void;
  /** key of the column that holds action buttons — shown top-right on cards, last column on table */
  actionsKey?: string;
  /**
   * Field paths to search against. Supports nested paths via dot
   * notation (e.g. "property.name"). Defaults to the original flat
   * field list so existing usages keep working unchanged.
   */
  searchKeys?: string[];
}

const DEFAULT_SEARCH_KEYS = [
  "first_name",
  "last_name",
  "email",
  "phone",
  "property_name",
  "unit_type",
  "name",
  "type",
  "properties",
];

// Resolves a possibly-nested field path (e.g. "property.name") against
// an object, safely returning "" if any segment along the way is
// null/undefined instead of throwing — so a row with a broken relation
// just doesn't match the search instead of crashing the table.
const getFieldValue = (item: any, path: string): string => {
  const value = path
    .split(".")
    .reduce(
      (acc, key) => (acc === null || acc === undefined ? acc : acc[key]),
      item,
    );
  return String(value ?? "");
};

const DashboardResponsiveTable = ({
  columns,
  data,
  label,
  description,
  statusOptions = [],
  filter,
  loading = false,
  onRowClick,
  actionsKey = "actions",
  searchKeys = DEFAULT_SEARCH_KEYS,
}: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((col) => col.key),
  );
  const [roleFilter, setRoleFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleColumnFilterChange = (selectedKeys: any) => {
    setVisibleColumns(Array.from(selectedKeys));
  };

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
    const term = searchTerm.toLowerCase();
    if (!term) return data;

    return data.filter((item) =>
      searchKeys.some((key) =>
        getFieldValue(item, key).toLowerCase().includes(term),
      ),
    );
  }, [searchTerm, data, searchKeys]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setSearchTerm(e.target.value);
  };

  // Column split for card view
  const titleColumn = columns[0];
  const actionsColumn = columns.find((c) => c.key === actionsKey);
  const bodyColumns = columns.filter(
    (c) => c.key !== titleColumn?.key && c.key !== actionsKey,
  );

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

        {/* ============ DESKTOP: TABLE (md and up) ============ */}
        <div className="hidden md:block overflow-x-auto rounded-lg">
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
                <></>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <TableRow
                    key={item.id ?? index}
                    onClick={() => onRowClick?.(item)}
                    className={
                      onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                    }
                  >
                    {columns
                      .filter((col) => visibleColumns.includes(col.key))
                      .map((column) => (
                        <TableCell
                          key={column.key}
                          onClick={(e) => {
                            if (column.key === actionsKey) e.stopPropagation();
                          }}
                        >
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

        {/* ============ MOBILE: CARDS (below md) ============ */}
        <div className="md:hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner label="Loading..." />
            </div>
          ) : paginatedData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
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
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      {titleColumn?.renderCell
                        ? titleColumn.renderCell(item)
                        : item[titleColumn?.key ?? ""]}
                    </div>
                    {actionsColumn && (
                      <div
                        className="flex items-center gap-1 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {actionsColumn.renderCell
                          ? actionsColumn.renderCell(item)
                          : null}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    {bodyColumns
                      .filter((col) => visibleColumns.includes(col.key))
                      .map((column) => (
                        <div
                          key={column.key}
                          className="flex justify-between gap-2 text-sm"
                        >
                          <span className="text-gray-400 uppercase tracking-wide text-xs pt-0.5 shrink-0">
                            {column.label}
                          </span>
                          <span className="text-gray-700 text-right truncate">
                            {column.renderCell
                              ? column.renderCell(item)
                              : item[column.key]}
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
        </div>

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

export default DashboardResponsiveTable;
