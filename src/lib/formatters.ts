/**
 * Number formatting utilities for consistent display across the application
 */

export interface FormatNumberOptions {
  /** Always show 2 decimal places */
  alwaysShowDecimals?: boolean;
  /** Maximum number of decimal places */
  maxDecimals?: number;
  /** Minimum number of decimal places */
  minDecimals?: number;
  /** Currency symbol for currency formatting */
  currency?: string;
}

/**
 * Format numbers in compact notation (K, M, B) with proper decimal precision
 */
export function formatNumber(
  value: number | string,
  options: FormatNumberOptions = {}
): string {
  const {
    alwaysShowDecimals = true,
    maxDecimals = 2,
    minDecimals = 2,
    currency,
  } = options;

  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0.00';

  // Handle zero and very small numbers
  if (Math.abs(num) < 1) {
    const formatted = num.toFixed(minDecimals);
    return currency ? `${currency}${formatted}` : formatted;
  }

  // Determine the scale and suffix
  let scaledValue: number;
  let suffix: string;

  if (Math.abs(num) >= 1_000_000_000) {
    scaledValue = num / 1_000_000_000;
    suffix = 'B';
  } else if (Math.abs(num) >= 1_000_000) {
    scaledValue = num / 1_000_000;
    suffix = 'M';
  } else if (Math.abs(num) >= 1_000) {
    scaledValue = num / 1_000;
    suffix = 'K';
  } else {
    scaledValue = num;
    suffix = '';
  }

  // Format with appropriate decimal places
  const decimals = alwaysShowDecimals || suffix ? minDecimals : maxDecimals;
  const formatted = scaledValue.toFixed(decimals);

  const result = `${formatted}${suffix}`;
  return currency ? `${currency}${result}` : result;
}

/**
 * Format percentages with 2 decimal places
 */
export function formatPercentage(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0.00%';
  return `${num.toFixed(2)}%`;
}

/**
 * Format ratings with 2 decimal places and star symbol
 */
export function formatRating(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0.00★';
  return `${num.toFixed(2)}★`;
}

/**
 * Format currency values in compact notation
 */
export function formatCurrency(value: number | string, symbol = '$'): string {
  return formatNumber(value, { currency: symbol });
}

/**
 * Format duration in hours with compact notation
 */
export function formatHours(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0.00 hrs';
  
  const formatted = formatNumber(num);
  return `${formatted} hrs`;
}

/**
 * Format change values with + or - prefix
 */
export function formatChange(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '+0.00';
  
  const formatted = formatNumber(Math.abs(num));
  const prefix = num >= 0 ? '+' : '-';
  return `${prefix}${formatted}`;
}

/**
 * Format chart values for tooltips and labels
 */
export function formatChartValue(
  value: number | string,
  type: 'number' | 'percentage' | 'rating' | 'currency' | 'hours' = 'number'
): string {
  switch (type) {
    case 'percentage':
      return formatPercentage(value);
    case 'rating':
      return formatRating(value);
    case 'currency':
      return formatCurrency(value);
    case 'hours':
      return formatHours(value);
    default:
      return formatNumber(value);
  }
}