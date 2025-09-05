import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ResultsTableProps {
  rows: any[];
  pageSize: number;
}

export default function ResultsTable({ rows, pageSize }: ResultsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  if (!rows || rows.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No results to display yet.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(rows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRows = rows.slice(startIndex, endIndex);

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "deliverable":
      case "valid":
        return "default";
      case "undeliverable":
      case "invalid":
        return "destructive";
      case "risky":
        return "secondary";
      default:
        return "outline";
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Risk Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {row.email || row.generated_email || "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(row.status)}>
                    {row.status || "unknown"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {row.first_name && row.last_name 
                    ? `${row.first_name} ${row.last_name}`
                    : row.name || "-"
                  }
                </TableCell>
                <TableCell>{row.company || "-"}</TableCell>
                <TableCell>
                  {row.risk_score !== undefined 
                    ? Math.round(row.risk_score * 100) + "%" 
                    : "-"
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, rows.length)} of {rows.length} results
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}