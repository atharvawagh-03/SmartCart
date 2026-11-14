import { MapPin, User, Phone, Home } from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
];

const Field = ({ label, icon: Icon, children }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-white/70">{label}</label>
    <div className="relative group">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-blue-500">
          <Icon className="w-3.5 h-3.5" />
        </div>
      )}
      {children}
    </div>
  </div>
);

const inputClass = (hasIcon) =>
  `w-full rounded-lg border border-border bg-black/10 dark:bg-black/30 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${hasIcon ? 'pl-9 pr-3' : 'px-3'}`;

const AddressForm = ({ address, onChange, disabled = false }) => {
  const set = (field, value) => onChange({ ...address, [field]: value });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Full Name" icon={User}>
          <input
            type="text"
            className={inputClass(true)}
            placeholder="Recipient name"
            value={address.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            disabled={disabled}
          />
        </Field>
        <Field label="Mobile Number" icon={Phone}>
          <input
            type="tel"
            className={inputClass(true)}
            placeholder="10-digit mobile number"
            value={address.phone}
            onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            disabled={disabled}
            maxLength={10}
          />
        </Field>
      </div>

      <Field label="Address Line 1" icon={Home}>
        <input
          type="text"
          className={inputClass(true)}
          placeholder="House no., building, street"
          value={address.addressLine1}
          onChange={(e) => set('addressLine1', e.target.value)}
          disabled={disabled}
        />
      </Field>

      <Field label="Address Line 2 (Optional)" icon={MapPin}>
        <input
          type="text"
          className={inputClass(true)}
          placeholder="Apartment, suite, landmark"
          value={address.addressLine2}
          onChange={(e) => set('addressLine2', e.target.value)}
          disabled={disabled}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field label="City">
          <input
            type="text"
            className={inputClass(false)}
            placeholder="City"
            value={address.city}
            onChange={(e) => set('city', e.target.value)}
            disabled={disabled}
          />
        </Field>
        <Field label="State">
          <select
            className={inputClass(false)}
            value={address.state}
            onChange={(e) => set('state', e.target.value)}
            disabled={disabled}
          >
            <option value="" className="bg-zinc-900">Select state</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state} className="bg-zinc-900">
                {state}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Pincode">
          <input
            type="text"
            className={inputClass(false)}
            placeholder="6-digit PIN"
            value={address.pincode}
            onChange={(e) => set('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
            disabled={disabled}
            maxLength={6}
          />
        </Field>
      </div>
    </div>
  );
};

export default AddressForm;
