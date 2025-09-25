import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PeriodFilterProps {
  value: 'month' | 'quarter' | 'year';
  onChange: (value: 'month' | 'quarter' | 'year') => void;
}

const periodOptions = [
  { value: 'month' as const, label: 'Monthly' },
  { value: 'quarter' as const, label: 'Quarterly' },
  { value: 'year' as const, label: 'Yearly' }
];

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[110px] h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periodOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}