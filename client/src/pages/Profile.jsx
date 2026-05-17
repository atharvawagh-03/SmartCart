import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { User, Shield, ArrowLeft, Edit, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import AddressForm from '../components/AddressForm';
import { emptyAddress, addressFromProfile, validateAddressForm, formatAddressLines } from '../utils/address';

const Profile = () => {
  const { user } = useAuth();
  const [savedAddress, setSavedAddress] = useState(null);
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState(emptyAddress);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.shippingAddress?.addressLine1) {
        setSavedAddress(data.shippingAddress);
        setAddress(addressFromProfile(data.shippingAddress));
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveAddress = async () => {
    const validationError = validateAddressForm(address);
    if (validationError) {
      setError(validationError);
      setMessage(null);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put('/api/users/address', address, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedAddress(data.shippingAddress);
      setEditing(false);
      setMessage('Address saved successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const addressLines = savedAddress ? formatAddressLines(savedAddress) : null;

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Home</span>
        </Link>

        <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />

          <div className="relative">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            {message && (
              <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-green-300 text-sm">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {message}
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-300 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-black/20 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Personal Information</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Full Name</span>
                    <span className="text-white font-medium">{user?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Email</span>
                    <span className="text-white font-medium">{user?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/20 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Account Details</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Role</span>
                    <span className="text-white font-medium capitalize">{user?.role || 'User'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Account Status</span>
                    <span className="text-green-400 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/20 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <MapPin className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Saved Delivery Address</h3>
                </div>
                {!editing && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(true);
                      setMessage(null);
                      setError(null);
                      if (savedAddress) setAddress(addressFromProfile(savedAddress));
                      else setAddress({ ...emptyAddress, fullName: user?.name || '' });
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 transition-colors text-purple-400 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    {savedAddress ? 'Edit' : 'Add Address'}
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
              ) : editing ? (
                <div>
                  <AddressForm address={address} onChange={setAddress} disabled={saving} />
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleSaveAddress}
                      disabled={saving}
                      className="btn-primary max-w-xs"
                    >
                      {saving ? 'Saving...' : 'Save Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setError(null);
                      }}
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : savedAddress ? (
                <div className="text-white/80 text-sm space-y-1">
                  {addressLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              ) : (
                <p className="text-white/50 text-sm">
                  No saved address yet. Add one here or at checkout — it will be saved for your next order.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
