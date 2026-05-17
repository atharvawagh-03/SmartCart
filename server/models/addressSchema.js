const mongoose = require("mongoose");

const addressSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true, default: "" },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, default: "India", trim: true },
  },
  { _id: false }
);

const validateAddress = (address) => {
  const required = ["fullName", "phone", "addressLine1", "city", "state", "pincode"];
  for (const field of required) {
    if (!address?.[field]?.trim()) {
      return `${field} is required`;
    }
  }
  if (!/^\d{6}$/.test(address.pincode.trim())) {
    return "Pincode must be a valid 6-digit Indian pincode";
  }
  if (!/^[6-9]\d{9}$/.test(address.phone.replace(/\D/g, "").slice(-10))) {
    return "Phone must be a valid 10-digit Indian mobile number";
  }
  return null;
};

module.exports = { addressSchema, validateAddress };
