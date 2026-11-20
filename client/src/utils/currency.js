/**
 * SmartCart stores all product prices natively in Indian Rupees (INR).
 */

/** Format amount in Indian Rupees (INR) without decimals for clean display */
export const formatCurrency = (amount) => {
  const value = Math.round(Number(amount) || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/** Convert amount (noop since amounts are already in INR) */
export const convertToINR = (amount) => {
  return Math.round(Number(amount) || 0);
};

/** Compact format for charts (e.g. ₹1.2k, ₹1.5L) */
export const formatCurrencyCompact = (amount) => {
  const value = Math.round(Number(amount) || 0);
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}k`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
};
