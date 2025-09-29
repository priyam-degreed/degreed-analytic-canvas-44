import React from "react";
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
import { User, Star, Clock, BookOpen } from "lucide-react";

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
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getRecordIcon(category)}
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {records.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Job Role</TableHead>
                  <TableHead className="text-right">Learning Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record, index) => (
                  <TableRow key={record.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
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
      </DialogContent>
    </Dialog>
  );
}