export const emptyAddress = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
};

export const addressFromProfile = (saved) => {
  if (!saved?.addressLine1) return { ...emptyAddress };
  return {
    fullName: saved.fullName || '',
    phone: saved.phone || '',
    addressLine1: saved.addressLine1 || '',
    addressLine2: saved.addressLine2 || '',
    city: saved.city || '',
    state: saved.state || '',
    pincode: saved.pincode || '',
    country: saved.country || 'India',
  };
};

export const validateAddressForm = (address) => {
  const required = [
    ['fullName', 'Full name'],
    ['phone', 'Phone number'],
    ['addressLine1', 'Address line 1'],
    ['city', 'City'],
    ['state', 'State'],
    ['pincode', 'Pincode'],
  ];

  for (const [key, label] of required) {
    if (!address[key]?.trim()) return `${label} is required`;
  }

  if (!/^\d{6}$/.test(address.pincode.trim())) {
    return 'Pincode must be a valid 6-digit number';
  }

  const digits = address.phone.replace(/\D/g, '');
  if (digits.length < 10) return 'Enter a valid 10-digit mobile number';

  return null;
};

export const formatAddressLines = (address) => {
  if (!address?.addressLine1) return null;
  const lines = [
    address.fullName,
    address.addressLine1,
    address.addressLine2,
    `${address.city}, ${address.state} ${address.pincode}`,
    address.country || 'India',
    address.phone ? `Phone: ${address.phone}` : null,
  ].filter(Boolean);
  return lines;
};
