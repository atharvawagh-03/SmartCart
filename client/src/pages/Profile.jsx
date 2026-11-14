import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { User, Shield, ArrowLeft, Edit, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import AddressForm from '../components/AddressForm';
import { emptyAddress, addressFromProfile, validateAddressForm, formatAddressLines } from '../utils/address';
import ThemeToggle from '../components/ThemeToggle';

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
    <div className="min-h-screen pb-16">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white/60 hover:text-white transition-colors p-1" aria-label="Back to home">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-white">SmartCart</span>
              <span className="text-white/30 text-xs">/</span>
              <span className="text-xs font-medium text-white/60">Profile</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Personal Profile
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Manage your account credentials and default delivery address.
          </p>
        </div>

        {message && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-white border-b border-border pb-3">
              <User className="w-4 h-4 text-white/60" />
              <h2 className="text-sm font-semibold tracking-tight">Identity</h2>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-white/50">Full Name</span>
                <span className="text-white font-medium">{user?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/50">Email</span>
                <span className="text-white font-medium">{user?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-white border-b border-border pb-3">
              <Shield className="w-4 h-4 text-white/60" />
              <h2 className="text-sm font-semibold tracking-tight">Access & Role</h2>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-white/50">Account Role</span>
                <span className="text-white font-medium capitalize">{user?.role || 'User'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/50">Status</span>
                <span className="text-emerald-500 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Delivery Address */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-white/60" />
              <h2 className="text-sm font-semibold tracking-tight text-white">Saved Delivery Address</h2>
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
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-medium text-white transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>{savedAddress ? 'Edit' : 'Add Address'}</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-6">
              <div className="w-5 h-5 border-2 border-border border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : editing ? (
            <div className="space-y-4 pt-1">
              <AddressForm address={address} onChange={setAddress} disabled={saving} />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  disabled={saving}
                  className="btn-primary !w-auto px-4 py-2 text-xs"
                >
                  {saving ? 'Saving...' : 'Save Address'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setError(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-border bg-surface hover:bg-surface-hover text-white text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : savedAddress ? (
            <div className="text-white/80 text-xs space-y-1">
              {addressLines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          ) : (
            <p className="text-white/50 text-xs">
              No saved address on file. Add one here to streamline future checkouts.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
