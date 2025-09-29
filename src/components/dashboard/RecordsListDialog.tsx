import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User, Star, Clock, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

interface RecordItem {
  id: string;
  name: string;
  value: number | string;
  description?: string;
  department?: string;
  role?: string;
  rating?: number;
  hours?: number;
  completions?: number;
  lastActivity?: string;
}

interface RecordsListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  records: RecordItem[];
  category: string;
}

export function RecordsListDialog({ 
  isOpen, 
  onClose, 
  title,
  records,
  category
}: RecordsListDialogProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  
  // Pagination logic
  const { paginatedRecords, totalPages, startRecord, endRecord } = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginated = records.slice(startIndex, endIndex);
    const totalPages = Math.ceil(records.length / recordsPerPage);
    
    return {
      paginatedRecords: paginated,
      totalPages,
      startRecord: startIndex + 1,
      endRecord: Math.min(endIndex, records.length)
    };
  }, [records, currentPage]);

  // Reset page when dialog opens or records change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [isOpen, records]);

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  const getRecordIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'learners':
      case 'employees':
        return <User className="h-4 w-4" />;
      case 'skills':
        return <Star className="h-4 w-4" />;
      case 'courses':
      case 'content':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const formatValue = (value: number | string, category: string) => {
    if (typeof value === 'number') {
      if (category.toLowerCase().includes('rating')) {
        return `${value.toFixed(1)} ⭐`;
      }
      if (category.toLowerCase().includes('hours')) {
        return `${value}h`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getRecordIcon(category)}
            {title}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            {records.length > 0 ? (
              <>Showing {startRecord}-{endRecord} of {records.length} records</>
            ) : (
              "No records found"
            )}
          </div>
        </DialogHeader>
        
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {paginatedRecords.length > 0 ? (
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Job Role</TableHead>
                  <TableHead className="text-right">Learning Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.map((record, index) => (
                  <TableRow key={record.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-muted-foreground">
                      {startRecord + index}
                    </TableCell>
                    <TableCell className="font-medium">
                      {record.name}
                    </TableCell>
                    <TableCell>
                      {record.department || "N/A"}
                    </TableCell>
                    <TableCell>
                      {record.role || "N/A"}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {record.hours ? `${record.hours}h` : "0h"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No records found for this category.
            </div>
          )}
        </div>
        
        {/* Pagination Controls */}
        {records.length > recordsPerPage && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Page {currentPage} of {totalPages}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}