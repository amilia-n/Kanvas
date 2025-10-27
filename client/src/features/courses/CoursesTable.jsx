import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

export default function CoursesTable({
  data = [],
  pageSize = 10,
  autoExpandOfferings = false,
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  React.useEffect(() => {
    if (autoExpandOfferings && data.length > 0) {
      const allExpanded = {};
      data.forEach((_, index) => {
        allExpanded[String(index)] = true;
      });
      setExpanded(allExpanded);
    }
  }, [autoExpandOfferings, data]);

  React.useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, data]);

  const paginationInfo = React.useMemo(() => {
    const allOfferingsFlat = [];
    data.forEach((course) => {
      const offerings = course.offerings || [];
      offerings.forEach((offering) => {
        allOfferingsFlat.push({
          ...offering,
          courseId: course.id,
          courseCode: course.code,
          courseName: course.name,
        });
      });
    });

    const totalOfferings = allOfferingsFlat.length;
    const totalPages = Math.ceil(totalOfferings / pageSize) || 1;

    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const pageOfferings = allOfferingsFlat.slice(startIndex, endIndex);

    const coursesMap = new Map();
    pageOfferings.forEach((offering) => {
      if (!coursesMap.has(offering.courseId)) {
        coursesMap.set(offering.courseId, {
          id: offering.courseId,
          code: offering.courseCode,
          name: offering.courseName,
          offerings: [],
        });
      }
      coursesMap.get(offering.courseId).offerings.push(offering);
    });

    const paginatedData = Array.from(coursesMap.values());

    return {
      paginatedData,
      totalOfferings,
      currentPageOfferings: pageOfferings.length,
      totalPages,
      canPreviousPage: currentPage > 0,
      canNextPage: currentPage < totalPages - 1,
    };
  }, [data, pageSize, currentPage]);

  const columns = React.useMemo(
    () => [
      {
        id: "expander",
        header: "",
        size: 50,
        cell: ({ row }) => {
          const hasOfferings = row.original.offerings?.length > 0;
          if (!hasOfferings) return null;

          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((prev) => ({
                  ...prev,
                  [row.id]: !prev[row.id],
                }));
              }}
              className="p-1"
            >
              {expanded[row.id] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          );
        },
      },
      {
        accessorKey: "code",
        header: "Code",
        size: 150,
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("code")}</span>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        size: undefined,
        cell: ({ row }) => row.getValue("name"),
      },
      {
        accessorKey: "offerings",
        header: "Offerings",
        size: 120,
        cell: ({ row }) => {
          const offerings = row.original.offerings || [];
          return <Badge variant="secondary">{offerings.length}</Badge>;
        },
      },
    ],
    [expanded]
  );

  const table = useReactTable({
    data: paginationInfo.paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
    defaultColumn: {
      minSize: 50,
      maxSize: 500,
    },
    columnResizeMode: "onChange",
  });

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border">
        <Table>
          <TableCaption className="pb-2">All courses</TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.column.columnDef.size
                        ? `${header.column.columnDef.size}px`
                        : "auto",
                      minWidth: header.column.columnDef.size
                        ? `${header.column.columnDef.size}px`
                        : "auto",
                      maxWidth: header.column.columnDef.size
                        ? `${header.column.columnDef.size}px`
                        : "none",
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  {/* Main Course Row */}
                  <TableRow
                    className="cursor-pointer hover:bg-muted/50 "
                    onClick={() => navigate(`/courses/${row.original.id}`)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: cell.column.columnDef.size
                            ? `${cell.column.columnDef.size}px`
                            : "auto",
                          minWidth: cell.column.columnDef.size
                            ? `${cell.column.columnDef.size}px`
                            : "auto",
                          maxWidth: cell.column.columnDef.size
                            ? `${cell.column.columnDef.size}px`
                            : "none",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Expanded Offerings Row */}
                  {expanded[row.id] && row.original.offerings?.length > 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="bg-muted/30 p-4"
                      >
                        <div className="space-y-2">
                          <p className="text-sm font-semibold mb-2">
                            Offerings:
                          </p>
                          <div className="grid gap-2">
                            {row.original.offerings.map((offering) => (
                              <div
                                key={offering.id}
                                className="pt-7 px-7 rounded border bg-background hover:bg-muted/50 cursor-pointer transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/offerings/${offering.id}`);
                                }}
                              >
                                {/* Header row */}
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium">
                                      {offering.offering_code} - Section{" "}
                                      {offering.section}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {offering.term_code}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      · {offering.teacher_name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={
                                        offering.enrollment_open
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {offering.enrollment_open
                                        ? "Open"
                                        : "Closed"}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      {offering.seats_taken}/
                                      {offering.total_seats} seats
                                    </span>
                                  </div>
                                </div>

                                {/* Description */}
                                {offering.description && (
                                  <p className="text-sm text-muted-foreground mt-1 w-full max-w-prose break-words whitespace-pre-line leading-relaxed px-3 pt-0 pb-5">
                                    {offering.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {currentPage + 1} of {paginationInfo.totalPages} · Showing{" "}
          {paginationInfo.currentPageOfferings} of{" "}
          {paginationInfo.totalOfferings} offering
          {paginationInfo.totalOfferings === 1 ? "" : "s"}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(0)}
            disabled={!paginationInfo.canPreviousPage}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={!paginationInfo.canPreviousPage}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={!paginationInfo.canNextPage}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(paginationInfo.totalPages - 1)}
            disabled={!paginationInfo.canNextPage}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}
