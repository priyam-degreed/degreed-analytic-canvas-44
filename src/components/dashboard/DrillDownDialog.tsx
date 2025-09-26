import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface DrillDownData {
  skill?: string;
  role?: string;
  period?: string;
  department?: string;
  contentType?: string;
  value?: number | string;
  ratingType?: string;
  employees?: number;
  additionalData?: Record<string, any>;
}

interface DrillDownDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: DrillDownData | null;
  onApplyFilter: (filterType: string, filterValue: string) => void;
  onViewDetails: () => void;
}

export function DrillDownDialog({ 
  isOpen, 
  onClose, 
  data, 
  onApplyFilter,
  onViewDetails 
}: DrillDownDialogProps) {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-4">
          {/* Card Summary */}
          {data.additionalData && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                {data.additionalData.cardType || 'Card Summary'}
              </h3>
              
              {data.additionalData.description && (
                <p className="text-sm text-muted-foreground">
                  {data.additionalData.description}
                </p>
              )}

              {/* Employee Count */}
              {data.employees !== undefined && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Employees:</span>
                  <Badge variant="outline">{data.employees}</Badge>
                </div>
              )}

              {/* Rating Distribution */}
              {data.additionalData.ratingDistribution && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Rating Distribution:</h4>
                  <div className="space-y-2">
                    {Object.entries(data.additionalData.ratingDistribution).map(([range, count]) => (
                      <div key={range} className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{range}:</span>
                        <Badge variant="outline">{count as number}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skill Breakdown */}
              {data.additionalData.skillBreakdown && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Top Skills:</h4>
                  <div className="space-y-2">
                    {Object.entries(data.additionalData.skillBreakdown)
                      .sort(([,a], [,b]) => (b as number) - (a as number))
                      .slice(0, 5)
                      .map(([skill, count]) => (
                        <div key={skill} className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{skill}:</span>
                          <Badge variant="outline">{count as number}</Badge>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Progression Tiers */}
              {data.additionalData.progressionTiers && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Progression Tiers:</h4>
                  <div className="space-y-2">
                    {Object.entries(data.additionalData.progressionTiers).map(([tier, count]) => (
                      <div key={tier} className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{tier}:</span>
                        <Badge variant="outline">{count as number}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}