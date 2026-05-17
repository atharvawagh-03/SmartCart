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
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-white/80 ml-1">{label}</label>
    <div className="relative group">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-purple-400">
          <Icon className="w-4 h-4" />
        </div>
      )}
      {children}
    </div>
  </div>
);

const inputClass = (hasIcon) =>
  `w-full rounded-xl border border-white/10 bg-black/20 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all ${hasIcon ? 'pl-10 pr-3' : 'px-3'}`;

const AddressForm = ({ address, onChange, disabled = false }) => {
  const set = (field, value) => onChange({ ...address, [field]: value });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full name" icon={User}>
          <input
            type="text"
            className={inputClass(true)}
            placeholder="Name for delivery"
            value={address.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            disabled={disabled}
          />
        </Field>
        <Field label="Mobile number" icon={Phone}>
          <input
            type="tel"
            className={inputClass(true)}
            placeholder="10-digit mobile"
            value={address.phone}
            onChange={(e) => set('phone', e.target.value)}
            disabled={disabled}
            maxLength={14}
          />
        </Field>
      </div>

      <Field label="Address line 1" icon={Home}>
        <input
          type="text"
          className={inputClass(true)}
          placeholder="House no., building, street"
          value={address.addressLine1}
          onChange={(e) => set('addressLine1', e.target.value)}
          disabled={disabled}
        />
      </Field>

      <Field label="Address line 2 (optional)" icon={MapPin}>
        <input
          type="text"
          className={inputClass(true)}
          placeholder="Area, landmark"
          value={address.addressLine2}
          onChange={(e) => set('addressLine2', e.target.value)}
          disabled={disabled}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <option value="" className="bg-gray-900">Select state</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state} className="bg-gray-900">
                {state}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Pincode">
          <input
            type="text"
            className={inputClass(false)}
            placeholder="6-digit pincode"
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
