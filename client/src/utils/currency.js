/** Convert USD to INR (approximate exchange rate) */
const USD_TO_INR = 83.5;

/** Convert amount from USD to INR */
export const convertToINR = (amountInUSD) => {
  return (Number(amountInUSD) || 0) * USD_TO_INR;
};

/** Format amount in Indian Rupees (INR) */
export const formatCurrency = (amount) => {
  const value = convertToINR(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

/** Compact format for charts (e.g. ₹1.2k) */
export const formatCurrencyCompact = (amount) => {
  const value = Number(amount) || 0;
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}k`;
  }
  return `₹${value.toFixed(0)}`;
};
