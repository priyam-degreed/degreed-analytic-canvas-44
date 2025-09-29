import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getRecordIcon(category)}
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          {records.map((record, index) => (
            <Card key={record.id} className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        #{index + 1}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {record.name}
                        </h4>
                        {record.department && (
                          <Badge variant="outline" className="text-xs">
                            {record.department}
                          </Badge>
                        )}
                      </div>
                      
                      {record.description && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {record.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {record.role && (
                          <span>{record.role}</span>
                        )}
                        {record.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>{record.rating.toFixed(1)}</span>
                          </div>
                        )}
                        {record.hours && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{record.hours}h</span>
                          </div>
                        )}
                        {record.completions && (
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span>{record.completions} completions</span>
                          </div>
                        )}
                        {record.lastActivity && (
                          <span>Last: {record.lastActivity}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-lg">
                      {formatValue(record.value, category)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {records.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No records found for this category.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}