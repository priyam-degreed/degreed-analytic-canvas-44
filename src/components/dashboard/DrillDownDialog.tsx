import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Filter, X, TrendingUp, Users, Calendar } from "lucide-react";

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

  const handleFilterApply = (filterType: string, filterValue: string) => {
    onApplyFilter(filterType, filterValue);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-foreground">Drill Down Options</DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-muted-foreground">
            Choose how you'd like to explore this data point
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Data Summary */}
          <div className="p-4 bg-muted/30 rounded-lg space-y-2">
            <h4 className="text-sm font-semibold text-foreground mb-2">Selected Data Point</h4>
            
            {data.skill && (
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Skill:</span>
                <Badge variant="secondary">{data.skill}</Badge>
              </div>
            )}
            
            {data.period && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Period:</span>
                <Badge variant="secondary">{data.period}</Badge>
              </div>
            )}
            
            {data.role && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Role:</span>
                <Badge variant="secondary">{data.role}</Badge>
              </div>
            )}
            
            {data.value !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Value:</span>
                <Badge variant="outline">
                  {typeof data.value === 'number' ? data.value.toFixed(1) : data.value}
                </Badge>
              </div>
            )}
          </div>

          {/* Additional Data Display */}
          {data.additionalData && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  {data.additionalData.cardType || 'Details'}
                </h4>
                
                {data.additionalData.description && (
                  <p className="text-sm text-muted-foreground">
                    {data.additionalData.description}
                  </p>
                )}

                {/* Employee Count */}
                {data.employees !== undefined && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Total Employees:</span>
                    <Badge variant="outline">{data.employees}</Badge>
                  </div>
                )}

                {/* Data Breakdown */}
                {data.additionalData.breakdown && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Breakdown:</span>
                    {Object.entries(data.additionalData.breakdown).map(([key, values]: [string, any]) => (
                      <div key={key} className="ml-2">
                        <span className="text-xs text-muted-foreground capitalize">{key}:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Array.isArray(values) ? values.map((value: string) => (
                            <Badge key={value} variant="secondary" className="text-xs">
                              {value}
                            </Badge>
                          )) : (
                            <Badge variant="secondary" className="text-xs">{values}</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Rating Distribution */}
                {data.additionalData.ratingDistribution && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Rating Distribution:</span>
                    <div className="space-y-1">
                      {Object.entries(data.additionalData.ratingDistribution).map(([range, count]) => (
                        <div key={range} className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">{range}:</span>
                          <Badge variant="outline">{count as number}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skill Breakdown */}
                {data.additionalData.skillBreakdown && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Top Skills:</span>
                    <div className="space-y-1">
                      {Object.entries(data.additionalData.skillBreakdown)
                        .sort(([,a], [,b]) => (b as number) - (a as number))
                        .slice(0, 5)
                        .map(([skill, count]) => (
                          <div key={skill} className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">{skill}:</span>
                            <Badge variant="outline">{count as number}</Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Progression Tiers */}
                {data.additionalData.progressionTiers && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Progression Tiers:</span>
                    <div className="space-y-1">
                      {Object.entries(data.additionalData.progressionTiers).map(([tier, count]) => (
                        <div key={tier} className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">{tier}:</span>
                          <Badge variant="outline">{count as number}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <Separator />

          {/* Filter Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Filter Options</h4>
            
            {data.skill && (
              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start"
                onClick={() => handleFilterApply('skills', data.skill!)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter by Skill: {data.skill}
              </Button>
            )}
            
            {data.period && (
              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start"
                onClick={() => handleFilterApply('timePeriod', data.period!)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter by Period: {data.period}
              </Button>
            )}
            
            {data.role && (
              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start"
                onClick={() => handleFilterApply('roles', data.role!)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter by Role: {data.role}
              </Button>
            )}
            
            {data.ratingType && (
              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start"
                onClick={() => handleFilterApply('ratingTypes', data.ratingType!)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter by Rating Type: {data.ratingType}
              </Button>
            )}
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={onViewDetails}
              className="flex-1"
            >
              View Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}