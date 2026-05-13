import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, Mail, Shield, ArrowLeft, Edit, MapPin, Phone, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

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
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">My Profile</h1>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 transition-colors text-purple-400">
                <Edit className="w-4 h-4" />
                <span className="text-sm font-medium">Edit Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/20 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Personal Information</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Full Name</span>
                    <span className="text-white font-medium">{user?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Email</span>
                    <span className="text-white font-medium">{user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Phone</span>
                    <span className="text-white font-medium">Not provided</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Date of Birth</span>
                    <span className="text-white font-medium">Not provided</span>
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Role</span>
                    <span className="text-white font-medium capitalize">{user?.role || 'User'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Member Since</span>
                    <span className="text-white font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Account Status</span>
                    <span className="text-green-400 font-medium">Active</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/20 border border-white/10 rounded-2xl p-6 md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <MapPin className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Saved Addresses</h3>
                </div>
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60 text-sm mb-4">No saved addresses yet</p>
                  <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white text-sm">
                    Add Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
