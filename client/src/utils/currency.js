/** Format amount in Indian Rupees (INR) */
export const formatCurrency = (amount) => {
  const value = (Number(amount) || 0) * 83;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

/** Compact format for charts (e.g. ₹1.2k) */
export const formatCurrencyCompact = (amount) => {
  const value = (Number(amount) || 0) * 83;
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}k`;
  }
  return `₹${value.toFixed(0)}`;
};
